from django.contrib import admin
from django.contrib.auth.models import Group
from django.utils.translation import gettext_lazy as _

from .models import Cliente, Funcionario


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "telefone", "endereco")


@admin.register(Funcionario)
class EmpresaAdmin(admin.ModelAdmin):
    list_display = ("id", "nome", "setor", "cargo")


admin.site.unregister(Group)
admin.site.index_title = _("Painel Administrativo")
admin.site.site_header = _("InterSul cópias")
admin.site.site_title = _("InterSul cópias")