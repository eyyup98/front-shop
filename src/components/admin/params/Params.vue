<template class="template">
  <ParamModal v-if="modal === true" @updateParent="updateParentMethod" :objectParent="modalParam"></ParamModal>

  <div class="container-block">
    <div class="d-flex flex-column">
      <h1 class="h1">Параметры товаров</h1>
      <button class="btn btn-outline-dark w-25 my-3 mx-auto" @click="addParam">Добавить</button>

      <div class="form-control loading" v-if="loading === true">Загрузка данных...</div>

      <table class="table table-hover" v-if="loading === false">
        <thead >
        <tr class=" table-dark">
          <th width="30%">Каталог</th>
          <th>Группа</th>
          <th>Параметры</th>
          <th width="10%">Активный</th>
          <th width="10%">Действия</th>
        </tr>
        </thead>

        <tbody v-for="(catalog, index) in object" style="border: #dedede solid 1px">
        <tr @click="catalog.view_groups = catalog.view_groups === false">
          <th class="fw-semibold">{{catalog.name}}</th>
          <th colspan="4" class="ps-4" v-if="catalog.groups.length > 0 && catalog.view_groups === false">
            <img src="@/assets/icons/up.png" width="25" height="25"/>
          </th>
          <th colspan="4" class="ps-4" v-else-if="catalog.groups.length > 0 && catalog.view_groups === true">
            <img src="@/assets/icons/down.png" width="25" height="25"/>
          </th>
          <th colspan="4" v-else></th>
        </tr>

        <template v-if="catalog.groups.length > 0 && catalog.view_groups === true" v-for="group in catalog.groups">
          <tr @click="group.view_params = group.view_params === false">
            <th></th>
            <th>{{group.name}}</th>
            <th colspa class="ps-4" v-if="group.params.length > 0 && group.view_params === false">
              <img src="@/assets/icons/up.png" width="25" height="25"/>
            </th>
            <th colspa class="ps-4" v-else-if="group.params.length > 0 && group.view_params === true">
              <img src="@/assets/icons/down.png" width="25" height="25"/>
            </th>
            <th colspa v-else></th>
            <th v-if="catalog.active === 1">
              <i class="d-flex justify-content-center active-icon">
                <img src="@/assets/icons/active.png" width="30" height="30"/>
              </i>
            </th>
            <th v-if="catalog.active === 0">
              <i class="d-flex justify-content-center none-active-icon">
                <img src="@/assets/icons/disactive.png" width="30" height="30"/>
              </i>
            </th>
            <th>
              <div class="d-flex justify-content-center align-items-center р-25">
                <img class="shadow-edit" src="@/assets/icons/edit.png" width="30"  @click="editParam(group)"/>
              </div>
            </th>
          </tr>

          <template v-if="group.params.length > 0 && group.view_params === true" v-for="param in group.params">
            <tr>
              <th colspan="2"></th>
              <th colspan="3">{{param.name}}</th>
            </tr>
          </template>
        </template>
        </tbody>
      </table>
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
        catalog_id: null,
        group_id: null,
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
      object.view_params = object.view_params === false
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