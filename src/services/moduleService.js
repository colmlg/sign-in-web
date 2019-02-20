import authHeader from './authHeader';
import loginService from './loginService';
import constants from '../Constants';

const moduleService = {
    getModules
};

function getModules() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(constants.BACKEND_URL + "/module", requestOptions).then(handleResponse)
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                loginService.logout();
                window.location.reload(true);
            }

            const error = (data && data.error) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

export default moduleService;