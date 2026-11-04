from django.core.management.base import BaseCommand

from integrations.apollo_smartlead.tasks import requeue_stuck, run_pending_jobs


class Command(BaseCommand):
    help = "Process due lead-generation outbox jobs (CRM sync). Run every ~5 min."

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=50)

    def handle(self, *args, **options):
        requeued = requeue_stuck()
        counts = run_pending_jobs(limit=options["limit"])
        self.stdout.write(f"requeued={requeued} done={counts['done']} "
                          f"retrying={counts['pending']} failed={counts['failed']}")
