from django.core.management.base import BaseCommand
from django.db.models import Q

from integrations.apollo_smartlead.clients import (
    IntegrationNotConfigured,
    ProviderAPIError,
    SmartleadClient,
)
from integrations.apollo_smartlead.models import Campaign
from integrations.apollo_smartlead.services import campaign_manager


class Command(BaseCommand):
    help = ("Pull status/stats/lead ids from Smartlead for live campaigns this app uses "
            "(and, if SMARTLEAD_PUSH_BLOCKLIST is on, push suppressions). Run hourly.")

    def handle(self, *args, **options):
        try:
            client = SmartleadClient()
        except IntegrationNotConfigured as exc:
            self.stdout.write(f"Skipped: {exc}")
            return

        pushed = campaign_manager.push_suppressions(client=client)
        # Only campaigns we created or enrolled leads into; finished ones are left alone.
        campaigns = Campaign.objects.exclude(smartlead_campaign_id=None) \
            .filter(status__in=campaign_manager.LIVE_STATUSES) \
            .filter(Q(created_by__isnull=False) | Q(enrollments__isnull=False)).distinct()
        synced, failed = 0, 0
        for campaign in campaigns:
            try:
                campaign_manager.reconcile(campaign, client=client)
                synced += 1
            except ProviderAPIError as exc:
                failed += 1
                self.stderr.write(f"Campaign {campaign.pk}: {exc}")
        self.stdout.write(f"suppressions_pushed={pushed} campaigns_synced={synced} "
                          f"failed={failed}")
