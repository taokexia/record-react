import Home from './container/Home/Home';
import Data from './container/Data/Data';
import User from './container/User/User';

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
];

export default routes;
