from django.contrib import admin
from .models import Franquia, Copiadora, CopiadoraCliente, Funcionalidade, ImagemCopiadora


class ImagemCopiadoraInline(admin.TabularInline):
    model = ImagemCopiadora
    extra = 1


@admin.register(Copiadora)
class CopiadoraAdmin(admin.ModelAdmin):
    list_display = ['modelo', 'fabricante']
    search_fields = ['modelo', 'fabricante']
    inlines = [ImagemCopiadoraInline]
    filter_horizontal = ['funcionalidades']


@admin.register(Funcionalidade)
class FuncionalidadeAdmin(admin.ModelAdmin):
    list_display = ['nome']


@admin.register(Franquia)
class FranquiaAdmin(admin.ModelAdmin):
    list_display = ('periodo', 'folha', 'colorida', 'quantidade', 'preco_unidade', 'valor')
    list_filter = ('colorida', 'periodo')
    search_fields = ('folha',)


@admin.register(CopiadoraCliente)
class CopiadoraClienteAdmin(admin.ModelAdmin):
    list_display = ('copiadora', 'franquia', 'numero_de_serie', 'tipo_aquisicao', 'frequencia_manutencao')
    list_filter = ('tipo_aquisicao',)
    search_fields = ('numero_de_serie',)
