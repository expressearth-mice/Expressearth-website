from django.core.management.base import BaseCommand

from integrations.apollo_smartlead.services import connectivity


class Command(BaseCommand):
    help = ("Check the configured Apollo / Smartlead / EmpFly CRM credentials. Read-only: "
            "no Apollo credits are used and nothing is created or sent.")

    def handle(self, *args, **options):
        styles = {"ok": self.style.SUCCESS, "partial": self.style.WARNING,
                  "not_configured": self.style.WARNING, "error": self.style.ERROR}
        for name, result in connectivity.check_all().items():
            self.stdout.write(styles[result["status"]](
                f"{name}: {result['status'].upper()} - {result['detail']}"))
            for key, value in result.items():
                if key not in ("status", "detail"):
                    self.stdout.write(f"    {key}: {value}")
