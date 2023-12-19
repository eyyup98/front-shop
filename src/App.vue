<script>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from "./components/admin/NavBar.vue";
import NavBarClient from "./components/client/NavBarClient.vue";
export default {
  name: "App",
  components: {
    NavBar,
    NavBarClient
  },
  data() {
    return {
    }
  },
  computed: {
    now_route() {
      return this.$route.fullPath.split('/')[1];
    }
  },
}
</script>

<template>
  <NavBar v-if="now_route === 'admin'"></NavBar>
  <NavBarClient v-else></NavBarClient>

  <div class="toast text-white bg-primary" role="alert" aria-live="assertive" aria-atomic="true" style="z-index: 9999 !important;position: absolute; right: 5px; bottom: 5px;opacity: 1;">
    <div class="d-flex">
      <div class="toast-body">
        <span id="messageText"></span>
      </div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
    </div>
  </div>

  <div class="all-content">
    <RouterView />
  </div>
</template>

<style scoped>
/*.template{*/
/*  border: #a80000 2px solid;*/
/*}*/
.all-content{
  background-color: rgb(255, 255, 255);
  margin: 0 auto;
  padding: 10px 20px 0;
  max-width: 1600px;
}
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  /*display: block;*/
  /*margin: 0 auto 2rem;*/
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  /*margin-top: 2rem;*/
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

  /*.logo {*/
  /*  margin: 0 2rem 0 0;*/
  /*}*/

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    /*margin-left: -1rem;*/
    font-size: 1rem;

    padding: 1rem 0;
    /*margin-top: 1rem;*/
  }
}
</style>
