from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class Cliente(models.Model):
    usuario = models.OneToOneField(
        User, on_delete=models.CASCADE, verbose_name="Usuário", null=True, blank=True
    )
    nome = models.CharField(blank=True, null=True, max_length=112) 
    telefone = models.CharField(max_length=25, null=True, blank=True)
    cnpj = models.CharField(max_length=25, null=True, blank=True, verbose_name="C.P.F.")
    cpf = models.CharField(max_length=25, null=True, blank=True, verbose_name="C.N.P.J")
    endereco = models.ForeignKey(
        "enderecos.Endereco",
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="Endereço",
    )


    def __str__(self):
        return self.nome
    

class Setores(models.TextChoices):
    ADMINISTRATIVO = "A", _("Administrativo")
    TECNICO = "T", _("Técico")
    COMERCIAL = "C", _("Comercial")

class Funcionario(models.Model):
    usuario = models.OneToOneField(
        User, on_delete=models.CASCADE, verbose_name="Usuário", null=True, blank=True
    )
    nome = models.CharField(blank=True, null=True, max_length=112) 
    telefone = models.CharField(max_length=25, null=True, blank=True)
    cnpj = models.CharField(max_length=25, null=True, blank=True, verbose_name="C.P.F.")
    cpf = models.CharField(max_length=25, null=True, blank=True, verbose_name="C.N.P.J")
    endereco = models.ForeignKey(
        "enderecos.Endereco",
        on_delete=models.SET_NULL,
        null=True,
        verbose_name="Endereço",
    )
    cargo = models.CharField(blank=True, null=True, max_length=50) 
    setor = models.CharField(
        max_length=1,
        choices=Setores.choices,
        default=Setores.ADMINISTRATIVO ,
    )

    def __str__(self):
        return f"{self.nome} - {self.setor} {self.cargo}"