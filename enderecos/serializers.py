from rest_framework import serializers

from .models import UF, Bairro, Cidade, Endereco

class UFSerializer(serializers.ModelSerializer):
    class Meta:
        model = UF
        fields = "__all__"

class CidadeSerializer(serializers.ModelSerializer):
    uf = UFSerializer()
    class Meta:
        model = Cidade
        fields = "__all__"

class BairroSerializer(serializers.ModelSerializer):
    cidade = CidadeSerializer()
    class Meta:
        model = Bairro
        fields = "__all__"

class WriteEnderecoSerializer(serializers.ModelSerializer):
    bairro = serializers.CharField(required=False, write_only=True)
    estado = serializers.CharField(required=False, write_only=True)
    cidade = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = Endereco
        fields = "__all__"

    def validate(self, data):
        uf, created = UF.objects.get_or_create(sigla=data["estado"])
        cidade, created = Cidade.objects.get_or_create(nome=data["cidade"], uf=uf)
        bairro, created = Bairro.objects.get_or_create(
            nome=data["bairro"], cidade=cidade
        )
        del data["cidade"]
        del data["estado"]
        data["bairro"] = bairro
        return data



class ReadEnderecoSerializer(serializers.ModelSerializer):
    bairro = BairroSerializer()

    class Meta:
        model = Endereco
        fields = "__all__"

