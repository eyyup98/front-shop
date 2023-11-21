<template class="template">
  <NavBar></NavBar>

  <ParamModal v-if="modal === true" @updateParent="updateParentMethod" :objectParent="modalParam"></ParamModal>

  <div class="container">

  <h1 class="h1 m">Параметры товаров</h1>

  <button class="button" @click="addParam">Добавить</button>

  <div class="loading" v-if="loading === true">Загрузка данных...</div>
  <table class="table" v-if="loading === false">
    <thead class="thead">
    <tr>
      <th>#</th>
      <th>Каталог</th>
      <th>Группа</th>
      <th>Подгруппа</th>
      <th>Заголовок параметров</th>
      <th>Активный</th>
      <th class="th-events">Действия</th>
    </tr>
    </thead>

    <tbody class="" v-for="(row, index) in paramsTitle">
    <tr>
      <th style="font-size: 20px; width: 50px" v-if="row.params.length !== 0 && row.view_params === false" @click="row.view_params = true">V</th>
      <th style="font-size: 20px; width: 50px"  v-else-if="row.params.length !== 0 && row.view_params === true" @click="row.view_params = false">X</th>
      <th v-else></th>
      <th>{{ row.catalog_name }}</th>
      <th>{{ row.group_parent_name }}</th>
      <th>{{ row.group_child_name }}</th>
      <th>{{ row.name }}</th>
      <th>{{ row.group_active }}</th>
      <th>
        <i class="delete" @click="deleteParam(row)">d</i>
        <i class="edit" @click="editParam(row)">e</i>
      </th>
    </tr>

    <tr v-if="row.view_params === true && row.params.length !== 0">
      <th colspan="7">Параметры</th>
    </tr>
    <tr class="child-list" v-if="row.view_params === true" v-for="(row2) in row.params">
      <th colspan="7">{{ row2.name }}</th>
    </tr>
    </tbody>
  </table>

  <span id="param-message"></span>
</div>
</template>

<script>
import NavBar from "../NavBar.vue";
import axios from "axios";
import ParamModal from "./ParamModal.vue";

export default {
  name: "Params",
  components: {
    NavBar,
    ParamModal
  },
  data() {
    return {
      loading: true,
      paramsTitle: null,
      modalParam: null,
      modal: null,
    }
  },
  methods: {
    async getData() {
      this.loading = true

      await axios.get('http://back.ey/api/v1/params-title', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.paramsTitle = response.data
      ))

      this.loading = false
    },
    newParam() {
      return {
        id: '',
        catalog_id: null,
        group_parent_id: null,
        group_child_id: null,
        name: '',
        params: [],
      }
    },
    addParam(){
      this.modalParam = this.newParam()
      this.modal = true
    },
    async updateParentMethod(data) {
      this.modal = false

      if (data.changed === true) {
        this.loading = true
        await this.getData()
      }
    },
    editParam(object) {
      this.modalParam = object
      this.modal = true
    },
    async deleteParam(object) {
      if (confirm(`Вы действителдьно хотите удалить параметр "` + object.name + '"')) {
        try {
          await axios.delete('http://back.ey/api/v1/params-title/' + object.id, {
            params: {
              token: localStorage.access_token
            }
          })
        } catch (exception) {
          document.getElementById('param-message').innerHTML = exception.response.data.msg
          setTimeout(() => {
            document.getElementById('param-message').innerHTML = ''
          }, 3000);
          return;
        }
        await this.getData()
      }
    }
  },
  async mounted() {
    await this.getData()
  }
}
</script>

<style scoped>
</style>