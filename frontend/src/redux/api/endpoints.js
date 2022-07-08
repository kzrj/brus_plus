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
    SHIFT_CREATE_PAGE_CREATE: `${apiUrl}/shift_create_page/create/`,

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
}