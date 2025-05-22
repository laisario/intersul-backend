from rest_framework import serializers
from .models import Marca, Franquia, Copiadora, CopiadoraCliente, Funcionalidade, ImagemCopiadora

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nome']
# --- Franquia ---
class FranquiaReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Franquia
        fields = '__all__'

class FranquiaWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Franquia
        fields = ['periodo', 'folha', 'colorida', 'quantidade', 'preco_unidade']

# --- Copiadora ---
class ImagemCopiadoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagemCopiadora
        fields = ['id', 'imagem', 'descricao']


class CopiadoraReadSerializer(serializers.ModelSerializer):
    imagens = ImagemCopiadoraSerializer(many=True, read_only=True)
    marca = MarcaSerializer(read_only=True)
    class Meta:
        model = Copiadora
        fields = '__all__'

class CopiadoraWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Copiadora
        fields = [
            'modelo',
            'fabricante',
            'descricao', 
            'cartucho', 
            'caracteristicas', 
            'velocidade', 
            'funcionalidades'
            'imagens',
        ]

class ImagemCopiadoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagemCopiadora
        fields = ['id', 'imagem', 'descricao']


# --- CopiadoraCliente ---
class CopiadoraClienteReadSerializer(serializers.ModelSerializer):
    copiadora = CopiadoraReadSerializer(read_only=True)
    franquia = FranquiaReadSerializer(read_only=True)

    class Meta:
        model = CopiadoraCliente
        fields = '__all__'

class CopiadoraClienteWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CopiadoraCliente
        fields = ['copiadora', 'franquia', 'numero_de_serie', 'tipo_aquisicao', 'frequencia_manutencao']

# --- Funcionalidade ---
class FuncionalidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Funcionalidade
        fields = ['nome']
