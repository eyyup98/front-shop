<template class="template">
    <div class="container">
      <h1 class="h1">Sign in</h1>
      <label class="label">User name</label>
      <input class="input" required v-model="login" type="text" placeholder="Snoopy"/>
      <label class="label">Password</label>
      <input class="input" required v-model="password" type="password" placeholder="Password"/>
      <button class="button" type="submit" @click="auth">Login</button>
      <span v-if="text !== null" class="span">{{text}}</span>
    </div>
</template>

<script>
import axios from "axios";
import router from "../../router";

export default {
  name: "Auth",
  data(){
    return {
      login: null,
      password: null,
      response: null,
      text: null,
    }
  },
  methods: {
    auth: async function () {
      try {
        await axios.post('https://etaganov-trade.ru/api/v1/auth/authentication', {
          login: this.login,
          password: this.password,
        }).then(response => (
            localStorage.access_token = response.data.token
        ))
      } catch (exception) {
        this.text = 'Неверный логин или пароль!'
        setTimeout(() => {
          this.text = null
        }, 2000);
        return;
      }

      await router.push({path: '/admin/panel/catalogs'})
    }
  },
  async mounted() {
    if (typeof localStorage.access_token !== "undefined") {
      try {
        await axios.get('https://etaganov-trade.ru/api/v1/verification', {
          params: {
            token: localStorage.access_token
          }
        })
      } catch (exception) {
        delete localStorage.access_token
        // await router.push({path: '/'})
        return;
      }
      await router.push({path: '/admin/panel/catalogs'})
    }
  }
}
</script>

<style scoped>
.h1 {
  text-align: center;
}
.label {
  font-size: 24px;
}
.button {
  height: 30px;
  width: 50%;
  margin: 0 auto 10px;
  background-color: rgba(17, 57, 0, 0.54);
  border-radius: 5px;
  color: white;
  font-size: 18px;
}
.span {
  text-align: center;
  color: #e80000;
  font-size: 18px;
}
</style>