from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from enderecos.models import UF, Bairro, Cidade, Endereco
from enderecos.serializers import ReadEnderecoSerializer
from .models import Cliente, Funcionario


class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(LoginSerializer, cls).get_token(user)
        token["nome"] = user.cliente.__str__() if hasattr(user, "cliente") else user.username
        token["admin"] = user.is_superuser
        return token


class RegistrarFuncionarioSerializer(serializers.ModelSerializer):
    cpf = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    cnpj = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = Funcionario
        fields = (
            "id",
            "nome",
            "cnpj",
            "telefone",
            "cpf",
            "endereco",
            "usuario",
            "cargo",
            "setor"
        )

    def validate(self, data):
        cpf = data.get('cpf')
        cnpj = data.get('cnpj')
        if not cpf and not cnpj:
            raise serializers.ValidationError("Informe CPF ou CNPJ.")
        return data
    

class RegistrarClienteSerializer(serializers.ModelSerializer):
    cpf = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    cnpj = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = Cliente
        fields = (
            "id",
            "nome",
            "cnpj",
            "telefone",
            "cpf",
            "endereco",
            "usuario",
            "como_conheceu",
        )

    def validate(self, data):
        cpf = data.get('cpf')
        cnpj = data.get('cnpj')
        if not cpf and not cnpj:
            raise serializers.ValidationError("Informe CPF ou CNPJ.")
        return data


class RegistrarUsuarioSerializer(serializers.Serializer):
    cliente = serializers.BooleanField(write_only=True)
    usuario_id = serializers.IntegerField(write_only=True)

    username = serializers.CharField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    email = serializers.EmailField(max_length=None, min_length=None, allow_blank=False)

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data["username"], 
            email=validated_data["email"]
        )
        user.set_password(validated_data["password"])
        user.save()

        if validated_data["cliente"]:
            cliente = Cliente.objects.get(id=validated_data["usuario_id"])
            cliente.usuario = user
            cliente.save()
        else:
            funcionario = Funcionario.objects.get(id=validated_data["usuario_id"])
            funcionario.usuario = user
            funcionario.save()

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {'password': {'write_only': True}}


class FuncionarioSerializer(serializers.ModelSerializer):
    endereco = ReadEnderecoSerializer()
    usuario = UserSerializer()

    class Meta:
        model = Funcionario
        fields = (
            "id",
            "nome",
            "cnpj",
            "telefone",
            "cpf",
            "endereco",
            "usuario",
            "cargo",
            "setor"
        )


class ClienteSerializer(serializers.ModelSerializer):
    endereco = ReadEnderecoSerializer()
    usuario = UserSerializer()

    class Meta:
        model = Cliente
        fields = (
            "id",
            "nome",
            "cnpj",
            "telefone",
            "cpf",
            "endereco",
            "usuario",
            "como_conheceu",
        )
