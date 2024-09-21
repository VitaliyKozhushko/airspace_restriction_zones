from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from .serializers import RegistrationSerializer, LoginSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class RegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description='Регистрация пользователя',
        operation_summary='Регистрация',
        tags=['Аутентификация и регистрация'],
        responses={
            201: openapi.Response(
                description='Пользователь успешно зарегистрирован',
                examples={
                    'application/json': {
                        'message': 'Пользователь успешно зарегистрирован'
                    }
                }
            ),
            400: openapi.Response(
                description='Ошибка валидации',
                examples={
                    'application/json': {
                        'username': ['Это поле обязательно.'],
                        'password': ['Пароль должен быть не менее 8 символов.']
                    }
                }
            )
        }
    )
    def post(self, request, *args, **kwargs):
        """
        Добавление нового пользователя в БД
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            'message': 'Пользователь успешно зарегистрирован'
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description='Аутентификация пользователя',
        operation_summary='Аутентификация',
        tags=['Аутентификация и регистрация'],
        responses={
            200: openapi.Response(
                description='Успешная аутентификация',
                examples={
                    'application/json': {
                        'access_token': 'eyJhbGciOiJIUzI1NiIsInR...',
                        'refresh_token': 'dGhpcyBpcyBhIHJlZnJlc2ggdG9r...'
                    }
                }
            ),
            400: openapi.Response(
                description='Неверный логин или пароль',
                examples={
                    'application/json': {
                        'error': 'Неверный логин или пароль'
                    }
                }
            ),
            401: openapi.Response(
                description='Ошибка валидации',
                examples={
                    'application/json': {
                        'username': ['Это поле обязательно.'],
                        'password': ['Это поле обязательно.']
                    }
                }
            )
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Ошибки валидации: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)
        serializer.is_valid(raise_exception=True)
        user = authenticate(username=serializer.validated_data['username'], password=serializer.validated_data['password'])
        if user:
            tokens = serializer.get_token(user)
            return Response(tokens, status=status.HTTP_200_OK)
        return Response({'error': 'Неверный логин или пароль'}, status=status.HTTP_400_BAD_REQUEST)
