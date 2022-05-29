# # -*- coding: utf-8 -*-
from rest_framework.response import Response
from rest_framework import generics, serializers, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from django_filters import rest_framework as filters

from stock.models import Lumber, Shop, LumberRecord, LumberSawRate

from core.serializers import AnnotateFieldsModelSerializer


class LumberStockListView(generics.ListAPIView):

    class LumberStockReadSerializer(AnnotateFieldsModelSerializer):
        stock_total_cash = serializers.ReadOnlyField()
        
        class Meta:
            model = Lumber
            fields = '__all__'


    class LumberStockFilter(filters.FilterSet):
        shop = filters.NumberFilter(method='filter_shop')

        def filter_shop(self, queryset, name, value):
            shop = Shop.objects.filter(pk=value).first()
            if shop:
                return queryset.add_shop_current_stock(shop=shop)
            return queryset

        class Meta:
            model = Lumber
            fields = '__all__'


    class CanSeeShopStockPermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                if request.GET.get('shop') and \
                    (int(request.GET.get('shop')) == request.user.account.shop.pk):
                    return True
            return False

    queryset = Lumber.objects.all().prefetch_related('records')
    serializer_class = LumberStockReadSerializer
    permission_classes = [IsAuthenticated, CanSeeShopStockPermissions]
    filter_class = LumberStockFilter


class SetLumberMarketPriceView(APIView):

    class SetLumberPermission(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method == 'POST' and request.user.account.is_manager:
                return True

            return False

    permission_classes = [SetLumberPermission]

    class SetLumberMarketPriceSerializer(serializers.Serializer):
        lumber = serializers.PrimaryKeyRelatedField(queryset=Lumber.objects.all())
        shop_rate = serializers.IntegerField()

    def post(self, request, format=None):
        serializer = self.SetLumberMarketPriceSerializer(data=request.data)

        if serializer.is_valid():
            lumber = serializer.validated_data['lumber']
            lumber_saw_rate = LumberSawRate.objects.get(lumber=lumber,
                shop=self.request.user.account.shop)

            lumber_saw_rate.employee_rate = serializer.validated_data['shop_rate']
            lumber_saw_rate.save()

            return Response({
                'lumber': lumber.pk,
                'shop_rate': lumber_saw_rate.employee_rate,
                'message': 'Успешно изменено',
                },
                status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)