"""Outbox processing, run by ``manage.py leadgen_run_jobs`` (Cloud Scheduler).

There is no Celery/Redis on this Cloud Run service, so background work lives
in the ``OutboxJob`` table. Jobs are claimed with a conditional UPDATE, so two
overlapping runs never process the same job.
"""
import logging
from datetime import timedelta

from django.utils import timezone

from .clients import IntegrationNotConfigured
from .models import OutboxJob, ProspectContact
from .services import crm_sync

logger = logging.getLogger(__name__)

BACKOFF_MINUTES = (1, 5, 30, 120, 720)
# While the integration is switched off, re-check this often without using up attempts.
DISABLED_RECHECK = timedelta(minutes=30)


def run_job(job):
    """Run one claimed job and record the outcome. Returns the final status."""
    job.attempts += 1
    try:
        if job.kind == OutboxJob.Kind.CRM_SYNC:
            crm_sync.sync_contact(job.contact, job=job)
        job.status, job.last_error = OutboxJob.Status.DONE, ""
    except (crm_sync.SyncDisabled, IntegrationNotConfigured) as exc:
        job.attempts -= 1
        job.status, job.last_error = OutboxJob.Status.PENDING, str(exc)
        job.next_attempt_at = timezone.now() + DISABLED_RECHECK
    except Exception as exc:
        logger.exception("Outbox job %s failed", job.pk)
        job.last_error = f"{exc.__class__.__name__}: {exc}"[:2000]
        if job.attempts >= job.max_attempts:
            job.status = OutboxJob.Status.FAILED
            if job.contact_id:
                ProspectContact.objects.filter(pk=job.contact_id).update(
                    crm_sync_status=ProspectContact.CrmSync.FAILED,
                    crm_sync_error=job.last_error,
                )
        else:
            job.status = OutboxJob.Status.PENDING
            delay = BACKOFF_MINUTES[min(job.attempts, len(BACKOFF_MINUTES)) - 1]
            job.next_attempt_at = timezone.now() + timedelta(minutes=delay)
    job.save()
    return job.status


def claim(job):
    return OutboxJob.objects.filter(pk=job.pk, status=OutboxJob.Status.PENDING) \
        .update(status=OutboxJob.Status.RUNNING) == 1


def run_pending_jobs(limit=50):
    counts = {"done": 0, "pending": 0, "failed": 0}
    due = OutboxJob.objects.filter(status=OutboxJob.Status.PENDING,
                                   next_attempt_at__lte=timezone.now())[:limit]
    for job in list(due):
        if not claim(job):
            continue
        job.refresh_from_db()
        counts[run_job(job)] += 1
    return counts


def requeue_stuck(older_than=timedelta(minutes=30)):
    """Jobs left RUNNING by a crashed run go back to PENDING."""
    return OutboxJob.objects.filter(status=OutboxJob.Status.RUNNING,
                                    updated_at__lt=timezone.now() - older_than) \
        .update(status=OutboxJob.Status.PENDING)
