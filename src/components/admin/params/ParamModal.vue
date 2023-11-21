<template>

  <div class="modal">
    <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
    <div class="window" v-on:keyup.enter="save" v-on:keyup.esc="closeModal" v-else>
      <label>Каталог</label>
        <select v-model="object.catalog_id">
          <option v-for="item in catalogs" :value="item.id">{{item.name}}</option>
        </select>
          <label>Группа</label>
          <select v-model="object.group_parent_id">
            <option v-if="object.catalog_id === null" :value="null">Сперва выберите каталог</option>
            <template v-for="item in groupsParent">
              <option v-if="item.catalog_id === object.catalog_id" :value="item.id">{{ item.name}}</option>
            </template>
          </select>
          <label>Подгруппа</label>
        <select v-model="object.group_child_id">
          <template v-for="item in groupsChild">
            <option v-if="item.parent_id === object.group_parent_id" :value="item.id">{{ item.name}}</option>
          </template>
        </select>
      <label>Заголовок параметров</label>
      <input v-model="object.name">
      <label>Параметры</label>
      <div v-for="(param, index) in object.params" style="display: flex; flex-wrap:wrap; justify-content: space-between; margin: 5px 0">
        <input v-model="param.name" style="flex: 0 1 70%;">
        <button @click="deleteParam(index)" style="flex: 0 1 20%;">d</button>
      </div>

<!--      </div>-->

        <button class="button" @click="closeModal">Отмена</button>
        <button class="button" @click="save">Сохранить</button>
        <span id="modal-message"></span>
      </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "ParamModal",
  props: {
    objectParent: {
      required: true
    }
  },
  data(){
    return {
      groupsParent: null,
      groupsChild: null,
      catalogs: null,
      loading: true,
      object: null
    }
  },
  methods: {
    closeModal() {
      this.$emit('updateParent', {
        changed: false,
      })
    },
    deleteParam(index) {
      if (confirm(`Вы действителдьно хотите удалить параметр "` + this.object.params[index].name + '"')) {

      }
    },
    async save() {
      // console.log(this.object)
      // return
      this.object.params.forEach(function(eachEle, index, array) {
        if (eachEle.name.replace(/\s/g, "") === '') {
          document.getElementById('modal-message').innerHTML  = 'Необходимо все поля'
          setTimeout(() => {
            document.getElementById('modal-message').innerHTML  = ''
          }, 2000);
          return;
        }
      })
      // console.log(this.object.params)
      // return
      // if (this.group.catalog_id === null) {
      //   document.getElementById('modal-message').innerHTML  = 'Необходимо выбрать категорию'
      //   setTimeout(() => {
      //     document.getElementById('modal-message').innerHTML  = ''
      //   }, 2000);
      //   return;
      // }
      //
      // if (this.groupType === 'child' && this.group.parent_id === null) {
      //   document.getElementById('modal-message').innerHTML  = 'Необходимо выбрать группу'
      //   setTimeout(() => {
      //     document.getElementById('modal-message').innerHTML  = ''
      //   }, 2000);
      //   return;
      // }
      //
      // if (this.group.name.replace(/\s/g, "") === '') {
      //   document.getElementById('modal-message').innerHTML  = 'Необходимо заполнить название'
      //   setTimeout(() => {
      //     document.getElementById('modal-message').innerHTML  = ''
      //   }, 2000);
      //   return;
      // }

      try {
        await axios.post(`http://back.ey/api/v1/params-title/${this.object.id}`, {
          token: localStorage.access_token,
          params: {
            name: this.object.name,
            catalog_id: this.object.catalog_id,
            group_parent_id: this.object.group_parent_id,
            group_child_id: this.object.group_child_id,
          }
        })
      } catch (exception) {
        document.getElementById('modal-message').innerHTML  = exception.response.data.msg
        setTimeout(() => {
          document.getElementById('modal-message').innerHTML  = ''
        }, 2000);
        return;
      }

      this.$emit('updateParent', {
        changed: true
      })
    },
    async getCatalogs() {
      await axios.get('http://back.ey/api/v1/catalogs', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.catalogs = response.data
      ))
    },
    async getGroupsParent() {
      await axios.get('http://back.ey/api/v1/groups/parents', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
            this.groupsParent = response.data
      ))
    },
    async getGroupsChild() {
      await axios.get('http://back.ey/api/v1/groups/childs', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
            this.groupsChild = response.data
      ))
    },
  },
  async mounted() {
    this.loading = true
    this.object = JSON.parse(JSON.stringify(this.objectParent));
    await this.getCatalogs();
    await this.getGroupsParent();
    await this.getGroupsChild();
    this.loading = false
    // console.log(this.object)
  }
}
</script>

<style scoped>
</style>