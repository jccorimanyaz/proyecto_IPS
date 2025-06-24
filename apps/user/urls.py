from django.urls import path
from apps.user import views
urlpatterns = [
    path('list/', views.ListUserView.as_view()),
    path('create/', views.CreateUserView.as_view())
]
