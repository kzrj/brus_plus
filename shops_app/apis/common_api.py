# # -*- coding: utf-8 -*-
import time

from django.contrib.auth.models import User
from django.db.models import Q, Subquery, OuterRef, Count, Prefetch, F, Sum

from rest_framework.response import Response
from rest_framework import generics, serializers, permissions, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from django_filters import rest_framework as filters

from stock.models import Lumber, Shop, LumberRecord
from stock_operations.models import Shift, Sale, ReSaw
from cash.models import CashRecord 

from core.serializers import AnnotateFieldsModelSerializer, ChoiceField


# shop stock
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


# shifts list
class ShiftListView(generics.ListAPIView):

    class ShiftReadSerializer(serializers.ModelSerializer):

        class LumberRecordSerializer(serializers.ModelSerializer):
            lumber = serializers.StringRelatedField()
            wood_species = serializers.ReadOnlyField(source='lumber.wood_species')

            class Meta:
                model = LumberRecord
                fields = ('lumber', 'quantity', 'volume', 'rate', 'total_cash', 'back_total_cash',
                 'wood_species',)

        lumber_records = LumberRecordSerializer(many=True)
        employees = serializers.StringRelatedField(read_only=True, many=True)
        date = serializers.DateTimeField(format='%d/%m', read_only=True)
        volume_without_zabor = serializers.ReadOnlyField()

        class Meta:
            model = Shift
            fields = '__all__'


    class ShiftFilter(filters.FilterSet):
        date = filters.DateFromToRangeFilter()

        class Meta:
            model = Shift
            fields = ['shop', 'date']


    class CanSeeShopShiftPermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                if request.GET.get('shop') and \
                    (int(request.GET.get('shop')) == request.user.account.shop.pk):
                    return True
            return False

    queryset = Shift.objects.all().prefetch_related('lumber_records')
    serializer_class = ShiftReadSerializer
    permission_classes = [IsAuthenticated, CanSeeShopShiftPermissions ]
    filter_class = ShiftFilter


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


# cashrecords list
class CashRecordsListView(generics.ListAPIView):

    class CashRecordSerializer(serializers.ModelSerializer):
        class Meta:
            model = CashRecord
            fields = ['created_at', 'amount', 'note', 'record_type']


    class ExpensesFilter(filters.FilterSet):
        created_at = filters.DateFromToRangeFilter()

        class Meta:
            model = CashRecord
            fields = ['created_at', 'shop']


    class CanSeeShopCashPermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                if request.GET.get('shop') and \
                    (int(request.GET.get('shop')) == request.user.account.shop.pk):
                    return True
            return False

    queryset = CashRecord.objects.all()
    serializer_class = CashRecordSerializer
    permission_classes = [IsAuthenticated, CanSeeShopCashPermissions]
    filter_class = ExpensesFilter


# daily reports
class DailyReport(APIView):

    class DateSerializer(serializers.Serializer):
        date = serializers.DateField(format="%Y-%m-%d")
        shop = serializers.PrimaryKeyRelatedField(queryset=Shop.objects.all())


    class CashRecordSerializer(serializers.ModelSerializer):
        class Meta:
            model = CashRecord
            fields = ['created_at', 'amount', 'note', 'record_type']


    class SaleSimpleCashSerializer(serializers.ModelSerializer):
        seller_name = serializers.ReadOnlyField()

        class Meta:
            model = Sale
            fields = ['client', 'selling_total_cash', 'seller_name', 'seller_fee', 'kladman_fee', 
                'loader_fee', 'delivery_fee']


    class CanSeeShopDailyCashReportPermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                if request.GET.get('shop') and \
                    (int(request.GET.get('shop')) == request.user.account.shop.pk):
                    return True
            return False

    authentication_classes = [JSONWebTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated, CanSeeShopDailyCashReportPermissions]

    def get(self, request, format=None):
        data = dict()
        serializer = self.DateSerializer(data={'date': request.GET.get('date'), 
            'shop': request.GET.get('shop')})
        if serializer.is_valid():
            records = CashRecord.objects.filter(created_at__date=serializer.validated_data['date'],
             shop=serializer.validated_data['shop'])
            data['records'] = self.CashRecordSerializer(records, many=True).data
            data['income_records'] = self.CashRecordSerializer(records.filter(record_type='sale_income'),
                 many=True).data
            data['income_records_total'] = records.filter(record_type='sale_income').calc_sum()
            data['expense_records'] = self.CashRecordSerializer(
                records.filter(Q(record_type='shop_expenses') | Q(record_type='withdraw_employee')),
                 many=True).data
            data['expense_records_total'] = records.filter(
                Q(record_type='shop_expenses') | Q(record_type='withdraw_employee')).calc_sum()
            data['records_total'] = records.calc_sum_incomes_expenses()

            sales = Sale.objects.filter(date__date=serializer.validated_data['date'],
                shop=serializer.validated_data['shop'])
            data['sales'] = self.SaleSimpleCashSerializer(sales, many=True).data
            data['sales_totals'] = sales.calc_totals()

            data['sales_sellers_fee'] = [
                {'name': 'Сергей', 'total': sales.filter(seller__account__nickname='Сергей') \
                .aggregate(sum_seller_fee=Sum('seller_fee'))['sum_seller_fee']},
                {'name': 'Дарима', 'total': sales.filter(seller__account__nickname='Дарима') \
                .aggregate(sum_seller_fee=Sum('seller_fee'))['sum_seller_fee']}
            ]

            return Response(data)
        else:
            return Response({'message': 'Неверная дата.'}, status=status.HTTP_400_BAD_REQUEST)


class SaleCalcDataView(APIView):

    class LumberSimpleSerializer(serializers.ModelSerializer):
        lumber = serializers.ReadOnlyField(source='pk')

        class Meta:
            model = Lumber
            fields = ['name', 'lumber_type', 'wood_species', 'id', 'lumber', 'round_volume']


    class LumberSerializer(serializers.ModelSerializer):
        quantity = serializers.IntegerField(default=0)
        volume_total = serializers.FloatField(default=0)
        lumber = serializers.ReadOnlyField(source='pk')
        shop_price = serializers.ReadOnlyField(source='market_cost')
        selling_price = serializers.ReadOnlyField(source='market_cost')
        selling_total_cash = serializers.ReadOnlyField(source='market_cost')
        calc_type = serializers.CharField(default='exact')

        class Meta:
            model = Lumber
            exclude = ['created_at', 'modified_at', 'employee_rate', 'market_cost']

    def get(self, request):
        return Response({
            'pine_brus_lumbers': self.LumberSimpleSerializer(
                Lumber.objects.filter(lumber_type='brus', wood_species='pine'), many=True).data,
            'pine_doska_lumbers': self.LumberSimpleSerializer(
                Lumber.objects.filter(lumber_type='doska', wood_species='pine'), many=True).data,
            'lumbers': self.LumberSerializer(
                Lumber.objects.all(), many=True).data,
            }, status=status.HTTP_200_OK)


# resaws list
class ResawListView(generics.ListAPIView):

    class ReSawSerializer(serializers.ModelSerializer):
        lumber_in = serializers.ReadOnlyField(source='lumber_in.lumber.name')
        lumber_in_quantity = serializers.ReadOnlyField(source='lumber_in.quantity')
        lumber_in_wood_species = serializers.ReadOnlyField(source='lumber_in.lumber.wood_species')

        lumber_out = serializers.ReadOnlyField(source='lumber_out.lumber.name')
        lumber_out_quantity = serializers.ReadOnlyField(source='lumber_out.quantity')
        lumber_out_wood_species = serializers.ReadOnlyField(source='lumber_out.lumber.wood_species')

        who = serializers.ReadOnlyField(source='initiator.account.nickname')

        class Meta:
            model = ReSaw
            fields = ['id', 'created_at', 'lumber_in', 'lumber_in_quantity', 'lumber_out', 
                'lumber_out_quantity', 'who', 'lumber_in_wood_species', 'lumber_out_wood_species']


    class ResawFilter(filters.FilterSet):
        date = filters.DateFromToRangeFilter()

        class Meta:
            model = ReSaw
            fields = ['shop', 'date',]


    class CanSeeShopResawPermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                if request.GET.get('shop') and \
                    (int(request.GET.get('shop')) == request.user.account.shop.pk):
                    return True
            return False

    queryset = ReSaw.objects.all()
    serializer_class = ReSawSerializer
    permission_classes = [IsAuthenticated, CanSeeShopResawPermissions]
    filter_class = ResawFilter
