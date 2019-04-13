import Vue    from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// Routes
import Home      from '../pages/home/Home';
import Downloads from '../pages/downloads/Downloads';
import Settings  from '../pages/settings/Settings';

export default new Router({
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/downloads',
            name: 'downloads',
            component: Downloads
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});
