from django.urls import path
from . import views

app_name = 'apollo_smartlead'
urlpatterns = [
    path('health/', views.integration_health, name='health'),
    path('apollo/people-search/', views.apollo_people_search, name='apollo-people-search'),
    path('smartlead/campaigns/', views.smartlead_campaigns, name='smartlead-campaigns'),
    path('smartlead/webhook/', views.smartlead_webhook, name='smartlead-webhook'),
]
