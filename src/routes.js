import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
    return <div>Loading...</div>;
}

const Dashboard = Loadable({
    loader: () => import('./views/Dashboard'),
    loading: Loading,
});

const AddModule = Loadable({
    loader: () => import('./views/Module/AddModuleForm'),
    loading: Loading,
});

const ModuleDetails = Loadable({
    loader: () => import('./views/Module/AddModuleForm'),
    loading: Loading,
});

const Register = Loadable({
    loader: () => import('./views/Pages/Register'),
    loading: Loading,
});

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
    {path: '/', exact: true, name: 'Home', component: DefaultLayout},
    {path: '/dashboard', name: 'Dashboard', component: Dashboard},
    {path: '/module/new', name: 'Add a Module', component: AddModule},
    {path: '/module/:id', name: 'Module Details', component: ModuleDetails},
    {path: '/register', name: 'Register', component: Register},
];

export default routes;
