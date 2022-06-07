const localUrl = 'http://192.168.0.49:8000'
const prodUrl = 'http://77.222.54.204'

export const url = (process.env.REACT_APP_ENV === 'local' && localUrl) || (process.env.REACT_APP_ENV === 'prod' && prodUrl);
export const apiUrl = `${url}/api`;

export default {
    JWT_AUTH: `${apiUrl}/jwt/api-token-auth/`,
    JWT_CHECK_TOKEN: `${apiUrl}/jwt/api-token-verify/`,

    // stock page
    STOCK_PAGE_STOCK: `${apiUrl}/stock_page/`,
    STOCK_PAGE_SET_LUMBER_PRICE: `${apiUrl}/stock_page/set_price/`,

    // shift list page
    SHIFT_LIST_PAGE_LIST: `${apiUrl}/shift_list_page/`,
    shift_list_delete: (id) => `${apiUrl}/shift_list_page/${id}/`,

    //shift create page
    SHIFT_CREATE_PAGE_DATA: `${apiUrl}/shift_create_page/init/`,
    SHIFT_CREATE_PAGE_CREATE: `${apiUrl}/manager/shifts/create/`,

    // sale create page
    SALE_CREATE_PAGE_DATA: `${apiUrl}/sale_create_page/init/`,
    SALE_CREATE_PAGE_CREATE: `${apiUrl}/sale_create_page/create/`,

    // sale list page
    SALE_LIST_PAGE_LIST: `${apiUrl}/sale_list_page/`,
    sale_list_delete: (id) => `${apiUrl}/sale_list_page/${id}/`,

    // expenses page
    EXPENSES_PAGE_LIST: `${apiUrl}/expenses_page/list/`,
    EXPENSES_PAGE_CREATE: `${apiUrl}/expenses_page/create_expense/`,
    expenses_page_delete: (id) => `${apiUrl}/expenses_page/${id}/`,

    // suppliers page
    SUPPLIERS_PAGE_INIT: `${apiUrl}/suppliers_page/init/`,
    SUPPLIERS_PAGE_PAYOUT: `${apiUrl}/suppliers_page/payout/`,
    SUPPLIERS_PAGE_CREATE: `${apiUrl}/suppliers_page/create/`,
    suppliers_page_delete: (id) => `${apiUrl}/suppliers_page/${id}/`,

    // daily report page
    DAILY_REP_PAGE: `${apiUrl}/daily_report_page/`,
    
    //common_api
    STOCK: `${apiUrl}/common/stock/`,
    SHIFTS: `${apiUrl}/common/shifts/`,
    SALES: `${apiUrl}/common/sales/`,
    RESAWS: `${apiUrl}/common/resaw/`,
    DAILY_REP: `${apiUrl}/common/daily_report/`,
    SALE_CALC_DATA: `${apiUrl}/common/sales/calc_data/`,
    INCOME_TIMBERS: `${apiUrl}/common/income_timbers/`,
    QUOTAS: `${apiUrl}/common/quotas/`,

    // ramshik api
    // RAMSHIK_SHIFT_CREATE_DATA: `${apiUrl}/ramshik/shifts/create/init_data/`,
    // RAMSHIK_SHIFT_CREATE: `${apiUrl}/ramshik/shifts/create/`,
    RAMSHIK_SHIFT_LIST: `${apiUrl}/ramshik/shifts/list/`,
    RAMSHIK_PAYOUTS: `${apiUrl}/ramshik/payouts/`,

    // manager api
    EMPLOYEE_PAYOUT_INIT_DATA: `${apiUrl}/manager/ramshik_payments/init_data/`,
    EMPLOYEE_PAYOUT: `${apiUrl}/manager/ramshik_payments/ramshik_payout/`,
    EMPLOYEE_CREATE: `${apiUrl}/manager/ramshiki/create/`,
    manager_ramshiki_delete: (id) => `${apiUrl}/manager/ramshiki/${id}/`,

    MANAGER_SHIFT_LIST: `${apiUrl}/manager/shift_list/`,

    MANAGER_STOCK: `${apiUrl}/manager/stock/`,
    MANAGER_STOCK_SET_LUMBER_PRICE: `${apiUrl}/manager/stock/set_price/`,
    
    MANAGER_SALE_LIST: `${apiUrl}/manager/sale_list/`,
    
    MANAGER_RAWSTOCK_INCOME_INIT_DATA: `${apiUrl}/manager/rawstock/timber/create_income/init_data/`,
    MANAGER_RAWSTOCK_INCOME_CREATE: `${apiUrl}/manager/rawstock/timber/create_income/`,
    manager_rawstock_income_delete: (id) => `${apiUrl}/manager/rawstock/timber/income_timbers/${id}/`,

    MANAGER_SHIFT_CREATE_DATA: `${apiUrl}/manager/shifts/create/init_data/`,
    MANAGER_SHIFT_CREATE: `${apiUrl}/manager/shifts/create/`,
    manager_shift_delete: (id) => `${apiUrl}/manager/shifts/${id}/`,

    MANAGER_SALE_INIT_DATA: `${apiUrl}/manager/sales/create/init_data/`,
    MANAGER_SALE_CREATE: `${apiUrl}/manager/sales/create/`,
    manager_delete_sale: (id) => `${apiUrl}/manager/sales/${id}/`,

    MANAGER_CASH_RECORDS_LIST: `${apiUrl}/manager/cash_records/list/`,
    MANAGER_CASH_RECORDS_CREATE: `${apiUrl}/manager/cash_records/create_expense/`,
    manager_delete_expense: (id) => `${apiUrl}/manager/cash_records/${id}/`,

    MANAGER_RESAW_CREATE: `${apiUrl}/manager/resaws/create/`,
    manager_delete_resaw: (id) => `${apiUrl}/manager/resaws/${id}/`,

    CAPO_BOSS_PAYOUT_MANAGER_CREATE: `${apiUrl}/boss_capo/cash_records/payout_to_manager/`,
    boss_delete_manager_payout: (id) => `${apiUrl}/boss_capo/cash_records/${id}/`,
}