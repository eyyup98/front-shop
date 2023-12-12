<template class="template">
  <GroupModal v-if="modal === true" @updateParent="updateParentMethod" :object="modalGroup">
  </GroupModal>

  <div class="container-block">
    <div class="d-flex flex-column">
      <h1 class="h1">Группы</h1>
      <button class="btn btn-outline-dark w-25 my-3 mx-auto" @click="addGroup">Добавить группу</button>

      <div class="form-control loading" v-if="loading === true">Загрузка данных...</div>

      <table class="table table-hover" v-if="loading === false">
        <thead >
        <tr class=" table-dark">
          <th width="30%">Каталог</th>
          <th>Группа</th>
          <th width="10%">Активный</th>
          <th width="10%">Действия</th>
        </tr>
        </thead>

        <tbody v-for="(row, index) in catalogs" style="border: #dedede solid 1px">
        <tr @click="row.view_groups = row.view_groups === false">
          <th class="fw-semibold">{{row.name}}</th>
          <th colspan="3" v-if="row.groups.length > 0 && row.view_groups === false">↓</th>
          <th colspan="3"  v-else-if="row.groups.length > 0 && row.view_groups === true">✕</th>
          <th colspan="3" v-else></th>
        </tr>
          <template v-if="row.groups.length > 0 && row.view_groups === true" v-for="groups in row.groups">
            <tr>
              <th colspan="1"></th>
              <th>{{groups.name}}</th>
              <th v-if="groups.active === 1">
                <i class="d-flex justify-content-center active-icon">✔</i>
              </th>
              <th v-if="groups.active === 0">
                <i class="d-flex justify-content-center none-active-icon">✘</i>
              </th>
              <th>
                <div class="d-flex justify-content-center align-items-center р-25">
                  <img src="@/assets/icons/edit.png" width="25"  @click="editGr(groups)"/>
                  <img class="ms-2" src="@/assets/icons/delete.png" width="25"  @click="deleteGr(groups)"/>
                </div>
              </th>
            </tr>
          </template>
        </tbody>
      </table>
      <span id="group-message"></span>
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
        id: '',
        catalog_id: null,
        name: '',
        active: 1
      }
    },
    async updateParentMethod(data) {
      this.modal = false

      if (data.changed === true) {
        await this.getData()
        func.toastElList('Сохранено');
      }
    },
    async deleteGr(object) {
      if (confirm(`Вы действителдьно хотите удалить группу "` + object.name + '"')) {
        try {
          await axios.delete('http://back.ey/api/v1/groups/' + object.id, {
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
    },
    editGr(object) {
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