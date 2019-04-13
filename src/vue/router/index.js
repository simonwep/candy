import Vue    from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// Routes
import Home from '../pages/Home';

export default new Router({
    routes: [
        {path: '/', component: Home},
        {path: '*', redirect: '/'}
    ]
});
