import Vue from 'vue';
import Router from 'vue-router';

// Routes
import About from '../pages/about/About';
import Downloads from '../pages/downloads/Downloads';
import Settings from '../pages/settings/Settings';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
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
