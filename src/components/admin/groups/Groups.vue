<template class="template">
  <GroupModal v-if="modal === true" @updateParent="updateParentMethod" :object="modalGroup">
  </GroupModal>

  <div class="container-block">
    <div class="d-flex flex-column">
      <h1 class="h1">Группы</h1>
      <button class="btn btn-outline-primary w-25 my-3 mx-auto" @click="addGroup">Добавить</button>

      <div class="form-control loading" v-if="loading === true">Загрузка данных...</div>

      <table class="table table-bordered" v-if="loading === false">
        <thead>
        <tr class=" table-dark">
          <th class="fw-bold" width="10%">#</th>
          <th class="fw-bold" colspan="2">Каталог</th>
        </tr>
        </thead>

        <tbody v-for="(row, index) in catalogs">
        <tr @click="row.view_groups = row.view_groups === false">
          <th style="font-size: 20px; width: 50px" v-if="row.groups.length > 0 && row.view_groups === false">↓</th>
          <th style="font-size: 20px; width: 50px"  v-else-if="row.groups.length > 0 && row.view_groups === true">✕</th>
          <th v-else></th>
          <th>{{row.name}}</th>
        </tr>

        <tr v-if="row.groups.length > 0 && row.view_groups === true">
          <td colspan="6" >
            <table class="table table-sm mb-0 px-2 table-hover" v-if="loading === false">
              <thead>
              <tr>
                <th width="5%"></th>
                <th class="fw-bold">Группа</th>
                <th class="fw-bold" width="10%">Активный</th>
                <th class="fw-bold" width="10%">Действия</th>
              </tr>
              </thead>
              <tbody v-for="groups in row.groups" @click="groups.view_subgroups = groups.view_subgroups === false;">
              <tr>
                <th style="font-size: 18px; width: 50px; text-align: center" v-if="groups.subgroups.length > 0 && groups.view_subgroups === false">↓</th>
                <th style="font-size: 18px; width: 50px; text-align: center"  v-else-if="groups.subgroups.length > 0 && groups.view_subgroups === true">✕</th>
                <th v-else></th>
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

              <tr v-if="groups.subgroups.length > 0 && groups.view_subgroups === true" style="text-align: center">
                <td colspan="4" class="p-0">
                  <table class="table table-sm table-borderless m-0" v-if="loading === false">
                    <thead>
                    <tr>
                      <th colspan="3" class="fw-bold">Подгруппы</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="subgroups in groups.subgroups">
                      <th>{{subgroups.name}}</th>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              </tbody>
            </table>
          </td>
        </tr>
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
        await axios.get('http://back.ey/api/v1/catalogs', {
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
        parent_id: null,
        name: '',
        active: 1,
        subgroups: []
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