<template class="template">
  <ParamModal v-if="modal === true" @updateParent="updateParentMethod" :objectParent="modalParam"></ParamModal>


  <div class="container-block">
    <div class="d-flex flex-column">
      <h1 class="h1">Параметры товаров</h1>
      <button class="btn btn-outline-primary w-25 my-3 mx-auto" @click="addParam">Добавить</button>

      <div class="form-control loading" v-if="loading === true">Загрузка данных...</div>

      <table class="table table-bordered table-hover" v-if="loading === false">
        <thead class="thead-dark">
        <tr>
          <th class="fw-bold" width="5%">#</th>
          <th class="fw-bold" width="20%">Каталог</th>
          <th class="fw-bold" width="20%">Группа</th>
          <th class="fw-bold">Заголовок</th>
          <th class="fw-bold" width="5%">Действия</th>
        </tr>
        </thead>

        <tbody class="" v-for="(catalog, index) in object">
        <tr @click="catalog.view_groups = catalog.view_groups === false">
          <th style="font-size: 20px; width: 50px" v-if="catalog.groups.length !== 0 && catalog.view_groups === false">↓</th>
          <th style="font-size: 20px; width: 50px"  v-else-if="catalog.groups.length !== 0 && catalog.view_groups === true">✕</th>
          <th v-else></th>
          <th>{{ catalog.name }}</th>
          <th colspan="3"></th>

<!--          <th>{{ row.group_name }}</th>-->
<!--          <th>{{ row.name }}</th>-->
<!--          <th>-->
<!--            <div class="d-flex justify-content-center align-items-center р-25">-->
<!--              <img src="@/assets/icons/edit.png" width="25"  @click="editParam(row)"/>-->
<!--              <img class="ms-2" src="@/assets/icons/delete.png" width="25"  @click="deleteParam(row)"/>-->
<!--            </div>-->
<!--          </th>-->
        </tr>

        <tr v-if="catalog.groups.length !== 0 && catalog.view_groups === true" v-for="(group, index2) in catalog.groups"
            @click="group.view_params = group.view_params === false">
          <th colspan="2" style="font-size: 20px; width: 50px" v-if="group.param_title.length !== 0 && group.view_params === false">↓</th>
          <th colspan="2" style="font-size: 20px; width: 50px"  v-else-if="group.param_title.length !== 0 && group.view_params === true">✕</th>
          <th colspan="2" v-else></th>
          <th>{{ group.name }}</th>
          <th colspan="2"></th>
        </tr>

        <tr v-if="catalog.groups.length !== 0 && catalog.view_groups === true" v-for="(group, index2) in catalog.groups"
            @click="group.view_params = group.view_params === false">
          <th colspan="2" style="font-size: 20px; width: 50px" v-if="group.param_title.length !== 0 && group.view_params === false">↓</th>
          <th colspan="2" style="font-size: 20px; width: 50px"  v-else-if="group.param_title.length !== 0 && group.view_params === true">✕</th>
          <th colspan="2" v-else></th>
          <th>{{ group.name }}</th>
          <th colspan="2"></th>
        </tr>


<!--        <tr v-if="row.view_params === true && row.params.length !== 0">-->
<!--          <th colspan="7" class="text-center fw-bold">Параметры</th>-->
<!--        </tr>-->
<!--        <tr class="child-list" v-if="row.view_params === true" v-for="(row2) in row.params">-->
<!--          <th colspan="7" class="text-center">{{ row2.name }}</th>-->
<!--        </tr>-->
        </tbody>
      </table>

      <span id="param-message"></span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ParamModal from "./ParamModal.vue";
import func from "../../../js/functions"

export default {
  name: "Params",
  components: {
    ParamModal
  },
  data() {
    return {
      loading: true,
      object: null,
      modalParam: null,
      modal: null,
    }
  },
  methods: {
    async getData() {
      this.loading = true

      try {
      await axios.get('http://back.ey/api/v1/catalogs/for-params', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.object = response.data
      ))
    } catch (exception) {
      func.toastElList(exception.response.data.msg);
      return;
    }

      this.loading = false
    },
    newParam() {
      return {
        id: '',
        catalog_id: null,
        group_id: null,
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
        await this.getData()
        func.toastElList('Сохранено');
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
          func.toastElList(exception.response.data.msg);
          return;
        }
        func.toastElList('Удалено');
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