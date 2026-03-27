from drf_spectacular.utils import extend_schema
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import (
    TokenBlacklistView,
    TokenObtainPairView,
    TokenRefreshView,
)

from .serializers import RegisterSerializer, UserSerializer


@extend_schema(tags=["Auth"])
class RegisterView(CreateAPIView):
    """
    Creates a new account.
    """

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


@extend_schema(tags=["Auth"])
class LoginView(TokenObtainPairView):
    """
    Authenticates user using email and password.
    """

    pass


@extend_schema(tags=["Auth"])
class RefreshView(TokenRefreshView):
    """
    Refresh JWT and blacklist before.
    """

    pass


@extend_schema(tags=["Auth"])
class LogoutView(TokenBlacklistView):
    """
    Take a token and blacklist it, so user cannot use it again.
    """

    pass


@extend_schema(tags=["Auth"])
class MeView(RetrieveAPIView):
    """
    Retrieve the currently authenticated user.
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
