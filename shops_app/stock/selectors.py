# # -*- coding: utf-8 -*-
from django.contrib.auth.models import User

from stock.models import (Lumber, Shift, LumberRecord, Shop)
from accounts.models import (Account, CashRecord)


# def get_stock(shop_title):
#     shop = Shop.objects.get(name=shop_title)
    
#     Lumber.objects.all().annotate(
#     	records__shift__is_null=False,

#     	)

# def calc_total_income_volume_by_shop_by_lumber(lumber, Shop):
# 	return LumberRecord.objects.filter(lumber=lumber, shop=shop, shift__isnull=False) \
#             .values('shop') \
#             .annotate(total_income_volume=Sum('volume')) \
#             .values('total_income_volume')
