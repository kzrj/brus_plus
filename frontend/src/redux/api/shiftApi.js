import axios from 'axios';
import endpoints from './endpoints';
import { parseErrorData, createUrlParamsFromFilters } from './utils';

const create = () => {
    const getLumbers = (filters) => {
        const params = createUrlParamsFromFilters(filters);
        return axios.get(endpoints.LUMBERS, { params })
        .then(response => response.data)
        .catch(err => {
            const error = new Error(err);
            error.data = parseErrorData(err);
            throw error;
        })
    }

    const createShift = payload => {
        const { med_type, med_method, drug, doze } = payload;
        const token = localStorage.getItem('token') || '';
        const url = endpoints.RECIPES;

        const formData = new FormData();
        formData.append("med_type", med_type);
        formData.append("med_method", med_method);
        doze && formData.append("doze", doze);
        formData.append("drug", drug);
        
        return axios({
                    method: 'post',
                    url: url,
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

    return {
        getLumbers,
        createShift,
    }
}

export default {
    create
}