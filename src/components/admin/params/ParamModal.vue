<template>

  <div class="modal fade" id="paramModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
      <div class="modal-content" v-else>
        <div class="modal-header">
          <h1 v-if="object.id === ''" class="modal-title fs-5">Создание параметров</h1>
          <h1 v-else class="modal-title fs-5">Редактирование параметров</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <label>Каталог</label>
          <select class="form-control form-control-sm" v-model="select.catalog_ind" @change="select.group_ind = null">
            <option v-for="(item, index) in catalogs" :value="index">{{item.name}}</option>
          </select>
          <label class="mt-2">Группа</label>
          <select class="form-control form-control-sm" v-model="select.group_ind">
            <option v-if="select.catalog_ind === null" :value="null">Сперва выберите каталог</option>
            <option v-else v-for="(item, index) in catalogs[select.catalog_ind].groups" :value="index">{{ item.name}}</option>
          </select>
          <label class="mt-2">Заголовок параметров</label>
          <input class="form-control form-control-sm px-3  p-2" v-model="object.name">

          <div class="d-flex justify-content-between mt-2 mb-3">
            <label class="">Параметры</label>
            <button class="btn btn-outline-primary w-25 btn-sm" @click="addParam">+</button>
          </div>
          <div class="d-flex justify-content-center mt-1" v-for="(param, index) in paramsRow">
            <input class="form-control form-control-sm px-3 p-2 w-50" v-model="paramsRow[index].name">
            <div class="d-flex justify-content-start ms-4 py-1">
              <img class="delete-icon" src="@/assets/icons/delete.png" width="25"  @click="deleteParam(index)"/>
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
      paramsRow: [],
      select: {
        catalog_ind: null,
        group_ind: null,
      }
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
      this.paramsRow[this.paramsRow.length] = {name: ''}
    },
    deleteParam(index) {
      if (confirm(`Вы действителдьно хотите удалить параметр "` + (this.paramsRow[index].name ?? '') + '"')) {
        if (this.paramsRow[index].id !== null) {
          this.deleteArray[this.deleteArray.length] = this.paramsRow[index].id;
        }
        this.paramsRow.splice(index, 1);
      }
    },
    async save() {
      // console.log(this.paramsRow)
      this.readySave = true

      if (this.object.catalog_id === null) {
        func.toastElList('Необходимо выбрать категорию');
        return;
      }

      if (this.object.group_id === null) {
        func.toastElList('Необходимо выбрать группу');
        return;
      }

      if (this.object.name.replace(/\s/g, "") === '') {
        func.toastElList('Необходимо заполнить заголовок');
        this.readySave = false
      }

      this.paramsRow.forEach((function(eachEle) {
        if (eachEle.name.replace(/\s/g, "") === '') {
          func.toastElList('Необходимо все поля');
          this.readySave = false
        }
      }).bind(this))

      if (!this.readySave)
        return

      // try {
      //   let title_id = null
      //   await axios.post(`http://back.ey/api/v1/params-title/${this.object.id}`, {
      //     token: localStorage.access_token,
      //     params: {
      //       name: this.object.name,
      //       catalog_id: this.object.catalog_id,
      //       group_id: this.object.group_id,
      //     }
      //   }).then(response => (
      //       title_id = response.data.title_id
      //   ))
      //
      //   this.object.params.forEach(function(param) {
      //     if (param.title_id === '') {
      //       param.title_id = title_id
      //     }
      //   });
      //
      //   await axios.post(`http://back.ey/api/v1/params`, {
      //     token: localStorage.access_token,
      //     params: this.object.params,
      //     delete: this.deleteArray
      //   })
      // } catch (exception) {
      //   func.toastElList(exception.response.data.msg ?? 'Ошибка при сохранении');
      //   return;
      // }
      //
      // this.closeModal(true)
    },
    async getCatalogs() {
      await axios.get('http://back.ey/api/v1/catalogs/for-params', {
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