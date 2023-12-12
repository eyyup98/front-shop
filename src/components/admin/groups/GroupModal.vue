<template>

  <div class="modal fade" id="groupModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
      <div class="modal-content" v-else>
        <div class="modal-header">
          <h1 v-if="object.catalog_id === null" class="modal-title fs-5">Создание группы</h1>
          <h1 v-else class="modal-title fs-5">Редактирование группы</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <label class="">Каталог</label>
          <select class="form-control form-control-sm" v-model="object.catalog_id">
            <option v-for="item in catalogs" :value="item.id">{{item.name}}</option>
          </select>
          <div class="d-flex justify-content-between mt-2 mb-3">
            <label>Группы</label>
            <button class="btn btn-outline-primary w-25 btn-sm" @click="addGroup">+</button>
          </div>
          <div class="d-flex justify-content-center mt-1" v-for="(groups, index) in object.groups">
            <input class="form-control form-control-sm px-3 p-2 w-50" v-model="object.groups[index].name">
            <div class="d-flex justify-content-start ms-4 py-1">
              <img class="delete-icon" src="@/assets/icons/delete-img.png" width="30" height="30"  @click="deleteGroup(index)"/>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Отмена</button>
          <button type="button" class="btn btn-primary" @click="save">Сохранить</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import func from "../../../js/functions"

export default {
  name: "GroupModal",
  props: {
    objectParen: {
      required: true
    },
  },
  data(){
    return {
      catalogs: null,
      object: null,
      loading: true,
      deleteArray: [],
      modalObject: null,
      readySave: true
    }
  },
  methods: {
    closeModal(changed = false) {
      this.modalObject.hide();
      this.$emit('updateParent', {
        changed: changed
      })
    },
    addGroup() {
      this.object.groups[this.object.groups.length] = {id: null, name: '', active: true}
    },
    deleteGroup(index) {
      if (confirm(`Вы действителдьно хотите удалить параметр "` + (this.object.groups[index].name ?? '') + '"')) {
        if (this.object.groups[index].id !== null) {
          this.deleteArray[this.deleteArray.length] = this.object.groups[index].id;
        }
        this.object.groups.splice(index, 1);
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
    async save() {
      console.log(this.object)
      if (this.object.catalog_id === null) {
        func.toastElList('Необходимо выбрать категорию');
        return;
      }

      this.readySave = true

      this.object.groups.forEach((function(eachEle) {
        if (eachEle.name.replace(/\s/g, "") === '') {
          func.toastElList('Необходимо все поля');
          this.readySave = false
        }
      }).bind(this))

      if (!this.readySave)
        return;

      try {
        await axios.post(`http://back.ey/api/v1/groups`, {
          token: localStorage.access_token,
          params: this.object,
          delete: this.deleteArray
        })
      } catch (exception) {
        func.toastElList(exception.response.data.msg ?? 'Ошибка при сохранении');
        return;
      }

      this.closeModal(true)
    }
  },
  async mounted() {
    this.modalObject = new bootstrap.Modal(document.getElementById('groupModal'), {});
    this.modalObject.show()
    this.object = JSON.parse(JSON.stringify(this.objectParen));
    await this.getCatalogs();
    this.loading = false
  }
}
</script>

<style scoped>
</style>