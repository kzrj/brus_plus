from django.contrib import admin

from stock.models import (Lumber, LumberRecord, Shop, LumberSawRate)


@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Shop._meta.fields]


@admin.register(Lumber)
class LumberAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Lumber._meta.fields]


@admin.register(LumberRecord)
class LumberRecordAdmin(admin.ModelAdmin):
    list_display = [f.name for f in LumberRecord._meta.fields]


@admin.register(LumberSawRate)
class LumberSawRateAdmin(admin.ModelAdmin):
    list_display = [f.name for f in LumberSawRate._meta.fields]