import axios from 'axios';
import endpoints from './endpoints';
import { parseErrorData, createUrlParamsFromFilters } from './utils';

const create = () => {
    const getInitdata = () => {
        const token = localStorage.getItem('token');
        return axios({
            method: 'get',
            url: endpoints.SUPPLIERS_PAGE_INIT,
            headers: {'Authorization': `JWT ${token}` }
          })
        .then(response => response.data)
        .catch(err => {
            const error = new Error(err);
            error.data = parseErrorData(err);
            throw error;
        })
    }

    const payout = payload => {
        const token = localStorage.getItem('token') || '';
        const { activeEmployee, amount } = payload
        const formData = new FormData();
        formData.append("employee", activeEmployee.id);
        formData.append("amount", amount);
        formData.append("note", '');

        return axios({
            method: 'post',
            url: endpoints.SUPPLIERS_PAGE_PAYOUT,
            data: formData,
            headers: { 'content-type': 'multipart/form-data', 'Authorization': `JWT ${token}` }
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

    const createSupplier = payload => {
        const token = localStorage.getItem('token') || '';

        return axios({
            method: 'post',
            url: endpoints.SUPPLIERS_PAGE_CREATE,
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

    const deleteSupplier = id => {
        const token = localStorage.getItem('token') || '';

        return axios({
            method: 'delete',
            url: endpoints.suppliers_page_delete(id),
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
        getInitdata,
        payout,
        createSupplier,
        deleteSupplier
    }
}

export default {
    create
}