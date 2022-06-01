import axios from 'axios';
import endpoints from './endpoints';
import { parseErrorData, createUrlParamsFromFilters } from './utils';

const create = () => {
    const getExpenses = (filters) => {
        const token = localStorage.getItem('token');
        const params = createUrlParamsFromFilters(filters);
        return axios({
            method: 'get',
            url: endpoints.EXPENSES_PAGE_LIST,
            params: params,
            headers: {'Authorization': `JWT ${token}` }
          })
        .then(response => response.data)
        .catch(err => {
            const error = new Error(err);
            error.data = parseErrorData(err);
            throw error;
        })
    }

    const createExpense = payload => {
        const token = localStorage.getItem('token') || '';

        return axios({
            method: 'post',
            url: endpoints.EXPENSES_PAGE_CREATE,
            data: payload,
            headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
          })
        .then(response => {
            return response.data
        })
        .catch(err => {
            const error = new Error(err);
            error.data = parseErrorData(err);
            throw error;
        })
    }

    const deleteExpense = id => {
        const token = localStorage.getItem('token') || '';

        return axios({
            method: 'delete',
            url: endpoints.expenses_page_delete(id),
            headers: { 'content-type': 'application/JSON', 'Authorization': `JWT ${token}` }
          })
        .then(response => {
            return response.data
        })
        .catch(err => {
            const error = new Error(err);
            error.data = parseErrorData(err);
            throw error;
        })
    }

    return {
        getExpenses,
        createExpense,
        deleteExpense
    }
}

export default {
    create
}