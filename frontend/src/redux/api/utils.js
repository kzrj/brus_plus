
// standart serializer field error. There are could be several fields
// {
//     "birth_id": ["This field is required."]
// }


export const parseErrorData = (error) => {

    if (error && typeof error.response !== 'undefined') {
        let errorObj = {
            status: error.response.status, 
            statusText: error.response.statusText,
            message: null,
            response: error.response,
        }
        if ('message' in error.response.data) {
            errorObj.message = JSON.stringify(error.response.data.message)
        }
        else {
            let message = ''
            for (const property in error.response.data) {
                message = message + `${property}: ${error.response.data[property]}. `
              }
            errorObj.message = message

        }
        return errorObj

    } else {
        return { 
         status: 'Connection Error',
         statusText: 'An error occurred while sending your data!',
         message: 'An error occurred while sending your data!' }
    }
}

export const createUrlParamsFromFilters = (filters) => {
    const params = new URLSearchParams()

    if (filters != null) Object.keys(filters).forEach(key => {
            if (filters[key] !== null && !(filters[key] instanceof Array)) 
                params.append(key, filters[key])
            if (filters[key] !== null && filters[key] instanceof Array){
                delete params[key]
                filters[key].map(value => {
                    if (value !== '')
                        params.append(key, value)
                    return null
                })
            }
        })
    return params
}