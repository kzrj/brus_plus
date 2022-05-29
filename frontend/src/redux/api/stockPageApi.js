import axios from 'axios';
import endpoints from './endpoints';
import { parseErrorData, createUrlParamsFromFilters } from './utils';

const create = () => {
    const getStock = (filters) => {
        const token = localStorage.getItem('token');
        const params = createUrlParamsFromFilters(filters);
        return axios({
            method: 'get',
            url: endpoints.STOCK,
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

    const setLumberPrice = payload => {
        // const { med_type, med_method, drug, doze } = payload;
        const token = localStorage.getItem('token') || '';
        const url = endpoints.MANAGER_STOCK_SET_LUMBER_PRICE;

        // const formData = new FormData();
        // formData.append("med_type", med_type);
        // formData.append("med_method", med_method);
        // doze && formData.append("doze", doze);
        // formData.append("drug", drug);
        
        return axios({
                    method: 'post',
                    url: url,
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

    return {
        getStock,
        setLumberPrice
    }
}

export default {
    create
}