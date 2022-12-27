<script setup lang="ts">

import { useSessionStore } from '@/stores/session';
import router from '@/router/index';
import { computed, onMounted, ref, type Ref } from 'vue';

const sessionStore = useSessionStore();

const userIsAuthenticated = computed(() => sessionStore.userIsAuthenticated);

const displayMessage = computed(() => getDisplayMessage());


onMounted(() => {




  /*
  if(userIsAuthenticated.value) {  

    displayMessage.value = `¡Hola ${sessionStore.user?.name}!`;
  }
  */

});

const getDisplayMessage = () => {

  if(sessionStore.userIsAuthenticated) {

      return `¡Hola ${sessionStore.user?.name}!`
  }

  return 'Position APP';

}

const handleLogOut = () => {


  sessionStore.$patch((state) => {
    state.user = null;
    state.authenticated = false;
  });


  router.push('/auth/login');

}


</script>

<template>
  <!-- App.vue -->

  <v-app>
    <v-navigation-drawer app>
      <!-- -->
    </v-navigation-drawer>

    <v-app-bar dense elevation="4" app>

      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>
        {{ displayMessage }} 
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-show="userIsAuthenticated" depressed @click="handleLogOut">
        Cerrar Sesion
      </v-btn>



      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <!-- -->
    </v-app-bar>
    <v-main>
      <v-container fluid>

        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
