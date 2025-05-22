from rest_framework import serializers
from usuarios.models import Funcionario, Cliente
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


class RegistrarEnderecoSerializer(serializers.Serializer):
    cliente = serializers.BooleanField(write_only=True)
    usuario_id = serializers.IntegerField(write_only=True)

    uf = serializers.CharField(write_only=True)
    cidade = serializers.CharField(write_only=True)
    bairro = serializers.CharField(write_only=True)
    logradouro = serializers.CharField(write_only=True)
    numero = serializers.IntegerField(write_only=True)
    complemento = serializers.CharField(required=False, write_only=True)
    cep = serializers.CharField(write_only=True)

    def create(self, validated_data):
        uf, created = UF.objects.get_or_create(sigla=validated_data.get("uf"))
        cidade, created = Cidade.objects.get_or_create(
            uf=uf, nome=validated_data.get("cidade")
        )
        bairro, created = Bairro.objects.get_or_create(
            cidade=cidade, nome=validated_data.get("bairro")
        )
        endereco, created = Endereco.objects.get_or_create(
            cep=validated_data.get("cep"),
            numero=validated_data.get("numero"),
            bairro=bairro,
            logradouro=validated_data.get("logradouro"),
            complemento=validated_data.get("complemento", ""),
        )

        if validated_data["cliente"]:
            cliente = Cliente.objects.get(id=validated_data["usuario_id"])
            cliente.endereco = endereco
            cliente.save()
        else: 
            funcionario = Funcionario.objects.get(id=validated_data["usuario_id"])
            funcionario.endereco = endereco
            funcionario.save()

        return cliente



class ReadEnderecoSerializer(serializers.ModelSerializer):
    bairro = BairroSerializer()

    class Meta:
        model = Endereco
        fields = "__all__"

