import Home from './container/Home/Home';
import Data from './container/Data/Data';
import User from './container/User/User';
import Login from './container/Login/Login';
import Detail from './container/Detail/Detail';
import UserInfo from './container/UserInfo/UserInfo';
import Account from './container/Account/Account';

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/data',
        component: Data
    },
    {
        path: '/user',
        component: User
    },
    {
        path: '/detail',
        component: Detail
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/userinfo',
        component: UserInfo
    },
    {
        path: '/account',
        component: Account
    }
];

export default routes;
