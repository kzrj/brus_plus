# -*- coding: utf-8 -*-
from django.test import TestCase, TransactionTestCase
from django.contrib.auth.models import User

from stock.models import Lumber, LumberRecord, Shop
from stock_operations.models import Shift
from accounts.models import Account
from cash.models import CashRecord

import stock.testing_utils as lumber_testing
from stock_operations import servises


class ShiftServicesTest(TransactionTestCase):
    def setUp(self):
        lumber_testing.create_init_data()

        self.manager1 = User.objects.get(username='manager1')

        self.supplier1 = Account.objects.get(nickname='supplier1')
        self.supplier2 = Account.objects.get(nickname='supplier2')

        self.brus1 = Lumber.objects.filter(name__contains='брус')[0]
        self.brus2 = Lumber.objects.filter(name__contains='брус')[1]
        self.doska1 = Lumber.objects.filter(name__contains='доска')[0]
        self.doska2 = Lumber.objects.filter(name__contains='доска')[1]

        self.shop = Shop.objects.all().first()

    def test_create_shift(self):
        suppliers = [ self.supplier1, self.supplier2 ]
        data_list = [
            {'lumber': self.brus1, 'quantity': 10, 'volume_total': 0.6, 'rate': 600, 'cash': 360 },
            {'lumber': self.brus2, 'quantity': 10, 'volume_total': 0.4, 'rate': 600, 'cash': 240 },
            {'lumber': self.doska1, 'quantity': 50, 'volume_total': 1.44, 'rate': 600, 'cash': 864 },
            {'lumber': self.doska2, 'quantity': 40, 'volume_total': 0.96, 'rate': 600, 'cash': 576 },
        ]
        LumberRecord.objects.create_from_list(records_list=data_list)
        lumber_records = LumberRecord.objects.all()

        shift = servises.create_shift(shift_type='day', employees=suppliers, 
            lumber_records=lumber_records, cash=1200, initiator=self.manager1)

        self.assertEqual(shift.back_calc_volume, 3.4)
        self.assertEqual(shift.back_calc_cash, 2040)
        self.assertEqual(shift.employee_cash, 1200)
        self.assertEqual(shift.cash_per_employee, 600)
        self.assertEqual(shift.shop, self.shop)

        cash_records = CashRecord.objects.filter(shift=shift)
        self.assertEqual(cash_records.count(), 2)
        self.assertTrue('Начисление поставщику' in cash_records.first().note)
        self.assertTrue(600 == cash_records.first().amount)

    def test_create_shift_raw_records(self):
        suppliers = [ self.supplier1, self.supplier2 ]
        data_list = [
            {'lumber': self.brus1, 'quantity': 10, 'volume_total': 0.6, 'rate': 600, 'cash': 360 },
            {'lumber': self.brus2, 'quantity': 10, 'volume_total': 0.4, 'rate': 600, 'cash': 240 },
            {'lumber': self.doska1, 'quantity': 50, 'volume_total': 1.44, 'rate': 600, 'cash': 864 },
            {'lumber': self.doska2, 'quantity': 40, 'volume_total': 0.96, 'rate': 600, 'cash': 576 },
        ]

        shift = servises.create_shift_raw_records(shift_type='day', employees=suppliers, 
            raw_records=data_list, cash=1200, initiator=self.manager1, shop=self.shop)

        self.assertEqual(shift.back_calc_volume, 3.4)
        self.assertEqual(shift.back_calc_cash, 2040)
        self.assertEqual(shift.employee_cash, 1200)
        self.assertEqual(shift.shop, self.shop)
