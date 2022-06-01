# # -*- coding: utf-8 -*-
from django.db.models import Q
from django.utils import timezone

from rest_framework.response import Response
from rest_framework import serializers, permissions, status, viewsets
from rest_framework.permissions import IsAuthenticated

from django_filters import rest_framework as filters

from cash.models import CashRecord

from core.serializers import AnnotateFieldsModelSerializer


class CashRecordsView(viewsets.ModelViewSet):

    class CashRecordSerializer(serializers.ModelSerializer):

        class Meta:
            model = CashRecord
            fields = ['created_at', 'amount', 'note', 'record_type', 'id']


    class CashRecordCreateExpenseSerializer(serializers.ModelSerializer):
        class Meta:
            model = CashRecord
            fields = ['amount', 'note']


    class ExpensesFilter(filters.FilterSet):
        created_at = filters.DateFromToRangeFilter()

        class Meta:
            model = CashRecord
            fields = '__all__'


    class CashRecordPermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method in permissions.SAFE_METHODS:
                return True

            if request.method == 'POST' or request.method == 'DELETE':
                return True

            return False

        def has_object_permission(self, request, view, obj):
            if request.method == 'DELETE':
                return request.user.account.shop == obj.shop

            return False

    queryset = CashRecord.objects.all()
    serializer_class = CashRecordSerializer
    filter_class = ExpensesFilter
    permission_classes = [IsAuthenticated, CashRecordPermissions]

    def get_queryset(self):
        # all detail methods will not found if record is outside this queryset       
        return CashRecord.objects.filter(shop=self.request.user.account.shop)\
            .filter(Q(record_type='shop_expenses') | Q(record_type='withdraw_employee'))

    def get_today_records(self):
        return self.get_queryset().filter(created_at__date=timezone.now())

    def list(self, request):
        records = self.filter_queryset(self.get_queryset())

        return Response({
                'records': self.CashRecordSerializer(records, many=True).data,
                'total': records.calc_sum(),
                },
                 status=status.HTTP_200_OK)

    def create(self, request, serializer_class=CashRecordCreateExpenseSerializer):
        serializer = self.CashRecordCreateExpenseSerializer(data=request.data)
        if serializer.is_valid():
            cash_record = CashRecord.objects.create_shop_expense(
                amount=serializer.validated_data['amount'],
                note=serializer.validated_data['note'],
                initiator=request.user
                )

            records = self.get_today_records()

            return Response({
                'expense': self.CashRecordSerializer(cash_record).data,
                'records': self.CashRecordSerializer(records, many=True).data,
                'total': records.calc_sum(),
                'message': 'Успешно'
                },
                 status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        self.get_object().delete()
        records = self.get_today_records()
        
        return Response({
            'records': self.CashRecordSerializer(records, many=True).data,
            'totals': records.calc_sum()
            },
            status=status.HTTP_200_OK)