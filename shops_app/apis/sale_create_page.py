# # -*- coding: utf-8 -*-
from django.utils import timezone
from django.contrib.auth.models import User

from rest_framework import generics, serializers, permissions, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django_filters import rest_framework as filters

from stock_operations import servises as stock_operations_servises
from stock.models import LumberRecord, LumberSawRate, Lumber
from stock_operations.models import Sale
from accounts.models import Account
from core.serializers import ChoiceField


class InitDataView(APIView):

    class LumberSawRateSerializer(serializers.ModelSerializer):
        lumber = serializers.ReadOnlyField(source='lumber.pk')
        id = serializers.ReadOnlyField(source='lumber.pk')
        name = serializers.ReadOnlyField(source='lumber.full_name')
        lumber_type = serializers.ReadOnlyField(source='lumber.lumber_type')    
        round_volume = serializers.ReadOnlyField(source='lumber.round_volume')
        wood_species = serializers.ReadOnlyField(source='lumber.wood_species')

        class Meta:
            model = LumberSawRate
            fields = ['name', 'lumber_type', 'wood_species', 'lumber', 'id', 'round_volume']


    class LumberSerializer(serializers.ModelSerializer):
        quantity = serializers.IntegerField(default=0)
        volume_total = serializers.FloatField(default=0)
        lumber = serializers.ReadOnlyField(source='pk')
        shop_price = serializers.ReadOnlyField(source='shop_rate')
        selling_price = serializers.ReadOnlyField(source='shop_rate')
        selling_total_cash = serializers.ReadOnlyField(source='shop_rate')
        calc_type = serializers.CharField(default='exact')

        class Meta:
            model = Lumber
            exclude = ['created_at', 'modified_at', 'employee_rate', 'market_cost']


    class SellerSerializer(serializers.ModelSerializer):
        nickname = serializers.ReadOnlyField(source='account.nickname')

        class Meta:
            model = User
            fields = ['id', 'nickname']

    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        shop = request.user.account.shop
        lumber_rates = LumberSawRate.objects.filter(shop=shop).select_related('lumber')

        return Response({
            'pine_brus_lumbers': self.LumberSawRateSerializer(
                lumber_rates.filter(lumber__lumber_type='brus', lumber__wood_species='pine') \
                    .order_by('lumber__wood_species', 'lumber__length'),
                 many=True).data,
            'larch_brus_lumbers': self.LumberSawRateSerializer(
                lumber_rates.filter(lumber__lumber_type='brus', lumber__wood_species='larch') \
                    .order_by('lumber__wood_species', 'lumber__length'),
                 many=True).data,
            'pine_doska_lumbers': self.LumberSawRateSerializer(
                lumber_rates.filter(lumber__lumber_type='doska', lumber__wood_species='pine') \
                    .order_by('lumber__wood_species', 'lumber__length'),
                 many=True).data,
            'larch_doska_lumbers': self.LumberSawRateSerializer(
                lumber_rates.filter(lumber__lumber_type='doska', lumber__wood_species='larch') \
                    .order_by('lumber__wood_species', 'lumber__length'),
                 many=True).data,
            'lumbers': self.LumberSerializer(
                Lumber.objects.all().order_by('wood_species', 'length').add_shop_rate(shop=shop), many=True).data,
            'sellers': self.SellerSerializer(User.objects.filter(account__is_seller=True,
                 account__shop=shop), many=True).data,
            }, status=status.HTTP_200_OK)


class CreateSaleView(generics.CreateAPIView):

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


    class SaleCreateSerializer(serializers.ModelSerializer):

        class RawLumberRecordSerializer(serializers.Serializer):
            lumber = serializers.PrimaryKeyRelatedField(queryset=Lumber.objects.all())
            quantity = serializers.IntegerField()
            shop_price = serializers.IntegerField()
            selling_price = serializers.IntegerField()
            selling_total_cash = serializers.IntegerField()
            calc_type = serializers.CharField()

        raw_records = RawLumberRecordSerializer(many=True)
        loader = serializers.BooleanField()

        class Meta:
            model = Sale
            fields = ('date', 'raw_records', 'seller', 'bonus_kladman', 'client', 'loader',
             'delivery_fee', )

    permission_classes = [IsAuthenticated ]

    def create(self, request, serializer_class=SaleCreateSerializer):
        serializer = self.SaleCreateSerializer(data=request.data)
        if serializer.is_valid():
            sale = stock_operations_servises.create_sale_common(
                date=serializer.validated_data.get('date'),
                raw_records=serializer.validated_data['raw_records'],
                loader=serializer.validated_data['loader'],
                delivery_fee=serializer.validated_data['delivery_fee'],
                # add_expenses=serializer.validated_data['add_expenses'],
                # note=serializer.validated_data['note'],
                client=serializer.validated_data['client'],
                seller=serializer.validated_data['seller'],
                bonus_kladman=serializer.validated_data['bonus_kladman'],
                initiator=request.user,
                )
            
            return Response({
                'sale': self.SaleReadSerializer(sale).data,
                'message': 'Успешно'
                },
                 status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)