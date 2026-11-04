"""Lead-generation roles, kept separate from the site's content roles.

``is_staff`` already means "can edit website content" in the other apps, so it
is deliberately *not* used here. Groups are created by
``manage.py leadgen_setup_roles``.
"""
from rest_framework.permissions import BasePermission

from . import conf

ADMIN_GROUP = "Leadgen Admin"
MANAGER_GROUP = "Leadgen Manager"
EXECUTIVE_GROUP = "Leadgen Executive"


def _in_group(user, *names):
    return user.groups.filter(name__in=names).exists()


def is_campaign_approver(user):
    """Only the explicitly configured CEO account may approve campaign sends. Fail closed."""
    approver_id = conf.leadgen_campaign_approver_user_id()
    return bool(approver_id and user and user.is_authenticated and str(user.pk) == approver_id)


def is_leadgen_admin(user):
    """Verifies sender domains, approves campaigns for sending, lifts suppressions."""
    return bool(user and user.is_authenticated
                and (user.is_superuser or _in_group(user, ADMIN_GROUP)))


def is_leadgen_manager(user):
    """Searches, enriches, approves, assigns and runs campaigns."""
    return is_leadgen_admin(user) or bool(user and user.is_authenticated
                                          and _in_group(user, MANAGER_GROUP))


def is_leadgen_member(user):
    """Any lead-gen role; executives only see the leads assigned to them."""
    return is_leadgen_manager(user) or bool(user and user.is_authenticated
                                            and _in_group(user, EXECUTIVE_GROUP))


class IsCampaignApprover(BasePermission):
    def has_permission(self, request, view):
        return is_campaign_approver(request.user)


class IsLeadgenAdmin(BasePermission):
    def has_permission(self, request, view):
        return is_leadgen_admin(request.user)


class IsLeadgenManager(BasePermission):
    def has_permission(self, request, view):
        return is_leadgen_manager(request.user)


class IsLeadgenMember(BasePermission):
    def has_permission(self, request, view):
        return is_leadgen_member(request.user)
