<script>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from "./components/admin/NavBar.vue";
export default {
  name: "App",
  components: {
    NavBar
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


/*import axios from "axios";
import router from "./router";
console.log('localStorage.access_token');
console.log(localStorage.access_token);
if (localStorage.access_token !== null) {
  document.getElementsByClassName('wrapper').visibility = 'hidden';
} /!*else {
  document.getElementById('wrapper').style.display = 'none';
}*!/
export default {
  name: "App",
  data(){
    return {
      access_token: null
    }
  },
  mounted() {
    this.access_token = localStorage.access_token;
    console.log('this.access_token')
    console.log(this.access_token)
  }
}*/
</script>

<template>
<!--  <h1>{{now_route}}</h1>-->
  <NavBar v-if="now_route === 'admin'"></NavBar>
<!--  <header id="header-access_token">-->
<!--  <header>-->
<!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->

<!--    <div class="wrapper">-->
<!--      <h1>{{this.localStorage.access_token}}</h1>-->
<!--      <nav>-->
<!--        <RouterLink to="/admin/panel/catalogs">Catalog</RouterLink>-->
<!--        <RouterLink to="/about">About</RouterLink>-->
<!--        <RouterLink to="/admin/auth">Вход</RouterLink>-->
<!--      </nav>-->
<!--    </div>-->
<!--  </header>-->
<!--  <header>-->
<!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->

<!--    <div class="wrapper">-->
<!--      <HelloWorld msg="You did it!" />-->

<!--      <nav>-->
<!--        <RouterLink to="/">Home</RouterLink>-->
<!--        <RouterLink to="/about">About</RouterLink>-->
<!--        <RouterLink to="/admin/auth">Вход</RouterLink>-->
<!--      </nav>-->
<!--    </div>-->
<!--  </header>-->
  <div class="template">
    <div class="all-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.template{
  background-color: rgba(0, 0, 0, 0.05);
}
.all-content{
  background-color: rgb(255, 255, 255);
  margin: 0 auto;
  max-width: 1200px;
  height: 100vh;
  padding: 20px;
}
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
