<template>
    <nav class="nav">
        <p class="navbar-p"><router-link class="nav-link" to="/">SHOP</router-link></p>

        <ul class="nav-list">
            <li class="nav-item active">
                <router-link class="nav-link" to="/admin/panel/catalogs">Кталог</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/admin/panel/groups">Группы</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/admin/panel/params">Параметры товаров</router-link>
            </li>
            <li class="nav-item">
                <button class="nav-link" @click="logout">Выход</button>
            </li>
        </ul>
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
  font-size: 18px;
}
.nav-list{
  display: flex;
  list-style-type: none;
}
.nav-item {
  padding: 0 10px 0;
}
</style>
