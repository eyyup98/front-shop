<template>

  <div class="modal fade" id="paramModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
      <div class="modal-content" v-else>
        <div class="modal-header">
          <h1 v-if="object.catalog_id === null" class="modal-title fs-5">Создание параметров</h1>
          <h1 v-else class="modal-title fs-5">Редактирование параметров</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body d-flex flex-column">
          <label>Каталог</label>
          <select class="form-control form-control-sm" v-model="object.catalog_id" :disabled="objectParent.catalog_id !== null" @change="object.group_id = null">
            <option v-for="item in catalogs" :value="item.catalog_id">{{item.name}}</option>
          </select>
          <label class="mt-2">Группа</label>
          <select class="form-control form-control-sm" v-model="object.group_id" :disabled="objectParent.catalog_id !== null">
            <option v-if="object.catalog_id === null" :value="null">Сперва выберите каталог</option>
            <template v-else v-for="catalog in catalogs">
              <option v-if="object.catalog_id === catalog.catalog_id" v-for="item in catalog.groups" :value="item.id">{{item.name}}</option>
            </template>
          </select>

          <div class="d-flex justify-content-between mt-2 mb-3">
            <label>Параметры</label>
            <div class="d-flex justify-content-end w-25">
              <button class="btn btn-success w-50 btn-sm" @click="addParam">+</button>
            </div>
          </div>
          <div class="d-flex justify-content-center mt-1" v-for="(param, index) in object.params">
            <input class="form-control form-control-sm px-3 p-2 w-50" v-model="param.name">
            <div class="d-flex justify-content-start ms-4 py-1">
              <img class="shadow-icon" src="@/assets/icons/delete-img.png" width="30" height="30"  @click="deleteParam(index)"/>
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
  name: "ParamModal",
  props: {
    objectParent: {
      required: true
    }
  },
  data(){
    return {
      groups: null,
      catalogs: null,
      loading: true,
      object: null,
      readySave: true,
      modalObject: null,
      deleteArray: [],
    }
  },
  methods: {
    closeModal(changed = false) {
      this.modalObject.hide();
      this.$emit('updateParent', {
        changed: changed
      })
    },
    addParam() {
      this.object.params[this.object.params.length] = {name: ''}
    },
    deleteParam(index) {
      if (confirm(`Вы действителдьно хотите удалить параметр "` + (this.object.params[index].name ?? '') + '"')) {
        if (this.object.params[index].id !== null) {
          this.deleteArray[this.deleteArray.length] = this.object.params[index].id;
        }
        this.object.params.splice(index, 1);
      }
    },
    async save() {
      this.readySave = true

      if (this.object.catalog_id === null) {
        func.toastElList('Необходимо выбрать категорию');
        return;
      }

      if (this.object.group_id === null) {
        func.toastElList('Необходимо выбрать группу');
        return;
      }

      this.object.params.forEach((function(eachEle) {
        if (eachEle.name.replace(/\s/g, "") === '') {
          func.toastElList('Необходимо заполнить все поля');
          this.readySave = false
        }
      }).bind(this))

      if (!this.readySave)
        return

      try {
        await axios.post(`http://back.ey/api/v1/params`, {
          token: localStorage.access_token,
          catalog_id: this.objectParent.catalog_id ?? this.object.catalog_id,
          group_id: this.objectParent.group_id ?? this.object.group_id,
          params: this.object.params,
          delete: this.deleteArray
        })
      } catch (exception) {
        func.toastElList(exception.response.data.msg ?? 'Ошибка при сохранении');
        return;
      }

      this.closeModal(true)
    },
    async getCatalogs() {
      await axios.get('http://back.ey/api/v1/catalogs/for-groups', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.catalogs = response.data
      ))
    },
  },
  async mounted() {
    this.modalObject = new bootstrap.Modal(document.getElementById('paramModal'), {});
    this.modalObject.show()
    this.object = JSON.parse(JSON.stringify(this.objectParent));
    await this.getCatalogs();
    this.loading = false
  }
}
</script>

<style scoped>
</style>