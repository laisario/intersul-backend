from django.db import models
from decimal import Decimal
from usuarios.models import Cliente

class Franquia(models.Model):
    periodo = models.PositiveIntegerField(
        help_text="Período da franquia em meses"
    )
    folha = models.CharField(
        max_length=100,
        help_text="Tipo de folha (ex: A4, Ofício, etc.)"
    )
    colorida = models.BooleanField(
        default=False,
        help_text="Marque se a impressão é colorida"
    )
    quantidade = models.PositiveIntegerField()
    preco_unidade = models.DecimalField(
        max_digits=8,
        decimal_places=2,
    )
    valor = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        editable=False,
    )

    def save(self, *args, **kwargs):
        self.valor = (self.preco_unidade or Decimal('0.00')) * (self.quantidade or 0)
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.quantidade} páginas ({'Colorida' if self.colorida else 'PB'}) - {self.valor} R$"



class Funcionalidade(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome

class Marca(models.Model):
    nome = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nome

class Copiadora(models.Model):
    modelo = models.CharField(max_length=100)
    fabricante = models.CharField(max_length=100)
    descricao = models.TextField()
    cartucho = models.CharField(max_length=100)
    caracteristicas = models.TextField()
    velocidade = models.CharField(max_length=100)
    funcionalidades = models.ManyToManyField(Funcionalidade, blank=True)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE, related_name='copiadoras', default='brother')

    def __str__(self):
        return f"{self.modelo} - {self.fabricante}"
    

class ImagemCopiadora(models.Model):
    copiadora = models.ForeignKey(Copiadora, on_delete=models.CASCADE, related_name='imagens')
    imagem = models.ImageField(upload_to='copiadoras/')

    def __str__(self):
        return f"Imagem de {self.copiadora}"


class CopiadoraCliente(models.Model):
    TIPO_AQUISICAO_CHOICES = [
        ('alugada', 'Alugada'),
        ('vendida', 'Vendida'),
        ('externo', 'Externo'),
    ]
    cliente = models.ForeignKey(Cliente, related_name='copiadoras', on_delete=models.CASCADE)
    copiadora = models.ForeignKey(Copiadora, on_delete=models.CASCADE)
    franquia = models.ForeignKey('Franquia', on_delete=models.CASCADE)
    numero_de_serie = models.CharField(max_length=100, unique=True)
    tipo_aquisicao = models.CharField(
        max_length=10,
        choices=TIPO_AQUISICAO_CHOICES
    )
    frequencia_manutencao = models.PositiveIntegerField(
        null=True, blank=True,
        help_text="Frequência da manutenção em meses"
    )

    def __str__(self):
        return f"{self.copiadora.modelo} - Nº série: {self.numero_de_serie}"