import axios from 'axios';
import endpoints from './endpoints';
import { parseErrorData, createUrlParamsFromFilters } from './utils';

const create = () => {
    const getReport = (filters) => {
        const token = localStorage.getItem('token');
        const params = createUrlParamsFromFilters(filters);
        return axios({
            method: 'get',
            url: endpoints.DAILY_REP_PAGE,
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

    return {
        getReport,
    }
}

export default {
    create
}