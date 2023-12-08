<template>

  <div id="myModal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" @click="eventHide">
    <div class="modal-dialog modal-lg">
      <div class="modal-content card bg-light mb-3">
        <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
        <div class="card bg-light p-mod" v-else>
          <label class="">Каталог</label>
          <select class="form-control form-control-sm" v-model="group.catalog_id">
              <option v-for="item in catalogs" :value="item.id">{{item.name}}</option>
          </select>
          <label class="mt-2">Название группы</label>
          <input class="form-control form-control-sm px-3  p-2 w-50" v-model="group.name">
          <div class="form-check form-check-inline mt-2">
            <input class="form-check-input" type="checkbox" name="catalog-active" :checked="group.active" @click="active">
            <label class="form-check-label">Активный</label>
          </div>

          <div class="d-flex justify-content-between mt-2">
            <label class="mt-2">Подгруппы</label>
            <button class="btn btn-outline-primary w-25 btn-sm" @click="addParam">+</button>
          </div>
          <div class="d-flex justify-content-center mt-3" v-for="(param, index) in group.subgroups">
            <input class="form-control form-control-sm px-3  p-2 w-50" v-model="param.name" style="flex: 0 1 70%;">
            <div class="d-flex justify-content-start ms-4">
              <img class="delete-icon" src="@/assets/icons/delete.png" width="25"  @click="deleteParam(index)"/>
            </div>
          </div>

          <div class="d-flex justify-content-center mt-3">
            <button class="btn btn-secondary btn-sm w-25 " @click="closeModal">Отмена</button>
            <button class="btn btn-primary btn-sm w-25 ms-5" @click="save">Сохранить</button>
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
  name: "GroupModal",
  props: {
    object: {
      required: true
    },
  },
  data(){
    return {
      catalogs: null,
      group: null,
      loading: true,
      deleteArray: [],
      readySave: true,
      modal: true,
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
    active(){
      if (this.group.active === 1) {
        this.group.active = 0
      } else if (this.group.active === 0) {
        this.group.active = 1
      }
    },
    addParam() {
      this.group.subgroups[this.group.subgroups.length] = {name: ''}
    },
    deleteParam(index) {
      if (confirm(`Вы действителдьно хотите удалить параметр "` + (this.group.subgroups[index].name ?? '') + '"')) {
        if (this.group.subgroups[index].id !== null) {
          this.deleteArray[this.deleteArray.length] = this.group.subgroups[index].id;
        }
        this.group.subgroups.splice(index, 1);
      }
    },
    async getCatalogs() {
      this.loading = true
      try {
        await axios.get('http://back.ey/api/v1/catalogs', {
          params: {
            token: localStorage.access_token
          }
        }).then(response => (
            this.catalogs = response.data
        ))
        this.loading = false
      } catch (exception) {
      }
    },
    errorMessage(msg = ''){
      document.getElementById('modal-message').innerHTML  = msg
      setTimeout(() => {
        document.getElementById('modal-message').innerHTML  = ''
      }, 2000);
    },
    async save() {
      this.readySave = true

      if (this.group.catalog_id === null) {
        this.errorMessage('Необходимо выбрать категорию')
        return;
      }

      if (this.group.name.replace(/\s/g, "") === '') {
        this.errorMessage('Необходимо заполнить название группы')
        return;
      }

      this.group.subgroups.forEach((function(eachEle) {
        if (eachEle.name.replace(/\s/g, "") === '') {
          this.errorMessage('Название не должно быть пустым')
          this.readySave = false
        }
      }).bind(this))

      if (!this.readySave)
        return

      try {
        await axios.post(`http://back.ey/api/v1/groups/${this.group.id}`, {
          token: localStorage.access_token,
          params: this.group,
          delete: this.deleteArray
        })
      } catch (exception) {
        this.errorMessage(exception.response.data.msg ?? 'Ошибка при сохранении')
        return;
      }

      this.closeModal(true)
    }
  },
  async mounted() {
    $('#myModal').modal('show')
    this.group = JSON.parse(JSON.stringify(this.object));
    await this.getCatalogs();
    this.loading = false
  }
}
</script>

<style scoped>
</style>