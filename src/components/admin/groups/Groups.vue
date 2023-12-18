<template class="template">
  <GroupModal v-if="modal === true" @updateParent="updateParentMethod" :objectParen="modalGroup">
  </GroupModal>

  <div class="container-block">
    <div class="d-flex flex-column">
      <h1 class="h1">Группы</h1>
      <button class="btn btn-outline-dark w-25 my-3 mx-auto" @click="addGroup">Добавить группу</button>

      <div class="form-control loading" v-if="loading === true">Загрузка данных...</div>

      <table class="table table-hover" v-if="loading === false">
        <thead>
        <tr class=" table-dark">
          <th width="30%">Каталог</th>
          <th>Группы</th>
          <th width="10%">Активный</th>
          <th width="10%">Действия</th>
        </tr>
        </thead>

        <tbody v-for="(row, index) in catalogs" style="border: #dedede solid 1px">
        <tr @click="row.view_groups = row.view_groups === false">
          <th class="fw-semibold">{{row.name}}</th>
          <th class="ps-4" v-if="row.groups.length > 0 && row.view_groups === false">
            <img src="@/assets/icons/up.png" width="25" height="25"/>
          </th>
          <th class="ps-4" v-else-if="row.groups.length > 0 && row.view_groups === true">
            <img src="@/assets/icons/down.png" width="25" height="25"/>
          </th>
          <th v-else></th>
          <th v-if="row.active === 1">
            <i class="d-flex justify-content-center active-icon">
              <img src="@/assets/icons/active.png" width="30" height="30"/>
            </i>
          </th>
          <th v-if="row.active === 0">
            <i class="d-flex justify-content-center none-active-icon">
              <img src="@/assets/icons/disactive.png" width="30" height="30"/>
            </i>
          </th>
          <th>
            <div class="d-flex justify-content-center align-items-center р-25">
              <img class="shadow-edit" src="@/assets/icons/edit.png" width="30"  @click="editGr(row)"/>
            </div>
          </th>
        </tr>
        <template v-if="row.groups.length > 0 && row.view_groups === true" v-for="groups in row.groups">
          <tr>
            <th colspan="1"></th>
            <th colspan="3">{{groups.name}}</th>
          </tr>
        </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import GroupModal from "./GroupModal.vue";
import func from "../../../js/functions"

export default {
  name: "Groups",
  components: {
    GroupModal
  },
  data() {
    return {
      loading: true,
      catalogs: null,
      modal: false,
      modalGroup: null,
    }
  },
  methods: {
    async getData() {
      this.loading = true
      try {
        await axios.get('http://back.ey/api/v1/catalogs/for-groups', {
          params: {
            token: localStorage.access_token
          }
        }).then(response => (
            this.catalogs = response.data
        ))
      } catch (exception) {
        func.toastElList(exception.response.data.msg);
        return;
      }

      this.loading = false
    },
    newGroup(){
      return {
        catalog_id: null,
        groups: []
      }
    },
    async updateParentMethod(data) {
      this.modal = false

      if (data.changed === true) {
        await this.getData()
        func.toastElList('Сохранено');
      }
    },
    editGr(object) {
      object.view_groups = object.view_groups === false
      this.modalGroup = object
      this.modal = true
    },
    addGroup() {
      this.modalGroup = this.newGroup()
      this.modal = true
    },
  },
  async mounted() {
    await this.getData()
  }
}
</script>

<style scoped>
</style>