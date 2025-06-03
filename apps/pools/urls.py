from django.urls import path
from .views import (
    PoolsByStateView,
    PoolsByDistrictView,
    PoolStatisticsView,
    PoolFilterView
)

urlpatterns = [
    path('state/<str:state>/', PoolsByStateView.as_view(), name='pools-by-state'),
    path('district/<str:district>/', PoolsByDistrictView.as_view(), name='pools-by-district'),
    path('statistics/', PoolStatisticsView.as_view(), name='pool-statistics'),
    path('filters/', PoolFilterView.as_view(), name='pool-filters'),
]
