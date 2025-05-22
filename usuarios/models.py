from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _


class ComoConheceu(models.TextChoices):
    REDES_SOCIAIS = "RS", _("Redes sociais")
    GOOGLE = "G", _("Google")
    INDICACAO = "I", _("Indicação")
    OUTRO = "O", _("Outro")

class Cliente(models.Model):
    usuario = models.OneToOneField(
        User, on_delete=models.CASCADE, verbose_name="Usuário", null=True, blank=True
    )
    nome = models.CharField(blank=True, null=True, max_length=112) 
    telefone = models.CharField(max_length=25, null=True, blank=True)
    cnpj = models.CharField(max_length=25, null=True, blank=True, verbose_name="C.P.F.")
    cpf = models.CharField(max_length=25, null=True, blank=True, verbose_name="C.N.P.J")
    como_conheceu = models.CharField(
        max_length=2,
        choices=ComoConheceu.choices,
        default=ComoConheceu.OUTRO,
    )
    endereco = models.OneToOneField(
        "enderecos.Endereco",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )


    def __str__(self):
        return self.nome
    

class Setores(models.TextChoices):
    ADMINISTRATIVO = "A", _("Administrativo")
    TECNICO = "T", _("Técnico")
    COMERCIAL = "C", _("Comercial")

class Funcionario(models.Model):
    usuario = models.OneToOneField(
        User, on_delete=models.CASCADE, verbose_name="Usuário", null=True, blank=True
    )
    nome = models.CharField(blank=True, null=True, max_length=112) 
    telefone = models.CharField(max_length=25, null=True, blank=True)
    cnpj = models.CharField(max_length=25, null=True, blank=True, verbose_name="C.P.F.")
    cpf = models.CharField(max_length=25, null=True, blank=True, verbose_name="C.N.P.J")
    cargo = models.CharField(blank=True, null=True, max_length=50) 
    setor = models.CharField(
        max_length=1,
        choices=Setores.choices,
        default=Setores.ADMINISTRATIVO ,
    )
    endereco = models.OneToOneField(
        "enderecos.Endereco",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )



    def __str__(self):
        return f"{self.nome} - {self.setor} {self.cargo}"