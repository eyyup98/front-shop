<template class="template">
  <NavBar></NavBar>

  <GroupModal v-if="modal === true" @updateParent="updateParentMethod" :group="modalGroup" :groupType="groupType"
              :groupsParent="groupsParent">
  </GroupModal>

  <div class="container">
    <h1 class="h1 m">Группы</h1>

    <button class="button" @click="addGroup('parent')">Добавить группу</button>
    <button class="button" @click="addGroup('child')">Добавить подгруппу</button>

    <div class="loading" v-if="loading === true">Загрузка данных...</div>
    <table class="table" v-if="loading === false">
      <thead class="thead">
      <tr>
        <th>#</th>
        <th>Каталог</th>
        <th>Группа</th>
        <th>Подгруппа</th>
        <th>Активный</th>
        <th class="th-events">Действия</th>
      </tr>
      </thead>

      <tbody class="" v-for="(row, index) in groupsParent">
      <tr>
<!--        <th>{{ groupsChild[row.id] }}</th>-->
        <th style="font-size: 20px; width: 50px" v-if="row.view_child === false && typeof groupsChild[row.id] !== 'undefined'" @click="changeViewChild(index)">V</th>
        <th style="font-size: 20px; width: 50px"  v-else-if="row.view_child === true && typeof groupsChild[row.id] !== 'undefined'" @click="changeViewChild(index)">X</th>
        <th v-else></th>
        <th>{{ row.catalog_name }}</th>
        <th>{{ row.name }}</th>
        <th></th>
        <th>{{ row.active }}</th>
        <th>
          <i class="delete" @click="deleteGr(row, 'parent')">d</i>
          <i class="edit" @click="editGr(row, 'parent')">e</i>
        </th>
      </tr>

      <tr class="child-list" v-if="row.view_child === true" v-for="(row2) in groupsChild[row.id]">
        <th></th>
        <th></th>
        <th></th>
        <th>{{ row2.name }}</th>
        <th>{{ row2.active }}</th>
        <th>
          <i class="delete" @click="deleteGr(row2, 'child', )">d</i>
          <i class="edit" @click="editGr(row2, 'child', )">e</i>
        </th>
      </tr>
      </tbody>
    </table>
    <span id="group-message"></span>
  </div>
</template>

<script>
import NavBar from "../NavBar.vue";
import axios from "axios";
import GroupModal from "./GroupModal.vue";

export default {
  name: "Groups",
  components: {
    NavBar,
    GroupModal
  },
  data() {
    return {
      loading: true,
      groupsParent: null,
      groupsChild: null,
      groupType: null,
      modal: false,
      modalGroup: null,
      arrayChild: [],
      newGroup: {
        id: '',
        catalog_id: null,
        parent_id: null,
        name: '',
        active: 1
      }
    }
  },
  methods: {
    async getData() {
      this.loading = true
      // try {
        await axios.get('http://back.ey/api/v1/groups/parents', {
          params: {
            token: localStorage.access_token
          }
        }).then(response => (
            this.groupsParent = response.data
        ))
        this.loading = false
      // } catch (exception) {}

      // try {
        await axios.get('http://back.ey/api/v1/groups/childs', {
          params: {
            token: localStorage.access_token
          }
        }).then(response => (
            this.groupsChild = response.data
        ))
        this.loading = false
      // } catch (exception) {}
    },
    async updateParentMethod(data) {
      this.modal = false

      if (data.changed === true) {
        this.loading = true
        await this.getData()
      }

      this.newGroup = {
        id: '',
        catalog_id: null,
        parent_id: null,
        name: '',
        active: 1
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
    editGr(object, type) {
      this.modal = true

      this.modalGroup = object
      this.groupType = type
    },
    addGroup(type) {
      this.modal = true
      this.modalGroup = this.newGroup
      this.groupType = type
    },
    changeViewChild(index){
      if (this.groupsParent[index].view_child === false) {
        this.groupsParent[index].view_child = true;
        this.arrayChild[index] = this.groupsParent[index]
      }
      else {
        this.groupsParent[index].view_child = false;
        delete this.arrayChild[index];
      }
    }
  },
  async mounted() {
    await this.getData()
  }
}
</script>

<style scoped>
.h1 {
  text-align: center;
}
.container {
  padding: 10px;
  background-color: rgba(119, 255, 133, 0.3);
  display: flex;
  flex-direction:column;
  margin: 5% auto 0;
}
</style>