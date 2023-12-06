<template class="template">
  <GroupModal v-if="modal === true" @updateParent="updateParentMethod" :object="modalGroup">
  </GroupModal>

  <div class="container-block">
    <div class="d-flex flex-column">
      <h1 class="h1">Группы</h1>
      <button class="btn btn-outline-primary w-25 my-3 mx-auto" @click="addGroup">Добавить</button>

      <div class="form-control loading" v-if="loading === true">Загрузка данных...</div>

      <table class="table table-hover" v-if="loading === false">
        <thead class="thead-dark">
        <tr>
          <th width="10%">#</th>
          <th width="25%">Каталог</th>
          <th width="25%">Группа</th>
          <th>Подгруппа</th>
          <th width="10%">Активный</th>
          <th width="10%">Действия</th>
        </tr>
        </thead>

        <tbody v-for="(row, index) in catalogs">
        <tr class="table-light" @click="row.view_groups = row.view_groups === false">
          <th style="font-size: 20px; width: 50px" v-if="row.groups.length > 0 && row.view_groups === false"
              >↓</th>
          <th style="font-size: 20px; width: 50px"  v-else-if="row.groups.length > 0 && row.view_groups === true"
              >✕</th>
          <th v-else></th>
          <th>{{row.name}}</th>
          <th colspan="4"></th>
        </tr>
        <template v-for="groups in row.groups" v-if="row.groups.length > 0 && row.view_groups === true">
          <tr @click="groups.view_subgroups = groups.view_subgroups === false;">
            <th colspan="2" style="font-size: 18px; width: 50px; text-align: end" v-if="groups.subgroups.length > 0 && groups.view_subgroups === false">↓</th>
            <th colspan="2" style="font-size: 18px; width: 50px; text-align: end"  v-else-if="groups.subgroups.length > 0 && groups.view_subgroups === true">✕</th>
            <th colspan="2" v-else></th>
            <th>{{groups.name}}</th>
            <th></th>

            <th v-if="groups.active === 1">
              <i class="d-flex justify-content-center active-icon">✔</i>
            </th>
            <th v-if="groups.active === 0">
              <i class="d-flex justify-content-center none-active-icon">✘</i>
            </th>

            <th>
              <div class="d-flex justify-content-center align-items-center р-25">
                <img src="@/assets/icons/edit.png" width="25"  @click="editGr(groups)"/>
                <img class="ml-2" src="@/assets/icons/delete.png" width="25"  @click="deleteGr(groups)"/>
              </div>
            </th>
          </tr>
          <tr class="white-tr" v-for="subgroups in groups.subgroups" v-if="groups.subgroups.length > 0 && groups.view_subgroups === true">
            <th colspan="3"></th>
            <th>{{subgroups.name}}</th>
            <th colspan="2"></th>
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

      await axios.get('http://back.ey/api/v1/catalogs', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.catalogs = response.data
      ))

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
          document.getElementById('group-message').innerHTML  = exception.response.data.msg
          setTimeout(() => {
            document.getElementById('group-message').innerHTML  = ''
          }, 3000);
          return;
        }
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
tbody:nth-child(odd){
  background-color:  rgba(0, 0, 0, 0);
}
</style>