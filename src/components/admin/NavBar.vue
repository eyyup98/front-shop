<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top py-2">
    <div class="container container-fluid">
      <router-link class="navbar-brand" to="/">
        <img class="d-inline-block align-text-top" alt="logo" src="@/assets/logo.svg" width="40"/>
        SHOP
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li :class="`nav-item ${classActive[1]}`" @click="changeActive(1)">
            <router-link class="nav-link" to="/admin/panel/catalogs">Кталог</router-link>
          </li>
          <li :class="`nav-item ${classActive[2]}`" @click="changeActive(2)">
            <router-link class="nav-link" to="/admin/panel/groups">Группы</router-link>
          </li>
          <li :class="`nav-item ${classActive[3]}`" @click="changeActive(3)">
            <router-link class="nav-link" to="/admin/panel/params">Параметры товаров</router-link>
          </li>
          <li :class="`nav-item ${classActive[4]}`" @click="changeActive(4)">
            <router-link class="nav-link" to="/admin/panel/products">Товары</router-link>
          </li>
          <li :class="`nav-item ${classActive[5]}`" @click="changeActive(5)">
            <router-link class="nav-link" to="/admin/panel/orders">Заказы</router-link>
          </li>
        </ul>
        <button class="btn btn-danger btn-sm" type="button" @click="logout">Выход</button>
      </div>
    </div>
  </nav>
<!--    <nav class="navbar navbar-dark bg-dark">-->
<!--      <div class="container">-->
<!--        <router-link to="/">SHOP</router-link>-->

<!--        <div class="collapse navbar-collapse">-->

<!--          <ul class="navbar-nav me-auto mb-2 mb-lg-0">-->
<!--            <li class="nav-item">-->
<!--             <router-link class="nav-link" to="/admin/panel/catalogs">Кталог</router-link>-->
<!--            </li>-->
<!--            <li class="nav-item">-->
<!--              <router-link class="nav-link" to="/admin/panel/groups">Группы</router-link>-->
<!--            </li>-->
<!--            <li class="nav-item">-->
<!--              <router-link class="nav-link" to="/admin/panel/params">Параметры товаров</router-link>-->
<!--            </li>-->
<!--            <li class="nav-item">-->
<!--              <router-link class="nav-link" to="/admin/panel/products">Товары</router-link>-->
<!--            </li>-->
<!--          </ul>-->

<!--          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">-->
<!--            <span class="navbar-toggler-icon" @click="logout" ></span>-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </nav>-->
</template>

<script>
import router from "../../router";
import axios from "axios";

export default {
    name: "NavBar",
    data(){
        return {
          classActive: {
            1: 'active',
            2: '',
            3: '',
            4: '',
            5: '',
          }
        }
    },
    methods: {
      changeActive(index){
        for (let i in this.classActive) {
          this.classActive[i] = '';
          if (i === index)
            this.classActive[i] = 'class';
        }
      },
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
