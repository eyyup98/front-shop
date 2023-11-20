<template>

  <div class="modal">
<!--    <div class="header">-->
<!--      <button @click="closeModal">x</button>-->
<!--    </div>-->
      <div class="window">
<!--        <div class="">{{catalog}}</div>-->
        <label>Название каталога</label>
        <input type="text" v-model="catalog.name">
        <label>Активный</label>
        <p>
        <input type="checkbox" name="catalog-active" :checked="catalog.active" @click="active">
        </p>
        <button @click="closeModal">Отмена</button>
        <button @click="save">Сохранить</button>
        <div class="response" v-if="response !== null"></div>
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
    },
    index: {
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
        close: false,
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
      try {
        await axios.post('http://back.ey/api/v1/catalogs/' + this.catalog.id, {
          token: localStorage.access_token,
          params: {
            name: this.catalog.name,
            active: this.catalog.active,
          }
        }, {mode: "no-cors"})
      } catch (exception) {
        this.response = exception.data
      }

      this.$emit('updateParent', {
        close: false,
        index: this.index,
        modalCat: this.catalog
      })
    }
  },
  async mounted() {
  }
}
</script>

<style scoped>
.modal {
  font-size: 24px;
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
}
.window{
  background-color: white;
  width: 50%;
  min-height: 50%;
  max-height: 70%;
  align-self:center;
  display: flex;
  flex-direction:column;
}
</style>