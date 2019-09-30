import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Cookies from 'universal-cookie';
import setAuthorizationToken from './store/services/setAuthorizationToken';
import { AUTH_KEY } from './helpers/constants';
import store from './store/store';
import './custom.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { getUserInfo, getPortalSettings } from './store/auth/actions';

var token = (new Cookies()).get(AUTH_KEY);

if(!token) {
    store.dispatch(getPortalSettings);
}

if (token) {
    if (!window.location.pathname.includes("confirm/EmailActivation")) {
        setAuthorizationToken(token);
        store.dispatch(getUserInfo);
    }
    else {
        setAuthorizationToken();
    }
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
