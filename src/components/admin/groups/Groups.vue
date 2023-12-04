<template class="template">
  <GroupModal v-if="modal === true" @updateParent="updateParentMethod" :object="modalGroup">
  </GroupModal>

  <div class="container-block">
    <div class="d-flex flex-column">
      <h1 class="h1 m">Группы</h1>
      <button class="btn btn-outline-primary w-25 my-3 mx-auto" @click="addGroup">Добавить</button>

      <div class="form-control loading" v-if="loading === true">Загрузка данных...</div>

      <table class="table table-bordered table-hover" v-if="loading === false">
        <thead class="thead-dark">
        <tr>
          <th width="10%">#</th>
          <th width="25%">Каталог</th>
          <th width="25%">Группа</th>
          <th>Подгруппа</th>
          <th width="10%">Активный</th>
          <th class="th-events">Действия</th>
        </tr>
        </thead>

        <tbody class="select-none-click" v-for="(row, index) in catalogs">
        <tr class="table-light">
          <th style="font-size: 20px; width: 50px" v-if="row.groups.length > 0 && row.view_groups === false"
              @click="row.view_groups = row.view_groups === false">↓</th>
          <th style="font-size: 20px; width: 50px"  v-else-if="row.groups.length > 0 && row.view_groups === true"
              @click="row.view_groups = row.view_groups === false">✕</th>
          <th v-else></th>
          <th>{{row.name}}</th>
          <th colspan="4"></th>
        </tr>
        <template v-for="groups in row.groups" v-if="row.groups.length > 0 && row.view_groups === true">
          <tr class="grey-tr">
            <th></th>
            <th style="font-size: 18px; width: 50px; text-align: end" v-if="groups.subgroups.length > 0 && groups.view_subgroups === false"
                @click="groups.view_subgroups = groups.view_subgroups === false;">↓</th>
            <th style="font-size: 18px; width: 50px; text-align: end"  v-else-if="groups.subgroups.length > 0 && groups.view_subgroups === true"
                @click="groups.view_subgroups = groups.view_subgroups === false">✕</th>
            <th v-else></th>
            <th>{{groups.name}}</th>
            <th></th>
            <th v-if="groups.active === 1" class="active-icon">✔</th>
            <th v-if="groups.active === 0" class="none-active-icon">✘</th>

            <div class="d-flex justify-content-center align-items-center р-25" style="border: 2px solid red">
              <img src="@/assets/icons/edit.png" width="25"  @click="editGr(index)"/>
              <img class="ml-2" src="@/assets/icons/delete.png" width="25"  @click="deleteGr(index)"/>
            </div>
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
      this.modal = true
      this.modalGroup = this.newGroup()
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