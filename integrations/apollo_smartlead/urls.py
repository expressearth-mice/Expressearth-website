from django.urls import path

from . import views
from .webhooks import ApolloPhoneWebhookAPIView, SmartleadWebhookAPIView

app_name = "apollo_smartlead"

# Mounted at /api/integrations/ (blogBackend/urls.py).
urlpatterns = [
    path("health/", views.HealthAPIView.as_view(), name="health"),
    path("me/", views.MeAPIView.as_view(), name="me"),

    path("apollo/company-search/", views.CompanySearchAPIView.as_view(), name="apollo-company-search"),
    path("apollo/people-search/", views.PeopleSearchAPIView.as_view(), name="apollo-people-search"),
    path("apollo/enrich/", views.EnrichAPIView.as_view(), name="apollo-enrich"),
    path("apollo/usage/", views.ApolloUsageAPIView.as_view(), name="apollo-usage"),
    path("apollo/phone-webhook/<str:token>/", ApolloPhoneWebhookAPIView.as_view(),
         name="apollo-phone-webhook"),

    path("companies/", views.CompanyListAPIView.as_view(), name="company-list"),
    path("leads/", views.LeadListAPIView.as_view(), name="lead-list"),
    path("leads/approve/", views.LeadApproveAPIView.as_view(), name="lead-approve"),
    path("leads/reject/", views.LeadRejectAPIView.as_view(), name="lead-reject"),
    path("leads/assign/", views.LeadAssignAPIView.as_view(), name="lead-assign"),
    path("leads/<int:pk>/", views.LeadDetailAPIView.as_view(), name="lead-detail"),

    path("suppressions/", views.SuppressionListCreateAPIView.as_view(), name="suppression-list"),
    path("suppressions/<int:pk>/", views.SuppressionDeleteAPIView.as_view(),
         name="suppression-delete"),

    path("campaigns/", views.CampaignListCreateAPIView.as_view(), name="campaign-list"),
    path("campaigns/<int:pk>/", views.CampaignDetailAPIView.as_view(), name="campaign-detail"),
    path("campaigns/<int:pk>/verify-sender/", views.CampaignVerifySenderAPIView.as_view(),
         name="campaign-verify-sender"),
    path("campaigns/<int:pk>/approve/", views.CampaignApproveAPIView.as_view(),
         name="campaign-approve"),
    path("campaigns/<int:pk>/register-webhook/", views.CampaignWebhookAPIView.as_view(),
         name="campaign-register-webhook"),
    path("campaigns/<int:pk>/status/", views.CampaignStatusAPIView.as_view(),
         name="campaign-status"),
    path("campaigns/<int:pk>/enroll/", views.CampaignEnrollAPIView.as_view(),
         name="campaign-enroll"),
    path("campaigns/<int:pk>/stats/", views.CampaignStatsAPIView.as_view(), name="campaign-stats"),
    path("campaigns/<int:pk>/leads/<int:contact_id>/<str:action>/",
         views.CampaignLeadActionAPIView.as_view(), name="campaign-lead-action"),

    path("webhooks/smartlead/<str:token>/", SmartleadWebhookAPIView.as_view(),
         name="smartlead-webhook"),

    path("crm/sync/<int:contact_id>/", views.CrmSyncAPIView.as_view(), name="crm-sync"),
    path("api-logs/", views.ApiCallLogListAPIView.as_view(), name="api-logs"),
]
