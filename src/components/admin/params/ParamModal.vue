<template>

  <div id="myModal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" @click="eventHide">
    <div class="modal-dialog modal-lg">
      <div class="modal-content card bg-light mb-3">
        <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
        <div class="card bg-light p-mod" v-else>
          <label class="h5">Каталог</label>
            <select class="form-control form-control-sm" v-model="object.catalog_id" @change="object.group_parent_id = null; object.group_child_id = null">
              <option v-for="item in catalogs" :value="item.id">{{item.name}}</option>
            </select>
              <label class="h5 mt-2">Группа</label>
              <select class="form-control form-control-sm" v-model="object.group_parent_id" @change="object.group_child_id = null">
                <option v-if="object.catalog_id === null" :value="null">Сперва выберите каталог</option>
                <template v-for="item in groupsParent">
                  <option v-if="item.catalog_id === object.catalog_id" :value="item.id">{{ item.name}}</option>
                </template>
              </select>
              <label class="h5 mt-2">Подгруппа</label>
            <select class="form-control form-control-sm" v-model="object.group_child_id">
              <template v-for="item in groupsChild">
                <option v-if="item.parent_id === object.group_parent_id" :value="item.id">{{ item.name}}</option>
              </template>
            </select>
            <label class="h5 mt-2">Заголовок параметров</label>
            <input class="form-control form-control-sm px-3  p-2" v-model="object.name">

            <div class="d-flex justify-content-between h5 mt-2">
              <label class="mt-2">Параметры</label>
              <button class="btn btn-outline-primary w-25 btn-sm" @click="addParam">+</button>
            </div>
            <div class="d-flex justify-content-center mt-3" v-for="(param, index) in object.params">
              <input class="form-control form-control-sm px-3  p-2 w-50" v-model="param.name" style="flex: 0 1 70%;">
              <div class="d-flex justify-content-start ml-4">
                <img class="delete-icon" src="@/assets/icons/delete.png" width="25"  @click="deleteParam(index)"/>
              </div>
            </div>

            <div class="d-flex justify-content-center mt-3">
              <button class="btn btn-secondary btn-sm w-25 " @click="closeModal">Отмена</button>
              <button class="btn btn-primary btn-sm w-25 ml-5" @click="save">Сохранить</button>
            </div>
            <span id="modal-message"></span>
          </div>
      </div>
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
      object: null,
      readySave: true,
      modal: true,
      deleteParamsArray: []
    }
  },
  watch: {
    modal: function () {
      this.closeModal()
    }
  },
  methods: {
    eventHide(){
      $('#myModal').on('hide.bs.modal',( function (e) {
        this.modal = false
      }).bind(this))
    },
    closeModal(changed = false) {
      $('#myModal').modal('hide')
      this.$emit('updateParent', {
        changed: changed
      })
    },
    addParam() {
      this.object.params[this.object.params.length] = {id: null, name: '', title_id: this.object.id}
    },
    deleteParam(index) {
      if (confirm(`Вы действителдьно хотите удалить параметр "` + this.object.params[index].name ?? '' + '"')) {
        if (this.object.params[index].id !== null) {
          this.deleteParamsArray[this.deleteParamsArray.length] = this.object.params[index].id;
        }
        this.object.params.splice(index, 1);
      }
    },
    errorMessage(msg = 'Необходимо все поля'){
      document.getElementById('modal-message').innerHTML  = msg
      setTimeout(() => {
        document.getElementById('modal-message').innerHTML  = ''
      }, 2000);
    },
    async save() {
      this.readySave = true

      if (this.object.name.replace(/\s/g, "") === '') {
        this.errorMessage()
        this.readySave = false
      }

      this.object.params.forEach((function(eachEle) {
        if (eachEle.name.replace(/\s/g, "") === '') {
          this.errorMessage()
          this.readySave = false
        }
      }).bind(this))

      if (!this.readySave)
        return

      try {
        let title_id = null
        await axios.post(`http://back.ey/api/v1/params-title/${this.object.id}`, {
          token: localStorage.access_token,
          params: {
            name: this.object.name,
            catalog_id: this.object.catalog_id,
            group_parent_id: this.object.group_parent_id,
            group_child_id: this.object.group_child_id,
          }
        }).then(response => (
            title_id = response.data.title_id
        ))

        this.object.params.forEach(function(param) {
          if (param.title_id === '') {
            param.title_id = title_id
          }
        });

        await axios.post(`http://back.ey/api/v1/params`, {
          token: localStorage.access_token,
          params: this.object.params,
          delete: this.deleteParamsArray
        })
      } catch (exception) {
        this.errorMessage(exception.response.data.msg ?? 'Ошибка при сохранении')
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
    $('#myModal').modal('show')
    this.loading = true
    this.object = JSON.parse(JSON.stringify(this.objectParent));
    await this.getCatalogs();
    await this.getGroupsParent();
    await this.getGroupsChild();
    this.loading = false
  }
}
</script>

<style scoped>
</style>