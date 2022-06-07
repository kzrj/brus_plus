# # -*- coding: utf-8 -*-
from django.db.models import Q, Sum

from rest_framework.response import Response
from rest_framework import serializers, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from cash.models import CashRecord
from stock.models import Shop
from stock_operations.models import Sale


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


    class DailyCashReportPermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                if request.GET.get('shop') and \
                    (int(request.GET.get('shop')) == request.user.account.shop.pk):
                    return True
            return False

    permission_classes = [permissions.IsAuthenticated, DailyCashReportPermissions]

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