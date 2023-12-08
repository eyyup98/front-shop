<template>
  <CatModal v-if="modal === true" :object="modalCat" @updateParent="updateParentMethod"></CatModal>

  <div class="container-block">
    <div class="d-flex flex-column">
      <h1 class="h1">Каталог</h1>

      <button class="btn btn-outline-primary w-25 my-3 mx-auto" @click="addCat">Добавить категорию</button>

      <div class="form-control loading" v-if="loading === true">Загрузка данных...</div>
      <table class="table table-bordered table-hover" v-if="loading === false">
        <thead class="thead-dark">
        <tr>
          <th>Название</th>
          <th width="10%">Активный</th>
          <th width="10%">Действия</th>
        </tr>
        </thead>
        <tbody v-for="(row, index) in catalogs">
        <tr>
          <th>{{ row.name }}</th>
          <th v-if="row.active === 1">
            <i class="d-flex justify-content-center active-icon select-none-click">✔</i>
          </th>
          <th v-if="row.active === 0">
            <i class="d-flex justify-content-center none-active-icon select-none-click">✘</i>
          </th>
          <th>
            <div class="d-flex justify-content-center">
              <img src="@/assets/icons/edit.png" width="25"  @click="editCat(index)"/>
              <img class="ms-2" src="@/assets/icons/delete.png" width="25"  @click="deleteCat(index)"/>
            </div>
          </th>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import func from "../../../js/functions"
import CatModal from "./CatModal.vue";
import axios from "axios";

export default {
  name: "Catalogs",
  components: {
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
        func.toastElList('Сохранено');
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
          func.toastElList(exception.response.data.msg);
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