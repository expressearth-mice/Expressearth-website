from django.apps import AppConfig


class ApolloSmartleadConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "integrations.apollo_smartlead"
    label = "apollo_smartlead"
    verbose_name = "Lead generation (Apollo + Smartlead + EmpFly CRM)"
