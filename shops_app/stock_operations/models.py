# -*- coding: utf-8 -*-
from django.db import models
from django.db.models import Q, Subquery, OuterRef, Count, Prefetch, F, Sum, ExpressionWrapper
from django.db.models.functions import Coalesce
from django.contrib.auth.models import User
from django.utils import timezone

from core.models import CoreModel, CoreModelManager


class ShiftQuerySet(models.QuerySet):
    pass
    

class Shift(CoreModel):
    date = models.DateTimeField(null=True, blank=True)
    shop = models.ForeignKey('stock.Shop', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='shifts')

    SHIFT_TYPES = [('day', 'День'), ('night', 'Ночь')]
    shift_type = models.CharField(max_length=10, choices=SHIFT_TYPES)

    employees = models.ManyToManyField('accounts.Account')
    initiator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='shifts')

    volume = models.FloatField(null=True)

    employee_cash = models.FloatField(null=True)
    cash_per_employee = models.FloatField(null=True)

    back_calc_volume = models.FloatField(null=True)
    back_calc_cash = models.FloatField(null=True)
    back_calc_cash_per_employee = models.FloatField(null=True)

    note = models.TextField(null=True, blank=True)

    objects = ShiftQuerySet.as_manager()

    class Meta:
        ordering = ['date',]

    def __str__(self):
        return f'Приход {self.shift_type} {self.date.strftime("%d-%m-%Y")}'

    @property
    def get_empoyees(self):
        return self.employees.all()

    @property
    def volume_without_zabor(self):
        zabor_volume = self.lumber_records.filter(lumber__name__contains='забор') \
                                          .aggregate(zabor=Coalesce(Sum('volume'), 0.0))['zabor']
        return self.volume - zabor_volume


class SaleQuerySet(models.QuerySet):
    # Selectors
    def calc_totals(self):
        return self.aggregate(
            total_volume=Sum('volume'),
            total_selling_cash=Sum('selling_total_cash'),
            total_shop_cash=Sum('shop_total_cash'),
            total_seller_fee=Sum('seller_fee'),
            total_loader_fee=Sum('loader_fee'),
            total_kladman_fee=Sum('kladman_fee'),
            total_delivery_fee=Sum('delivery_fee'),
            total_add_expenses=Sum('add_expenses'),
            )

    # to remove
    def add_only_brus_volume(self, wood_species='pine'):
        subquery = LumberRecord.objects.filter(sale__pk=OuterRef('pk'), lumber__wood_species=wood_species) \
                            .filter(Q(lumber__lumber_type='brus') | Q(lumber__name__contains='обрезная')) \
                            .exclude(lumber__width=0.025) \
                        .values('sale') \
                        .annotate(brus_volume=Sum('volume')) \
                        .values('brus_volume')

        return self.annotate(brus_volume=Coalesce(Subquery(subquery), 0.0))

    # to remove
    def add_only_doska_volume_exclude_2_5(self, wood_species='pine'):
        subquery = LumberRecord.objects.filter(sale__pk=OuterRef('pk'),
                            lumber__lumber_type='doska', lumber__wood_species=wood_species) \
                        .exclude(lumber__width=0.025) \
                        .exclude(lumber__name__contains='обрезная') \
                        .values('sale') \
                        .annotate(doska_volume=Sum('volume')) \
                        .values('doska_volume')

        return self.annotate(doska_volume=Coalesce(Subquery(subquery), 0.0))

    # to remove
    def calc_sold_volume_for_quota_calc(self, wood_species='pine'):
        return self.add_only_brus_volume(wood_species=wood_species) \
                   .add_only_doska_volume_exclude_2_5(wood_species=wood_species) \
                   .aggregate(total_brus_volume=Coalesce(Sum('brus_volume'), 0.0),
                              total_doska_volume=Coalesce(Sum('doska_volume'), 0.0))


class Sale(CoreModel):
    date = models.DateTimeField(null=True, blank=True)
    shop = models.ForeignKey('stock.Shop', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='sales')

    SALE_TYPES = [('person', 'Физ. лицо'), ('perekup', 'Перекуп'), ('china', 'Китай')]
    sale_type = models.CharField(max_length=20, choices=SALE_TYPES, null=True, blank=True)

    client = models.CharField(max_length=20, null=True, blank=True)

    initiator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
        related_name='sales')
    volume = models.FloatField(null=True, blank=True)

    note = models.TextField(null=True, blank=True)

    shop_total_cash = models.IntegerField(default=0)
    selling_total_cash = models.IntegerField(default=0)

    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
        related_name='sales_as_seller')
    bonus_kladman = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
        related_name='sales_as_bonus_kladman')

    seller_fee = models.IntegerField(default=0, null=True, blank=True)
    kladman_fee = models.IntegerField(default=0,null=True, blank=True)
    loader_fee = models.IntegerField(default=0, null=True, blank=True)
    delivery_fee = models.IntegerField(default=0, null=True, blank=True)

    system_fee = models.IntegerField(default=0, null=True, blank=True)

    add_expenses = models.IntegerField(default=0, null=True, blank=True)

    objects = SaleQuerySet.as_manager()

    def calc_seller_fee(self):
        if self.seller:
            self.seller_fee = round(self.selling_total_cash - self.shop_total_cash)

    def calc_kladman_fee(self):
        if self.bonus_kladman:
            self.kladman_fee = self.system_fee = round(self.volume * 100)

    def calc_loader_fee(self):
        self.loader_fee = round(self.volume * 100)

    @property
    def seller_name(self):
        if self.seller:
            return self.seller.account.nickname
        return None
 

# class ReSawQuerySet(models.QuerySet):
#     def create_resaw(self, resaw_lumber_in, resaw_lumber_out, Shop, employees=None, employee_cash=None,
#         initiator=None):
#         lumber_in = LumberRecord.objects.create_for_resaw(
#             lumber=resaw_lumber_in['lumber'], quantity=resaw_lumber_in['quantity'], shop=shop)
#         lumber_out = LumberRecord.objects.create_for_resaw(
#             lumber=resaw_lumber_out['lumber'], quantity=resaw_lumber_out['quantity'], shop=shop)
#         resaw = self.create(lumber_in=lumber_in, lumber_out=lumber_out, employee_cash=employee_cash,
#             initiator=initiator, shop=shop)
#         # add employees, employee_cash

#         return resaw
        

# class ReSaw(CoreModel):
#     shop = models.ForeignKey('stock.Shop', on_delete=models.SET_NULL, null=True, blank=True, 
#         related_name='resaws')
#     employee_cash = models.IntegerField(null=True, blank=True)
#     employees = models.ManyToManyField('accounts.Account')
#     lumber_in = models.OneToOneField('stock.LumberRecord', on_delete=models.CASCADE, related_name='re_saw_in')
#     lumber_out = models.OneToOneField('stock.LumberRecord', on_delete=models.CASCADE, related_name='re_saw_out')

#     initiator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, 
#         related_name='resaws')

#     objects = ReSawQuerySet.as_manager()


#     class Meta:
#         ordering = ['-created_at']

#     def __str__(self):
#         return f'Перепил {self.pk}'