from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from django.db.models import Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import Pool
from .serializers import PoolSerializer


# Vista para listar piscinas por estado
class PoolsByStateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, state):
        pools = Pool.objects.filter(state=state)
        serializer = PoolSerializer(pools, many=True)
        return Response(serializer.data)


# Vista para listar piscinas por distrito
class PoolsByDistrictView(ListAPIView):
    serializer_class = PoolSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        district = self.kwargs['district']
        return Pool.objects.filter(district__iexact=district)


# Vista para estadísticas de piscinas por estado
class PoolStatisticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = Pool.objects.values('state').annotate(count=Count('id'))
        return Response(stats)


# Vista genérica con filtro avanzado y paginación
class PoolFilterView(ListAPIView):
    queryset = Pool.objects.all()
    serializer_class = PoolSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['state', 'current_state', 'district']
