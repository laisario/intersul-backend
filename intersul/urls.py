"""
URL configuration for intersul project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from usuarios.views import LoginView, RegistrarUsuarioView
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from usuarios.views import FuncionarioViewSet, ClienteViewSet
from copiadoras.views import (
    CopiadoraViewSet,
    FranquiaViewSet,
    CopiadoraClienteViewSet,
    FuncionalidadesViewSet,
    MarcaViewSet
)
from enderecos.views import RegistrarEnderecoView


router = DefaultRouter()
router.register(r"clientes", ClienteViewSet, basename="cliente")
router.register(r"funcionarios", FuncionarioViewSet, basename="funcionario")
router.register(r'copiadoras', CopiadoraViewSet)
router.register(r'franquias', FranquiaViewSet)
router.register(r'copiadora-clientes', CopiadoraClienteViewSet)
router.register(r'funcionalidades', FuncionalidadesViewSet)
router.register(r'marcas', MarcaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh-token/", TokenRefreshView.as_view(), name="refresh_token"),
    path(
        "registrar/localizacao/", RegistrarEnderecoView.as_view(), name="registrar-localizacao"
    ),
    path("register/usuario/", RegistrarUsuarioView.as_view(), name="registrar-usuario"),
    path("", include(router.urls)),
]
