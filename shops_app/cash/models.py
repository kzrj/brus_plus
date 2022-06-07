# -*- coding: utf-8 -*-
from django.db import models
from django.db.models import Q, Subquery, OuterRef, Count, Prefetch, F, Sum, Value 
from django.db.models.functions import Coalesce
from django.contrib.auth.models import User
from django.utils import timezone

from core.models import CoreModel, CoreModelManager


class CashRecordQuerySet(models.QuerySet):
    # Servises
    def create_payout_from_shift(self, employee, shift, amount, note=None, initiator=None):
        self.create(amount=amount, account=employee, shift=shift, record_type='payout_to_employee_from_shift',
            initiator=initiator, shop=initiator.account.shop, note=note)

    def create_withdraw_employee(self, employee, amount, initiator=None, note=None):
        self.create(amount=amount, account=employee, record_type='withdraw_employee', 
            initiator=initiator, shop=initiator.account.shop, note=note)

    def create_withdraw_cash_from_manager(self, manager_account, amount, initiator=None):
        # manager_account.remove_cash(amount)
        return self.create(amount=amount, account=manager_account, 
            record_type='withdraw_cash_from_manager', initiator=initiator, shop=manager_account.shop)

    def create_shop_expense(self, amount, note, initiator):
        return self.create(amount=amount, note=note, shop=initiator.account.shop, initiator=initiator,
            record_type='shop_expenses')

    def create_income_from_sale(self, amount, note, initiator, sale):
        return self.create(amount=amount, note=note, shop=initiator.account.shop, initiator=initiator,
            sale=sale, record_type='sale_income')

    # Selectors
    def calc_sum(self):
        return self.aggregate(total=Sum('amount'))['total']

    def calc_sum_incomes_expenses(self):
        return self.aggregate(total=
            Coalesce(Sum('amount', filter=Q(record_type='sale_income')), Value(0))
            - Coalesce(Sum('amount', filter=Q(record_type='shop_expenses')), Value(0))
            - Coalesce(Sum('amount', filter=Q(record_type='withdraw_employee')), Value(0))
        )['total']

    def calc_manager_balance(self):
        return self.aggregate(total=
            Coalesce(Sum('amount', filter=Q(record_type='income_timber')), Value(0))
            - Coalesce(Sum('amount', filter=Q(record_type='withdraw_cash_from_manager')), Value(0))
        )['total']

    def calc_ramshik_balance(self):
        return self.aggregate(total=
            Coalesce(Sum('amount', filter=Q(record_type='payout_to_employee_from_shift')), Value(0))
            - Coalesce(Sum('amount', filter=Q(record_type='withdraw_employee')), Value(0))
        )['total']

    def supplier_records_by_shop(self, shop):
        return self.filter(Q(record_type='payout_to_employee_from_shift') |
                    Q(record_type='withdraw_employee')).filter(shop=shop)

class CashRecord(CoreModel):
    amount = models.IntegerField()
    RECORD_TYPES = [
        ('payout_to_employee_from_shift', 'Начисление поставщикам'),
        ('withdraw_employee', 'Выплаты денег поставщикам'),
        ('withdraw_cash_from_manager', 'Вывод средств от кладмэна/менеджера'),
        ('shop_expenses', 'Разные расходы'),
        ('sale_income', 'Выручка с продажи'),
    ]
    record_type = models.CharField(max_length=100, choices=RECORD_TYPES)

    shop = models.ForeignKey('stock.Shop', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='cash_records')

    account = models.ForeignKey('accounts.Account', on_delete=models.SET_NULL, 
        related_name='cash_records', null=True, blank=True)

    shift = models.ForeignKey('stock_operations.Shift', on_delete=models.CASCADE, related_name='payouts',
        null=True, blank=True)
    sale = models.ForeignKey('stock_operations.Sale', on_delete=models.SET_NULL, related_name='cash_records',
        null=True, blank=True)

    initiator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='cash_records')

    note = models.CharField(max_length=200, null=True, blank=True)

    objects = CashRecordQuerySet.as_manager()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return str(self.amount)