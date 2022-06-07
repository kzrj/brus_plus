# # -*- coding: utf-8 -*-
from rest_framework import serializers, permissions, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import Account
from cash.models import CashRecord


class RamshikiPaymentViewSet(viewsets.ViewSet):
    class RamshikWithCashSerializer(serializers.ModelSerializer):
        class Meta:
            model = Account
            fields = ['id', 'nickname', 'cash',]


    class CreateRamshikPayoutSerializer(serializers.Serializer):
        employee = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())
        amount = serializers.IntegerField()


    class LastPayoutsSerializer(serializers.ModelSerializer):
        employee = serializers.ReadOnlyField(source='account.nickname')

        class Meta:
            model = CashRecord
            fields = ['id', 'amount', 'record_type', 'created_at', 'employee']


    class CreateRamshikSerializer(serializers.Serializer):
        nickname = serializers.CharField()
        cash = serializers.IntegerField(default=0)

    
    class SuppliersPermissions(permissions.BasePermission):
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

    permission_classes = [IsAuthenticated, SuppliersPermissions]

    def create(self, request):
        serializer = self.CreateRamshikSerializer(data=request.data)
        if serializer.is_valid():
            ramshik = Account.objects.create(
                nickname=serializer.validated_data['nickname'],
                is_ramshik=True,
                shop=request.user.account.shop,
                )
            cash = serializer.validated_data['cash']
            if cash > 0:
                CashRecord.objects.create_payout_from_shift(employee=ramshik, shift=None,
                    amount=cash, initiator=request.user)
            if cash < 0:
                CashRecord.objects.create_withdraw_employee(employee=ramshik, amount=-cash,
                    initiator=request.user)

            return Response({'employees': self.RamshikWithCashSerializer(
                    Account.objects.filter(shop=request.user.account.shop, is_ramshik=True),
                     many=True).data}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def init_data(self, request, pk=None):
        return Response({
            'employees': self.RamshikWithCashSerializer(
                Account.objects.filter(is_ramshik=True, shop=request.user.account.shop)\
                    .order_by('nickname'), many=True).data,
            'last_payouts': self.LastPayoutsSerializer(
                CashRecord.objects.supplier_records_by_shop(shop=shop) \
                    .order_by('-created_at')[:10], many=True).data
            },
                status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def payout(self, request, pk=None):
        serializer = self.CreateRamshikPayoutSerializer(data=request.data)
        if serializer.is_valid():
            CashRecord.objects.create_withdraw_employee(
                employee=serializer.validated_data['employee'],
                amount=serializer.validated_data['amount'],
                note=f'Выплата поставщику {serializer.validated_data["employee"].nickname}',
                initiator=request.user,
                )
            return Response({
                'employees': self.RamshikWithCashSerializer(
                    Account.objects.filter(is_ramshik=True, shop=request.user.account.shop)\
                        .order_by('nickname'),
                    many=True).data,
                'last_payouts': self.LastPayoutsSerializer(
                    CashRecord.objects.supplier_records_by_shop(shop=shop) \
                        .order_by('-created_at')[:10], many=True).data,
                'message': 'Успешно',
                },
                status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        Account.objects.get(pk=pk).delete()
        return Response({
            'employees': self.RamshikWithCashSerializer(
                    Account.objects.filter(shop=request.user.account.shop, is_ramshik=True),
                     many=True).data,
            },
            status=status.HTTP_200_OK)