# -*- coding: utf-8 -*-
from django.test import TestCase, TransactionTestCase
from django.contrib.auth.models import User

from stock.models import Lumber, LumberRecord, Shop
from stock_operations.models import Sale
from accounts.models import Account
from cash.models import CashRecord

import stock.testing_utils as lumber_testing
from stock_operations import servises


class SaleServisesTest(TransactionTestCase):
    def setUp(self):
        lumber_testing.create_init_data()

        self.seller1 = User.objects.get(username='seller1')
        self.manager1 = User.objects.get(username='manager1')

        self.brus1 = Lumber.objects.filter(name__contains='брус')[0]
        self.brus2 = Lumber.objects.filter(name__contains='брус')[1]
        self.doska1 = Lumber.objects.filter(name__contains='доска')[0]
        self.doska2 = Lumber.objects.filter(name__contains='доска')[1]

        self.china_brus1 = Lumber.objects.filter(name='брус 18*18', wood_species='pine',
         china_volume__isnull=False).first()
        self.china_brus2 = Lumber.objects.filter(name='брус 15*18', wood_species='pine',
         china_volume__isnull=False).first()

        self.doska4_18 = Lumber.objects.filter(name__contains='доска 4*18')[0]
        self.doska25_18 = Lumber.objects.filter(name__contains='доска 2.5*18')[0]

        self.shop = Shop.objects.all().first()

    def test_create_common_sale(self):
        data_list = {
            'lumbers': [
                {'lumber': self.brus1, 'quantity': 10, 'shop_price': 12000, 'selling_price': 12500,
                    'selling_total_cash': 7500, 'calc_type': 'exact'},
                {'lumber': self.china_brus1, 'quantity': 10, 'shop_price': 15000,
                    'selling_price': 15000, 'selling_total_cash': 19010, 'calc_type': 'china'},
                {'lumber': self.doska4_18, 'quantity': 70, 'shop_price': 7000, 'selling_price': 7500,
                    'selling_total_cash': 15443, 'calc_type': 'round'},
            ],
            'loader': True,
            'seller': self.seller1,
            'delivery_fee': 500,
            'add_expenses': 0,
            'note': '',
            'client': 'Баярма'
        }

        sale = servises.create_sale_common(
            raw_records=data_list['lumbers'],
            initiator=self.manager1,
            loader=data_list['loader'],
            delivery_fee=data_list['delivery_fee'],
            add_expenses=data_list['add_expenses'],
            note=data_list['note'],
            client=data_list['client'],
            seller=data_list['seller'],
            )

        self.assertEqual(sale.volume, round(0.6 + 1.296 + 2.016, 4))
        self.assertEqual(sale.seller, self.seller1)
        self.assertEqual(sale.delivery_fee, 500)
        self.assertEqual(sale.add_expenses, 0)
        self.assertEqual(sale.client, 'Баярма')
        self.assertEqual(sale.shop_total_cash, 7200 + 19010 + 14112)
        self.assertEqual(sale.selling_total_cash, 7500 + 19010 + 15443)

        self.assertEqual(round(sale.seller_fee), 1631)
        self.assertEqual(sale.loader_fee, round((0.6 + 1.296 + 2.016) * 100))

        cash_records = CashRecord.objects.filter(sale=sale)
        self.assertEqual(cash_records.count(), 1)
        self.assertTrue('выручка с продажи' in cash_records.first().note)
        self.assertTrue(7500 + 19010 + 15443 == cash_records.first().amount)