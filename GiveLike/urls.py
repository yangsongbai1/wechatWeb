from django.urls import path

from . import views

app_name = 'GiveLike'
urlpatterns = [
    path('', views.index, name='index')
]
