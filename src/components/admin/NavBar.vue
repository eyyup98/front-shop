<template>
    <nav class="navbar navbar-dark bg-dark  fixed-top bg-light py-1">
      <div class="container">
        <router-link to="/">SHOP</router-link>

        <div class="d-flex justify-content-between">
          <router-link class="nav-link" to="/admin/panel/catalogs">Кталог</router-link>
          <router-link class="nav-link" to="/admin/panel/groups">Группы</router-link>
          <router-link class="nav-link" to="/admin/panel/params">Параметры товаров</router-link>
          <router-link class="nav-link" to="/admin/panel/products">Товары</router-link>
          <button @click="logout" class="btn btn-dark">Выход</button>
        </div>
      </div>
    </nav>
</template>

<script>
import router from "../../router";
import axios from "axios";

export default {
    name: "NavBar",
    data(){
        return {
        }
    },
    methods: {
      logout(){
        if (confirm('Вы действителдьно хотите выйти из системы?')) {
            delete(localStorage.access_token)
            router.push({path: '/'})
        }
      }
    },
    async mounted() {
      if(typeof localStorage.access_token === "undefined") {
        await router.push({path: '/'})
        return;
      }

      try {
          await axios.get('http://back.ey/api/v1/verification', {
            params: {
              token: localStorage.access_token
            }
          })
      } catch (exception) {
          await router.push({path: '/'})
      }
    }
}
</script>

<style scoped>
.nav {
  display: flex;
  justify-content:space-evenly;
  background-color: white;
  /*position: fixed;*/

  /*top: 0;*/
  /*left: 0;*/
  /*font-size: 18px;*/
}
.nav-list{
  display: flex;
  list-style-type: none;
}
.nav-item {
  /*padding: 0 10px 0;*/
}
</style>
