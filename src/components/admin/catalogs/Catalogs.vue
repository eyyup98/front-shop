<template>
  <NavBar></NavBar>

  <CatModal v-if="modal === true" :catalog="modalCat" @updateParent="updateParentMethod"></CatModal>

  <div class="container">
    <h1 class="h1 m">Catalogs</h1>

    <button class="button" @click="addCat">Добавить категорию</button>

    <div class="loading" v-if="loading === true">Загрузка данных...</div>
    <table class="table" v-if="loading === false">
      <thead class="thead">
      <tr>
        <th>Название</th>
        <th>Активный</th>
        <th>Действия</th>
      </tr>
      </thead>
      <tbody class="" v-for="(row, index) in catalogs">
      <tr>
        <th>{{ row.name }}</th>
        <th>{{ row.active }}</th>
        <th>
          <i class="delete" @click="deleteCat(index)">d</i>
          <i class="edit" @click="editCat(index)">e</i>
        </th>
      </tr>
      </tbody>
    </table>
    <span id="catalog-message"></span>

  </div>
</template>

<script>
import NavBar from "../NavBar.vue";
import CatModal from "./CatModal.vue";
import axios from "axios";

export default {
  name: "Catalogs",
  components: {
    NavBar,
    CatModal
  },
  data(){
    return {
      loading: true,
      catalogs: null,
      modal: false,
      modalCat: null
    }
  },
  methods: {
    async getData() {
      this.loading = true
      try {
        await axios.get('http://back.ey/api/v1/catalogs', {
          params: {
            token: localStorage.access_token
          }
        }).then(response => (
            this.catalogs = response.data
        ))
        this.loading = false
      } catch (exception) {
      }
    },
    async updateParentMethod(data) {
      this.modal = false
      if (data.changed === true) {
        this.loading = true
        await this.getData()
      }
    },
    addCat() {
      this.modal = true
      this.modalCat = {
        id: '',
        name: '',
        active: 1
      }
    },
    async deleteCat(index) {
      if (confirm('Вы действителдьно хотите удалить каталог "' + this.catalogs[index].name + '"')) {
        try {
          await axios.delete('http://back.ey/api/v1/catalogs/' + this.catalogs[index].id, {
            params: {
              token: localStorage.access_token
            }
          })
        } catch (exception) {
          document.getElementById('catalog-message').innerHTML  = exception.response.data.msg
          setTimeout(() => {
            document.getElementById('catalog-message').innerHTML  = ''
          }, 3000);
          return;
        }
        await this.getData()
      }
    },
    editCat(index){
      this.modal = true
      this.modalCat = this.catalogs[index]
    }
  },
  async mounted() {
    await this.getData()
  }
}
</script>

<style scoped>
</style>