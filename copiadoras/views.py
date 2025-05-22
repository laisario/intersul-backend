from rest_framework import viewsets
from .models import Franquia, Copiadora, CopiadoraCliente, Funcionalidade, Marca
from .serializers import (
    FranquiaReadSerializer, FranquiaWriteSerializer,
    CopiadoraReadSerializer, CopiadoraWriteSerializer,
    CopiadoraClienteReadSerializer, CopiadoraClienteWriteSerializer,
    FuncionalidadeSerializer, MarcaSerializer
)

class FranquiaViewSet(viewsets.ModelViewSet):
    queryset = Franquia.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return FranquiaReadSerializer
        return FranquiaWriteSerializer

class CopiadoraViewSet(viewsets.ModelViewSet):
    queryset = Copiadora.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CopiadoraReadSerializer
        return CopiadoraWriteSerializer

class CopiadoraClienteViewSet(viewsets.ModelViewSet):
    queryset = CopiadoraCliente.objects.all()

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CopiadoraClienteReadSerializer
        return CopiadoraClienteWriteSerializer

class FuncionalidadesViewSet(viewsets.ModelViewSet):
    queryset = Funcionalidade.objects.all()
    serializer_class = FuncionalidadeSerializer

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer