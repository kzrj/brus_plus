import axios from 'axios';
import endpoints from './endpoints';
import { parseErrorData, createUrlParamsFromFilters } from './utils';

const create = () => {
    const getShiftList = (filters) => {
        const token = localStorage.getItem('token');
        const params = createUrlParamsFromFilters(filters);
        return axios({
            method: 'get',
            url: endpoints.SHIFT_LIST_PAGE_LIST,
            headers: {'Authorization': `JWT ${token}` },
            params: params
          })
        .then(response => response.data)
        .catch(err => {
            const error = new Error(err);
            error.data = parseErrorData(err);
            throw error;
        })
    }

    const deleteShift = id => {
        const token = localStorage.getItem('token') || '';

        return axios({
            method: 'delete',
            url: endpoints.shift_list_delete(id),
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
        getShiftList,
        deleteShift
    }
}

export default {
    create
}