from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import (RegistrarEnderecoSerializer)
from .models import Endereco

class RegistrarEnderecoView(generics.CreateAPIView):
    queryset = Endereco.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegistrarEnderecoSerializer