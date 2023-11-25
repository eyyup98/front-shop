<template class="template">
<!--  <NavBar></NavBar>-->

  <GroupModal v-if="modal === true" @updateParent="updateParentMethod" :object="modalGroup">
  </GroupModal>

  <div class="container">
    <h1 class="h1 m">Группы</h1>

    <button class="button" @click="addGroup">Добавить</button>

    <div class="loading" v-if="loading === true">Загрузка данных...</div>
    <table class="table" v-if="loading === false">
      <thead class="thead">
      <tr>
        <th>#</th>
        <th>Каталог</th>
        <th>Группа</th>
        <th>Активный</th>
        <th class="th-events">Действия</th>
      </tr>
      </thead>

      <tbody class="" v-for="(row, index) in groups">
      <tr>
        <th style="font-size: 20px; width: 50px" v-if="row.subgroups.length !== 0 && row.view_child === false" @click="changeViewChild(index)">V</th>
        <th style="font-size: 20px; width: 50px"  v-else-if="row.subgroups.length !== 0 && row.view_child === true" @click="changeViewChild(index)">X</th>
        <th v-else></th>
        <th>{{ row.catalog_name }}</th>
        <th>{{ row.name }}</th>
        <th>{{ row.active }}</th>
        <th>
          <i class="delete" @click="deleteGr(row)">d</i>
          <i class="edit" @click="editGr(row)">e</i>
        </th>
      </tr>

      <tr v-if="row.view_child === true && row.subgroups.length !== 0">
        <th colspan="5">Подгруппы</th>
      </tr>
      <tr class="child-list" v-if="row.view_child === true" v-for="(row2) in row.subgroups">
        <th colspan="5">{{ row2.name }}</th>
      </tr>
      </tbody>
    </table>
    <span id="group-message"></span>
  </div>
</template>

<script>
// import NavBar from "../NavBar.vue";
import axios from "axios";
import GroupModal from "./GroupModal.vue";

export default {
  name: "Groups",
  components: {
    // NavBar,
    GroupModal
  },
  data() {
    return {
      loading: false,
      groups: null,
      groupType: null,
      modal: false,
      modalGroup: null,
      arrayChild: [],
    }
  },
  methods: {
    async getData() {
      // this.loading = true

      await axios.get('http://back.ey/api/v1/groups/parents', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.groups = response.data
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
    async deleteGr(object, type) {
      type = type === 'parent' ? 'группу' : 'подгруппу'
      if (confirm(`Вы действителдьно хотите удалить ${type} "` + object.name + '"')) {
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
    changeViewChild(index){
      if (this.groups[index].view_child === false) {
        this.groups[index].view_child = true;
        this.arrayChild[index] = this.groups[index]
      }
      else {
        this.groups[index].view_child = false;
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