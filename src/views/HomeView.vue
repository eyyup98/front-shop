<!--<script setup>-->
<!--import TheWelcome from '../components/TheWelcome.vue'-->
<!--</script>-->

<template>
<!--  <main>-->
    <h1>Домашняя страница</h1>
<!--    <button class="button" type="submit" @click="login">Войти в кабинет</button>-->
    <button class="button" type="submit" @click="login">Войти в кабинет</button>
<!--    <TheWelcome />-->
<!--  </main>-->
</template>

<script>
import router from "../router";

export default {
  name: "home",
  methods: {
    login: function () {
        router.push({path: '/admin/auth'})
    }
  },
}
</script>
<style>
.button {
  height: 30px;
  width: 200px;
  margin: 0 auto 10px;
  background-color: rgba(17, 57, 0, 0.54);
  border-radius: 5px;
  color: white;
  font-size: 18px;
}
</style>