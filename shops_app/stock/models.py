# -*- coding: utf-8 -*-
from django.db import models
from django.db.models import Q, Subquery, OuterRef, Count, Prefetch, F, Sum, ExpressionWrapper
from django.db.models.functions import Coalesce
from django.contrib.auth.models import User
from django.utils import timezone

from core.models import CoreModel, CoreModelManager


class LumberQuerySet(models.QuerySet):
    # Servises

    # Selectors
    def add_shop_income(self, shop):
        subquery = LumberRecord.objects.calc_total_income_volume_by_shop_by_lumber(
            lumber=OuterRef('pk'), shop=shop)

        return self.annotate(total_income_volume=Coalesce(Subquery(subquery), 0.0))

    def add_shop_outcome(self, shop):
        subquery = LumberRecord.objects.calc_total_outcome_volume_by_shop_by_lumber(
            lumber=OuterRef('pk'), shop=shop)            
        return self.annotate(total_outcome_volume=Coalesce(Subquery(subquery), 0.0))

    def add_shop_income_quantity(self, shop):
        subquery = LumberRecord.objects.calc_total_income_quantity_by_shop_by_lumber(
            lumber=OuterRef('pk'), shop=shop)

        return self.annotate(total_income_quantity=Coalesce(Subquery(subquery), 0))

    def add_shop_outcome_quantity(self, shop):
        subquery = LumberRecord.objects.calc_total_outcome_quantity_by_shop_by_lumber(
            lumber=OuterRef('pk'), shop=shop)            
        return self.annotate(total_outcome_quantity=Coalesce(Subquery(subquery), 0))

    def add_shop_rate(self, shop):
        subquery = LumberSawRate.objects.filter(lumber=OuterRef('pk'), shop=shop) \
            .values('employee_rate')
        return self.annotate(shop_rate=Coalesce(Subquery(subquery), 0))    

    def add_shop_current_stock(self, shop):
        return self.add_shop_income(shop=shop) \
                .add_shop_outcome(shop=shop) \
                .annotate(current_stock_volume=F('total_income_volume') - F('total_outcome_volume')) \
                .add_shop_income_quantity(shop=shop) \
                .add_shop_outcome_quantity(shop=shop) \
                .annotate(current_stock_quantity=F('total_income_quantity') - F('total_outcome_quantity')) \
                .add_shop_rate(shop=shop)


class Lumber(CoreModel):
    name = models.CharField(max_length=100)
    width = models.FloatField()
    length = models.FloatField()
    height = models.FloatField()
    volume = models.FloatField()
    employee_rate = models.IntegerField(default=0)
    market_cost = models.IntegerField(default=0)

    china_width = models.FloatField(null=True, blank=True)
    china_length = models.FloatField(null=True, blank=True)
    china_height = models.FloatField(null=True, blank=True)
    china_volume = models.FloatField(null=True, blank=True)

    round_volume = models.FloatField(default=0)

    SPECIES = [('pine', 'Сосна'), ('larch', 'Лиственница')]
    wood_species = models.CharField(max_length=20, choices=SPECIES)

    LUMBER_TYPES = [('brus', 'brus'), ('doska', 'doska')]
    lumber_type = models.CharField(max_length=20, choices=LUMBER_TYPES)

    objects = LumberQuerySet.as_manager()

    class Meta:
        ordering = ['lumber_type', 'wood_species']


    def __str__(self):
        return f'{self.name} {self.length}'

    @property
    def stock_total_cash(self):
        return self.current_stock_volume * self.shop_rate

    @property
    def china_name(self):
        return f'брус Китай {self.china_width}*{self.china_height}'

    @property
    def full_name(self):
        return f'{self.name} {self.length}' 
    

class ShopQuerySet(models.QuerySet):
    pass


class Shop(CoreModel):
    name = models.CharField(max_length=50)

    STOCK_TYPES = [('mixed', 'Смешанный'), ('sorted', 'Сортированный')]
    stock_type = models.CharField(max_length=50, choices=STOCK_TYPES, null=True, blank=True)

    SALE_TYPES = [('seller_kladman_split', 'Комиссия продавца и кладмэна раздельно'),
         ('seller_kladman_same', 'Комиссия продавца и кладмэна вместе')]
    sale_type = models.CharField(max_length=100, choices=SALE_TYPES, null=True, blank=True)

    def __str__(self):
        return self.name    


class LumberRecordQuerySet(models.QuerySet):
    # Servises
    def create_from_list(self, records_list, shop=None):
        lumber_records = list()
        for record in records_list:
            if record['quantity'] > 0:
                rate = record.get('rate') or record.get('employee_rate')
                lumber_records.append(
                    LumberRecord(
                        lumber=record['lumber'],
                        quantity=record['quantity'],
                        volume=record['quantity']*record['lumber'].volume, 
                        rate=rate,
                        total_cash=record['cash'], 
                        back_total_cash=rate*record['quantity']*record['lumber'].volume,
                        shop=shop)
                    )
        return self.bulk_create(lumber_records)

    def create_from_raw_for_common_sale(self, records_list, shop=None):
        lumber_records = list()
        for record in records_list:
            if record['quantity'] > 0:
                selling_calc_type = record.get('calc_type', None)
                shop_total_cash = record['shop_price']*record['quantity']*record['lumber'].volume
                if selling_calc_type == 'china':
                    shop_total_cash = record['shop_price']*record['quantity']*record['lumber'].china_volume                   

                lumber_records.append(
                    LumberRecord(
                        lumber=record['lumber'],
                        quantity=record['quantity'],
                        volume=record['quantity']*record['lumber'].volume,

                        shop_price=record['shop_price'],
                        shop_total_cash=shop_total_cash,

                        selling_price=record['selling_price'],
                        selling_total_cash=record['selling_total_cash'],

                        selling_calc_type=selling_calc_type,
                        shop=shop
                    )
                )
        return self.bulk_create(lumber_records)

    # Selectors
    def calc_total_volume(self):
        return self.aggregate(total_volume=Sum('volume'))['total_volume']

    def calc_total_cash(self):
        return self.aggregate(cash=Sum('total_cash'))['cash']

    def calc_total_income_volume_by_shop_by_lumber(self, lumber, shop):
        return self.filter(lumber=lumber, shop=shop, shift__isnull=False) \
            .values('shop') \
            .annotate(total_income_volume=Sum('volume')) \
            .values('total_income_volume')

    def calc_total_outcome_volume_by_shop_by_lumber(self, lumber, shop):
        return self.filter(lumber=lumber, shop=shop, sale__isnull=False) \
            .values('shop') \
            .annotate(total_outcome_volume=Sum('volume')) \
            .values('total_outcome_volume')

    def calc_total_income_quantity_by_shop_by_lumber(self, lumber, shop):
        return self.filter(lumber=lumber, shop=shop, shift__isnull=False) \
            .values('shop') \
            .annotate(total_income_quantity=Sum('quantity')) \
            .values('total_income_quantity')

    def calc_total_outcome_quantity_by_shop_by_lumber(self, lumber, shop):
        return self.filter(lumber=lumber, shop=shop, sale__isnull=False) \
            .values('shop') \
            .annotate(total_outcome_quantity=Sum('quantity')) \
            .values('total_outcome_quantity')

    def calc_shop_total_cash(self):
        return self.aggregate(cash=Sum('shop_total_cash'))['cash']

    def calc_selling_total_cash(self):
        return self.aggregate(cash=Sum('selling_total_cash'))['cash']

    def calc_shop_and_selling_total_cash(self):
        return self.aggregate(shop_cash=Sum('shop_total_cash'), sale_cash=Sum('selling_total_cash'))

    def calc_sale_volume_and_cash(self):
        return self.aggregate(
            shop_cash=Sum('shop_total_cash'),
            sale_cash=Sum('selling_total_cash'),
            total_volume=Sum('volume'))

   
class LumberRecord(CoreModel):
    RECORD_TYPES = [('shift_record', 'shift_record'), ('sale_record', 'sale_record'),]
    record_type = models.CharField(max_length=50, choices=RECORD_TYPES, null=True, blank=True)

    lumber = models.ForeignKey(Lumber, on_delete=models.CASCADE, related_name='records')
    shop = models.ForeignKey(Shop, on_delete=models.SET_NULL, null=True, blank=True, 
        related_name='lumber_records')
    quantity = models.IntegerField(default=0)
    volume = models.FloatField(default=0)
    rate = models.IntegerField(default=0)

    total_cash = models.FloatField(default=0)
    back_total_cash = models.FloatField(default=0)

    shop_price = models.IntegerField(default=0)
    shop_total_cash = models.FloatField(default=0)

    selling_price = models.IntegerField(default=0)
    selling_total_cash = models.FloatField(default=0)

    selling_calc_type = models.CharField(max_length=10, null=True, blank=True)

    shift = models.ForeignKey('stock_operations.Shift', on_delete=models.CASCADE, null=True,
     related_name='lumber_records')

    sale = models.ForeignKey('stock_operations.Sale', on_delete=models.CASCADE, null=True,
     related_name='lumber_records')

    objects = LumberRecordQuerySet.as_manager()

    class Meta:
        ordering = ['lumber__wood_species', 'lumber__lumber_type']

    def __str__(self):
        return f'{self.lumber} {self.quantity}'


class LumberSawRate(CoreModel):
    lumber = models.ForeignKey(Lumber, on_delete=models.CASCADE, related_name='saw_rates')
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='saw_rates')
    employee_rate = models.IntegerField()

    def __str__(self):
        return f'Ставка рамщика {self.pk}'