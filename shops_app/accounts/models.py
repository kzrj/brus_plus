# -*- coding: utf-8 -*-
from django.db import models
from django.db.models import Q, Subquery, OuterRef, Count, Prefetch, F, Sum, Value
from django.db.models.functions import Coalesce
from django.contrib.auth.models import User
from django.utils import timezone

from core.models import CoreModel, CoreModelManager


class AccountQuerySet(models.QuerySet):
    pass


class Account(CoreModel):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="account")
    nickname = models.CharField(max_length=20, null=True, blank=True)

    shop = models.ForeignKey('stock.Shop', on_delete=models.SET_NULL, null=True, blank=True,
        related_name='accounts')

    is_ramshik = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)
    is_seller = models.BooleanField(default=False)

    objects = AccountQuerySet.as_manager()

    def __str__(self):
        if self.user:
            return self.user.username
        return self.nickname

    @property
    def cash(self):
        return self.cash_records.all().calc_ramshik_balance()
        


