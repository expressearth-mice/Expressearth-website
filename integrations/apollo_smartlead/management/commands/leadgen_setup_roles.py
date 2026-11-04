from django.contrib.auth.models import Group, Permission
from django.core.management.base import BaseCommand

from integrations.apollo_smartlead.permissions import (
    ADMIN_GROUP,
    EXECUTIVE_GROUP,
    MANAGER_GROUP,
)

APP = "apollo_smartlead"

# model -> actions, per group. Admin gets every permission of the app.
_MANAGER = {
    "prospectcontact": ("view", "change"),
    "prospectcompany": ("view", "change"),
    "campaign": ("view", "change"),
    "campaignenrollment": ("view",),
    "outreachevent": ("view",),
    "suppressionentry": ("view", "add"),
    "salesexecutiveprofile": ("view", "add", "change"),
    "outboxjob": ("view", "change"),
    "webhookevent": ("view",),
    "prospectsearch": ("view",),
}
_EXECUTIVE = {
    "prospectcontact": ("view",),
    "prospectcompany": ("view",),
    "outreachevent": ("view",),
}


class Command(BaseCommand):
    help = "Create/refresh the Leadgen Admin / Manager / Executive groups (idempotent)."

    def _grant(self, group, spec):
        codenames = [f"{action}_{model}" for model, actions in spec.items() for action in actions]
        perms = Permission.objects.filter(content_type__app_label=APP, codename__in=codenames)
        group.permissions.set(perms)
        return perms.count()

    def handle(self, *args, **options):
        admin, _ = Group.objects.get_or_create(name=ADMIN_GROUP)
        admin.permissions.set(Permission.objects.filter(content_type__app_label=APP))
        manager, _ = Group.objects.get_or_create(name=MANAGER_GROUP)
        executive, _ = Group.objects.get_or_create(name=EXECUTIVE_GROUP)
        counts = {
            ADMIN_GROUP: admin.permissions.count(),
            MANAGER_GROUP: self._grant(manager, _MANAGER),
            EXECUTIVE_GROUP: self._grant(executive, _EXECUTIVE),
        }
        for name, count in counts.items():
            self.stdout.write(f"{name}: {count} permissions")
        self.stdout.write(self.style.SUCCESS("Lead-generation roles are ready."))
