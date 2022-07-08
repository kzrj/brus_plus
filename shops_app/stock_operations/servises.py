# # -*- coding: utf-8 -*-
from django.utils import timezone

from stock.models import ( LumberRecord )
from stock_operations.models import ( Sale, Shift )


# Sale servises
def create_sale_common(raw_records, initiator, seller=None, bonus_kladman=None,
        loader=False, delivery_fee=0, add_expenses=0, note=None, date=None, client=None):
    if not date:
        date = timezone.now()

    sale = Sale.objects.create(date=date, initiator=initiator, delivery_fee=delivery_fee,
        seller=seller, bonus_kladman=bonus_kladman,
        shop=initiator.account.shop, add_expenses=add_expenses, note=note, client=client)

    lumber_records = LumberRecord.objects.create_from_raw_for_common_sale(
        records_list=raw_records, shop=initiator.account.shop)
    lumber_records = LumberRecord.objects.filter(pk__in=(lr.pk for lr in lumber_records))
    lumber_records.update(sale=sale)

    volume_and_cash = lumber_records.calc_sale_volume_and_cash()
    sale.volume = volume_and_cash['total_volume']
    sale.shop_total_cash = round(volume_and_cash['shop_cash'])
    sale.selling_total_cash = round(volume_and_cash['sale_cash'])

    sale.cash_records.create_income_from_sale(amount=sale.selling_total_cash,
        note=f'выручка с продажи {sale.client}', initiator=initiator, sale=sale)

    sale.calc_seller_fee()
    sale.calc_kladman_fee()
    if loader: 
        sale.calc_loader_fee()

    sale.save()
    return sale


# Shift servises
def create_shift(shift_type, cash, lumber_records, employees, initiator=None, date=None, note=None):
    if not date:
        date = timezone.now()
    shift = Shift.objects.create(shift_type=shift_type, date=date, employee_cash=cash, 
        initiator=initiator, shop=initiator.account.shop, note=note)
    shift.employees.add(*employees)
    lumber_records.update(shift=shift)
    shift.back_calc_volume = lumber_records.calc_total_volume()
    shift.volume = shift.back_calc_volume
    shift.back_calc_cash = lumber_records.calc_total_cash()
    shift.cash_per_employee = shift.employee_cash / len(employees)
    shift.save()

    for emp in employees:
        emp.cash_records.create_payout_from_shift(employee=emp, shift=shift,
         amount=shift.cash_per_employee, initiator=initiator,
          note=f'Начисление поставщику {emp.nickname} за приход #{shift.pk}')
    
    return shift

def create_shift_raw_records(**kwargs):
    lumber_records = LumberRecord.objects.create_from_list(records_list=kwargs['raw_records'],
        shop=kwargs['shop'])
    kwargs['lumber_records'] = LumberRecord.objects.filter(pk__in=(lr.pk for lr in lumber_records))
    del kwargs['raw_records']
    del kwargs['shop']
    return create_shift(**kwargs)

def delete_shift(pk):
    shift = Shift.objects.get(pk=pk)
    shift.delete()


# # ReSaw servise
# def create_resaw(resaw_lumber_in, resaw_lumber_out, shop, employees=None, employee_cash=None,
#     initiator=None):
#     lumber_in = LumberRecord.objects.create_for_resaw(
#         lumber=resaw_lumber_in['lumber'], quantity=resaw_lumber_in['quantity'], shop=shop)
#     lumber_out = LumberRecord.objects.create_for_resaw(
#         lumber=resaw_lumber_out['lumber'], quantity=resaw_lumber_out['quantity'], shop=shop)
#     resaw = ReSaw.objects.create(lumber_in=lumber_in, lumber_out=lumber_out, employee_cash=employee_cash,
#         initiator=initiator, shop=shop)

#     return resaw