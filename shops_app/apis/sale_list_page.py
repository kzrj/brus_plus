# # -*- coding: utf-8 -*-
from django.utils import timezone

from rest_framework import generics, serializers, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django_filters import rest_framework as filters

from stock.models import LumberRecord, Lumber
from stock_operations.models import Sale
from core.serializers import AnnotateFieldsModelSerializer, ChoiceField


# sales list
class SalesListView(generics.ListAPIView):

    class SaleReadSerializer(serializers.ModelSerializer):

        class SaleLumberRecordSerializer(serializers.ModelSerializer):
            lumber = serializers.StringRelatedField()
            wood_species = ChoiceField(source='lumber.wood_species', read_only=True,
             choices=Lumber.SPECIES)
            
            class Meta:
                model = LumberRecord
                fields = ['lumber', 'quantity', 'volume', 'selling_price', 'selling_total_cash',
                 'shop_price', 'shop_total_cash', 'wood_species']

        lumber_records = SaleLumberRecordSerializer(many=True)
        initiator = serializers.ReadOnlyField(source='initiator.account.nickname')
        seller_name = serializers.ReadOnlyField()
        date = serializers.DateTimeField(format='%d/%m', read_only=True)

        class Meta:
            model = Sale
            exclude = ['created_at', 'modified_at']


    class SaleFilter(filters.FilterSet):
        date = filters.DateFromToRangeFilter()

        class Meta:
            model = Sale
            fields = ['shop', 'date', 'seller']


    class CanSeeShopSalePermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                if request.GET.get('shop') and \
                    (int(request.GET.get('shop')) == request.user.account.shop.pk):
                    return True
            return False

    queryset = Sale.objects.all() \
        .select_related('initiator__account') \
        .prefetch_related('lumber_records__lumber',)
    serializer_class = SaleReadSerializer
    permission_classes = [IsAuthenticated, CanSeeShopSalePermissions ]
    filter_class = SaleFilter

    def list(self, request):
        data = dict()
        queryset = self.filter_queryset(self.get_queryset())
                
        serializer = self.SaleReadSerializer(queryset, many=True)
        data['sales'] = serializer.data
        data['totals'] = queryset.calc_totals()

        return Response(data)


class DeleteSaleView(generics.DestroyAPIView):

    class SaleReadSerializer(serializers.ModelSerializer):

        class SaleLumberRecordSerializer(serializers.ModelSerializer):
            lumber = serializers.StringRelatedField()
            wood_species = ChoiceField(source='lumber.wood_species', read_only=True,
                 choices=Lumber.SPECIES)
            
            class Meta:
                model = LumberRecord
                fields = ['lumber', 'quantity', 'volume', 'selling_price', 'selling_total_cash',
                 'shop_price', 'shop_total_cash', 'wood_species']

        lumber_records = SaleLumberRecordSerializer(many=True)
        initiator = serializers.ReadOnlyField(source='initiator.account.nickname')
        seller_name = serializers.ReadOnlyField()
        date = serializers.DateTimeField(format='%d/%m', read_only=True)

        class Meta:
            model = Sale
            exclude = ['created_at', 'modified_at']


    class DeletePermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method == 'DELETE':
                return True

            return False

        def has_object_permission(self, request, view, obj):
            if request.method == 'DELETE':
                return request.user.account.shop == obj.shop

            return False

    permission_classes = [IsAuthenticated, DeletePermissions]

    def get_queryset(self):
        return Sale.objects.filter(shop=self.request.user.account.shop)

    def destroy(self, request, pk=None):
        sale = self.get_object()
        sale.delete()
        queryset = self.get_queryset()
        return Response({
            'sales': self.SaleReadSerializer(queryset, many=True).data,
            'totals': queryset.calc_totals()
            },
            status=status.HTTP_200_OK)