from django.contrib.auth.models import User
from rest_framework import filters, generics, permissions, status, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from .serializers import (RegistrarUsuarioSerializer, ClienteSerializer, LoginSerializer, RegistrarClienteSerializer, RegistrarFuncionarioSerializer, FuncionarioSerializer)
from enderecos.models import Endereco
from .models import Cliente, Funcionario

# como fazer pra so registrar so quem for do setor adm (pode ser quem for superuser)

class LoginView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self, *args, **kwargs):
        if self.action == "list" or self.action == "retrieve":
            return ClienteSerializer
        return RegistrarClienteSerializer

    def get_queryset(self):
        return Cliente.objects.all().order_by()

class FuncionarioViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    def get_serializer_class(self, *args, **kwargs):
        if self.action == "list" or self.action == "retrieve":
            return FuncionarioSerializer
        return RegistrarFuncionarioSerializer

    def get_queryset(self):
        return Funcionario.objects.all().order_by()



class RegistrarUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegistrarUsuarioSerializer



