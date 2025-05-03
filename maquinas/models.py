from django.db import models
from django.utils.translation import gettext_lazy as _

class Maquina(models.Model):
    tipo = models.CharField(max_length=100) 
    marca = models.CharField(max_length=50)
    modelo = models.CharField(max_length=100)
    descricao = models.TextField(blank=True)
    imagem = models.ImageField(upload_to="maquinas")

    def __str__(self):
        return f"{self.marca} {self.modelo}"
    

class TipoFolha(models.TextChoices):
    A4 = "A4", _("A4")
    A3 = "A3", _("A3")

 
class Franquia(models.Model):
    folha = models.CharField(
        max_length=2, 
        choices=TipoFolha, 
        default=TipoFolha.A4,
        verbose_name="Tipo de folha"
    )
    colorida = models.BooleanField(default=False)
    quantidade = models.IntegerField()
    preco_unidade = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Preço unidade"
    )
    valor_total = models.DecimalField(max_digits=12, decimal_places=2, blank=True)

    def save(self, *args, **kwargs):
        self.valor_total = self.quantidade * self.preco_unidade
        super().save(*args, **kwargs)


class TipoAquisicao(models.TextChoices):
    ALUGADA = "A", _("Alugada")
    VENDIDA = "V", _("Vendida")
    EXTERNA = "E", _("Externa")


class MaquinaCliente(models.Model):
    maquina = models.ForeignKey(Maquina, on_delete=models.PROTECT, related_name="maquinas_instanciadas")
    franquia = models.ForeignKey(Franquia, on_delete=models.SET_NULL, related_name="maquinas_clientes", null=True)
    numero_de_serie = models.CharField(max_length=100)
    tipo_aquisicao = models.CharField(max_length=1, choices=TipoAquisicao, default=TipoAquisicao.ALUGADA)
    frequencia_manutencao = models.IntegerField(help_text="Frequência da manutenção em meses", verbose_name="Frequência de manutenção em meses")


