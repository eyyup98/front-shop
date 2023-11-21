<template>

  <div class="modal">
<!--    <div class="header">-->
<!--      <button @click="closeModal">x</button>-->
<!--    </div>-->
      <div class="window">
<!--        <div class="">{{catalog}}</div>-->
        <label>Название каталога</label>
        <input class="input" type="text" v-model="catalog.name" v-on:keyup.enter="save" v-on:keyup.esc="closeModal">
        <label>Активный</label>
        <p>
        <input type="checkbox" name="catalog-active" :checked="catalog.active" @click="active">
        </p>
        <button class="button" @click="closeModal">Отмена</button>
        <button class="button" @click="save">Сохранить</button>
        <div class="response" v-if="response !== null"></div>

        <span id="modal-message"></span>
      </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "CatModal",
  components: {
    catalog: null
  },
  props: {
    catalog: {
      required: false
    }
  },
  data(){
    return {
      response: null
    }
  },
  methods: {
    closeModal() {
      this.$emit('updateParent', {
        changed: false,
      })
    },
    active(){
      if (this.catalog.active === 1) {
        this.catalog.active = 0
      } else if (this.catalog.active === 0) {
        this.catalog.active = 1
      }
    },
    async save() {
      if (this.catalog.name.replace(/\s/g, "") === '') {
        document.getElementById('modal-message').innerHTML  = 'Необходимо заполнить название'
        setTimeout(() => {
          document.getElementById('modal-message').innerHTML  = ''
        }, 2000);
        return;
      }

      try {
        await axios.post(`http://back.ey/api/v1/catalogs/${this.catalog.id}`, {
          token: localStorage.access_token,
          params: {
            name: this.catalog.name,
            active: this.catalog.active,
          }
        })
      } catch (exception) {
        this.response = exception.response.data
        document.getElementById('modal-message').innerHTML  = exception.response.data.msg
        setTimeout(() => {
          document.getElementById('modal-message').innerHTML  = ''
        }, 2000);
        return;
      }

      this.$emit('updateParent', {
        changed: true
      })
    }
  },
  async mounted() {
    console.log('load')
  }
}
</script>

<style scoped>
</style>