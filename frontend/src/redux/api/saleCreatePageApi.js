import axios from 'axios';
import endpoints from './endpoints';
import { parseErrorData, createUrlParamsFromFilters } from './utils';

const create = () => {
    const getInitData = (filters) => {
        const token = localStorage.getItem('token');
        const params = createUrlParamsFromFilters(filters);
        return axios({
            method: 'get',
            url: endpoints.SALE_CREATE_PAGE_DATA,
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

    const createSale = dataToSave => {
        const token = localStorage.getItem('token') || '';

        return axios({
            method: 'post',
            url: endpoints.SALE_CREATE_PAGE_CREATE,
            data: dataToSave,
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
        getInitData,
        createSale
    }
}

export default {
    create
}