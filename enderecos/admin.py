from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import UF, Bairro, Cidade, Endereco

@admin.register(UF)
class UFAdmin(admin.ModelAdmin):
    list_display = ("id", "sigla")

@admin.register(Cidade)
class CidadeAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "uf")


@admin.register(Bairro)
class BairroAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "cidade")


@admin.register(Endereco)
class EnderecoAdmin(admin.ModelAdmin):
    list_display = ("id", "cep", "logradouro", "numero", "bairro", "complemento",)



admin.site.index_title = _("Painel Administrativo")
admin.site.site_header = _("InterSul cópias")
admin.site.site_title = _("InterSul cópias")