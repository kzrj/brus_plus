# # -*- coding: utf-8 -*-
from django.utils import timezone

from rest_framework import generics, serializers, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django_filters import rest_framework as filters

from stock_operations import servises as stock_operations_servises
from stock.models import LumberRecord, LumberSawRate, Lumber
from stock_operations.models import Shift
from accounts.models import Account


class InitDataView(APIView):

    class LumberSawRateSerializer(serializers.ModelSerializer):
        id = serializers.ReadOnlyField(source='lumber.pk')
        lumber = serializers.ReadOnlyField(source='lumber.pk')
        name = serializers.ReadOnlyField(source='lumber.name')
        lumber_type = serializers.ReadOnlyField(source='lumber.lumber_type')
        quantity = serializers.IntegerField(default=0)
        volume = serializers.ReadOnlyField(source='lumber.volume')
        volume_total = serializers.FloatField(default=0)
        wood_species = serializers.ReadOnlyField(source='lumber.wood_species')
        cash = serializers.FloatField(default=0.0)

        class Meta:
            model = LumberSawRate
            fields = ['id', 'lumber', 'employee_rate', 'name', 'lumber_type', 'quantity', 'volume',
             'volume_total', 'wood_species', 'cash']


    class RamshikSerializer(serializers.ModelSerializer):
        class Meta:
            model = Account
            fields = ['id', 'nickname']

    def get(self, request, format=None):
        lumber_rates = LumberSawRate.objects.filter(shop=request.user.account.shop) \
                                            .select_related('lumber')
        return Response({
            'lumbers': self.LumberSawRateSerializer(lumber_rates, many=True).data,
            'employees': self.RamshikSerializer(Account.objects.filter(is_ramshik=True,
                shop=request.user.account.shop), many=True).data,
            }, status=status.HTTP_200_OK)


class CreateShiftView(generics.CreateAPIView):

    class ShiftReadSerializer(serializers.ModelSerializer):

        class LumberRecordSerializer(serializers.ModelSerializer):
            lumber = serializers.StringRelatedField()
            wood_species = serializers.ReadOnlyField(source='lumber.wood_species')

            class Meta:
                model = LumberRecord
                fields = ('lumber', 'quantity', 'volume', 'rate', 'total_cash', 'back_total_cash',
                 'wood_species')

        lumber_records = LumberRecordSerializer(many=True)
        employees = serializers.StringRelatedField(read_only=True, many=True)
        date = serializers.DateTimeField(format='%d/%m', read_only=True)

        class Meta:
            model = Shift
            fields = '__all__'


    class ShiftCreateSerializer(serializers.ModelSerializer):

        class RawLumberRecordSerializer(serializers.Serializer):
            lumber = serializers.PrimaryKeyRelatedField(queryset=Lumber.objects.all())
            quantity = serializers.IntegerField()
            volume_total = serializers.FloatField()
            employee_rate = serializers.IntegerField()
            cash = serializers.FloatField()

        employees = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all(), many=True)
        raw_records = RawLumberRecordSerializer(many=True)

        class Meta:
            model = Shift
            fields = ('date', 'shift_type', 'employees', 'raw_records', 'employee_cash', 'note')


    class CreatePermissions(permissions.BasePermission):
        def has_permission(self, request, view):
            if request.method == 'POST':
                return True

            return False

    permission_classes = [IsAuthenticated, CreatePermissions ]

    def create(self, request):
        serializer = self.ShiftCreateSerializer(data=request.data)
        if serializer.is_valid():
            shift = stock_operations_servises.create_shift_raw_records(
                date=serializer.validated_data.get('date'),
                shift_type=serializer.validated_data['shift_type'],
                employees=serializer.validated_data['employees'],
                raw_records=serializer.validated_data['raw_records'],
                cash=serializer.validated_data['employee_cash'],
                note=serializer.validated_data.get('note'),
                shop=request.user.account.shop,
                initiator=request.user,
                )
            
            return Response(self.ShiftReadSerializer(shift).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)