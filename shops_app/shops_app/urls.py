# -*- coding: utf-8 -*-
import os
from django.contrib import admin
from django.urls import path
from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings

from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from apis import manager_api, ramshik_api, kladman_api, common_api
from apis import stock_page_api, shift_list_page, shift_create_page, sale_create_page, \
    sale_list_page, expenses_page

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^api/jwt/api-token-auth/', obtain_jwt_token),
    url(r'^api/jwt/api-token-refresh/', refresh_jwt_token),
    url(r'^api/jwt/api-token-verify/', verify_jwt_token),

    # new api
    # stock page
    path('api/stock_page/', stock_page_api.LumberStockListView.as_view()),
    path('api/stock_page/set_price/', stock_page_api.SetLumberMarketPriceView.as_view()),

    # shift list page
    path('api/shift_list_page/', shift_list_page.ShiftListView.as_view()),
    path('api/shift_list_page/<int:pk>/', shift_list_page.DeleteShiftView.as_view()),

    # shift create page
    path('api/shift_create_page/init/', shift_create_page.InitDataView.as_view()),
    path('api/shift_create_page/create/', shift_create_page.CreateShiftView.as_view()),

    # sale create page
    path('api/sale_create_page/init/', sale_create_page.InitDataView.as_view()),
    path('api/sale_create_page/create/', sale_create_page.CreateSaleView.as_view()),

    # sale list page
    path('api/sale_list_page/', sale_list_page.SalesListView.as_view()),
    path('api/sale_list_page/<int:pk>/', sale_list_page.DeleteSaleView.as_view()),

    # expenses
    path('api/expenses_page/create_expense/', expenses_page.CashRecordsView.as_view({'post': 'create'})),
    path('api/expenses_page/list/', expenses_page.CashRecordsView.as_view({'get': 'list'})),
    path('api/expenses_page/<int:pk>/', expenses_page.CashRecordsView.as_view({'delete': 'destroy'})),

    # common read api
    path('api/common/stock/', common_api.LumberStockListView.as_view()),
    path('api/common/shifts/', common_api.ShiftListView.as_view()),
    path('api/common/sales/', common_api.SalesListView.as_view()),
    path('api/common/cash/', common_api.CashRecordsListView.as_view()),
    path('api/common/daily_report/', common_api.DailyReport.as_view()),
    path('api/common/sales/calc_data/', common_api.SaleCalcDataView.as_view()),
    path('api/common/resaw/', common_api.ResawListView.as_view()),

    # manager api
    path('api/manager/shifts/create/init_data/', manager_api.ShiftViewSet.as_view({'get': 'shift_create_data'})),
    path('api/manager/shifts/create/', manager_api.ShiftViewSet.as_view({'post': 'create'})),
    path('api/manager/shifts/<int:pk>/', manager_api.ShiftViewSet.as_view({'delete': 'destroy'})),

    path('api/manager/ramshik_payments/init_data/', manager_api.RamshikiPaymentViewSet.as_view({'get': 'init_data'})),
    path('api/manager/ramshik_payments/ramshik_payout/', manager_api.RamshikiPaymentViewSet.as_view({'post': 'ramshik_payout'})),
    path('api/manager/ramshiki/create/', manager_api.RamshikiPaymentViewSet.as_view({'post': 'create'})),
    path('api/manager/ramshiki/<int:pk>/', manager_api.RamshikiPaymentViewSet.as_view({'delete': 'destroy'})),

    path('api/manager/stock/set_price/', manager_api.SetLumberMarketPriceView.as_view()),

    path('api/manager/sales/create/init_data/', manager_api.SaleView.as_view({'get': 'sale_create_data'})),
    path('api/manager/sales/create/', manager_api.SaleView.as_view({'post': 'create'})),
    path('api/manager/sales/<int:pk>/', manager_api.SaleView.as_view({'delete': 'destroy'})),

    path('api/manager/cash_records/create_expense/', manager_api.CashRecordsView.as_view({'post': 'create'})),
    path('api/manager/cash_records/list/', manager_api.CashRecordsView.as_view({'get': 'list'})),
    path('api/manager/cash_records/<int:pk>/', manager_api.CashRecordsView.as_view({'delete': 'destroy'})),

    path('api/manager/resaws/create/', manager_api.ReSawViewSet.as_view({'post': 'create'})),
    path('api/manager/resaws/<int:pk>/', manager_api.ReSawViewSet.as_view({'delete': 'destroy'})),

    # boss, capo
    # path('api/boss_capo/cash_records/payout_to_manager/', 
    #     manager_api.PayoutToManagerView.as_view({'post': 'payout_to_manager'})),
    # path('api/boss_capo/cash_records/<int:pk>/', 
    #     manager_api.PayoutToManagerView.as_view({'delete': 'destroy'})),

    # ramshik api
    path('api/ramshik/shifts/list/', ramshik_api.ShiftListView.as_view()),
    path('api/ramshik/payouts/', ramshik_api.RamshikPayoutView.as_view()),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
