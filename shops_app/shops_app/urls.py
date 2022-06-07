# -*- coding: utf-8 -*-
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from django.conf.urls.static import static
from django.conf import settings

from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

from apis import stock_page_api, shift_list_page, shift_create_page, sale_create_page, \
    sale_list_page, expenses_page, daily_report_page

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # auth
    url(r'^api/jwt/api-token-auth/', obtain_jwt_token),
    url(r'^api/jwt/api-token-refresh/', refresh_jwt_token),
    url(r'^api/jwt/api-token-verify/', verify_jwt_token),

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

    # expenses page
    path('api/expenses_page/create_expense/', expenses_page.CashRecordsView.as_view({'post': 'create'})),
    path('api/expenses_page/list/', expenses_page.CashRecordsView.as_view({'get': 'list'})),
    path('api/expenses_page/<int:pk>/', expenses_page.CashRecordsView.as_view({'delete': 'destroy'})),

    # suppliers page
    path('api/suppliers_page/init/', manager_api.RamshikiPaymentViewSet.as_view({'get': 'init_data'})),
    path('api/suppliers_page/payout/', manager_api.RamshikiPaymentViewSet.as_view({'post': 'payout'})),
    path('api/suppliers_page/create/', manager_api.RamshikiPaymentViewSet.as_view({'post': 'create'})),
    path('api/suppliers_page/<int:pk>/', manager_api.RamshikiPaymentViewSet.as_view({'delete': 'destroy'})),

    # daily report page
    path('api/daily_report_page/', daily_report_page.DailyReport.as_view()),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
