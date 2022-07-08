# -*- coding: utf-8 -*-
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.exceptions import PermissionDenied, NotAuthenticated

from rest_framework import status, exceptions, serializers
from rest_framework.views import exception_handler as drf_exception_handler

from django.utils.encoding import force_text
from django.db.utils import IntegrityError as DjangoIntegrityError

from accounts.models import Account
from stock.models import Shop


class CustomValidation(exceptions.APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Error'

    def __init__(self, detail, field, status_code):
        if status_code is not None:
            self.status_code = status_code
        if detail is not None:
            self.detail = {field: force_text(detail)}
        else: self.detail = {'detail': force_text(self.default_detail)}


def custom_exception_handler(exc, context):
    if isinstance(exc, PermissionDenied):
        exc = PermissionDenied(detail={'message': 'Ошибка доступа. У вас нет прав.'})

    if isinstance(exc, NotAuthenticated):
        exc = NotAuthenticated(detail={'message': 'Ошибка доступа. Вы не авторизованы'})
    
    if isinstance(exc, CustomValidation):
        field = list(exc.detail.keys())[0]
        exc = DRFValidationError(detail={'message': field + ' ' + exc.detail[field]})

    if isinstance(exc, DjangoValidationError):
        if hasattr(exc, 'message_dict'):
            # TODO: handle many fields
            field = list(exc.detail.keys())[0]
            
            exc = DRFValidationError(detail={'message': field + ' ' + exc.detail[field]})
        else:
            exc = DRFValidationError(detail={'message': exc.message})

    if isinstance(exc, DjangoIntegrityError):
        exc = DRFValidationError(detail={'message': str(exc)})

    return drf_exception_handler(exc, context)


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ('id', 'name', 'sale_type')


class EmployeeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    shop = serializers.StringRelatedField()
    shop_id = serializers.ReadOnlyField(source='shop.pk')
    shop_type = serializers.ReadOnlyField(source='shop.stock_type')
    can_see_shop_stock = ShopSerializer(source='shop', read_only=True)

    class Meta:
        model = Account
        exclude = ('created_at', 'modified_at')


def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': EmployeeSerializer(user.account).data
    }