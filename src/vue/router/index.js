import Vue    from 'vue';
import Router from 'vue-router';

// Routes
import Home      from '../pages/home/Home';
import About     from '../pages/about/About';
import Downloads from '../pages/downloads/Downloads';
import Settings  from '../pages/settings/Settings';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
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
            path: '/about',
            name: 'about',
            component: About
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
});
