//http://jasonwatmore.com/post/2017/12/07/react-redux-jwt-authentication-tutorial-example
import constants from '../Constants';

const loginService = {
    login,
    logout,
    register
};

function login(username, password) {

    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: username, password: password })
    };

    return fetch(constants.BACKEND_URL + '/login', requestOptions)
        .then(handleResponse).then(user => {
            if (user.token) {
                user.id = username;
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        });
}

function register(username, password) {
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: username, password: password, role: 'lecturer' })
    };

    return fetch(constants.BACKEND_URL + '/register', requestOptions)
        .then(handleResponse).then(user => {
            if (user.token) {
                user.id = username;
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        });

}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401 && JSON.parse(localStorage.getItem('user'))) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.error) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}

export default loginService;