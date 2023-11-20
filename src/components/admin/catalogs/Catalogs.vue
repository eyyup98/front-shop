<template class="template">
  <NavBar></NavBar>

  <CatModal v-if="modal === true" :index="index" :catalog="modalCat" @updateParent="updateParentMethod"></CatModal>

  <div class="container">
    <h1 class="h1 m">Catalogs</h1>

    <button @click="addCat">Добавить категорию</button>

    <div class="loading" v-if="loading === true">Загрузка данных...</div>
    <table class="" v-if="loading === false">
      <thead class="">
      <tr>
        <th id="cat-name" @click="" class="">Название</th>
        <th id="cat-active" @click="" class="">Активный</th>
        <th class="">Действия</th>
      </tr>
      </thead>


      <tbody class="" v-for="(row, index) in catalogs">
      <tr>

        <th>{{ row.name }}</th>
        <th>{{ row.active }}</th>


        <th>
          <i class="" @click="deleteCat(index)">d</i>
          <i class="" @click="editCat(index)">e</i>
        </th>
      </tr>
      </tbody>
    </table>

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
      modalCat: null,
      index: null,
    }
  },
  methods: {
    updateParentMethod(data){
      this.modal = data.close
      this.catalogs[data.index] = data.modalCat
    },
    addCat() {

    },
    deleteCat(index){
      if (confirm('Вы действителдьно хотите удалить каталог "' + this.catalogs[index].name + '"')) {
      }
    },
    editCat(index){
      this.modal = true
      this.modalCat = this.catalogs[index]
      this.index = index
      // console.log('this.modalCat')
      // console.log(this.modalCat)
    }
  },
  async mounted() {
    try {
      await axios.get('http://back.ey/api/v1/catalogs', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.catalogs = response.data
      ))
      this.loading = false
    } catch (exception) {}
  }
}
</script>

<style scoped>
.template {
  /*border: 10px solid red;*/
}
.h1 {
  text-align: center;
}
.container {
  padding: 10px;
  background-color: rgba(119, 255, 133, 0.3);
  display: flex;
  flex-direction:column;
  margin: 5% auto 0;
}
.loading {
  margin: 30px 0 0 0;
  text-align: center;
}
</style>