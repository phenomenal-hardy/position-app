import Vue from 'vue'
import VueRouter from 'vue-router';

// stores
import { useSessionStore } from '@/stores/session';


// views
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true
      }
    },
    
    { path: '/auth/login', name: 'Login', component: LoginView }
  ]
});


router.beforeEach((to, from, next) => {

  const store = useSessionStore();

  let redirectToLogin = false;

  if (to.meta?.requiresAuth && !store.userIsAuthenticated) {

    redirectToLogin = true;
  }


  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.userIsAuthenticated && redirectToLogin) {

      next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })

    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }


});


export default router
