<template>
  <div class="modal fade" id="catModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
      <div class="modal-content" v-else>
        <div class="modal-header">
          <h1 v-if="catalog.id === ''" class="modal-title fs-5">Создание каталога</h1>
          <h1 v-else class="modal-title fs-5">Редактирование каталога</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <label>Название каталога</label>
          <input class="form-control p-3" type="text" v-model="catalog.name" v-on:keyup.enter="save" v-on:keyup.esc="closeModal">

          <div class="form-check form-check-inline mt-2">
            <input class="form-check-input" type="checkbox" name="catalog-active" :checked="catalog.active" @click="active">
            <label class="form-check-label">Активный</label>
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
  name: "CatModal",
  props: {
    object: {
      required: false
    }
  },
  data(){
    return {
      loading: true,
      modal: true,
      modalObject: null,
      catalog: null,
      message: null
    }
  },
  methods: {
    closeModal(changed = false) {
      this.modalObject.hide();
      this.$emit('updateParent', {
        changed: changed
      })
    },
    active(){
      if (this.catalog.active === 1) {
        this.catalog.active = 0
      } else if (this.catalog.active === 0) {
        this.catalog.active = 1
      }
    },
    async save() {
      if (this.catalog.name.replace(/\s/g, "") === '') {
        func.toastElList('Необходимо заполнить название');
        return;
      }

      try {
        await axios.post(`http://back.ey/api/v1/catalogs/${this.catalog.id}`, {
          token: localStorage.access_token,
          params: {
            name: this.catalog.name,
            active: this.catalog.active,
          }
        })
      } catch (exception) {
        func.toastElList(exception.response.data.msg);
        return;
      }

      this.closeModal(true)
    }
  },
  async mounted() {
    this.catalog = JSON.parse(JSON.stringify(this.object));
    this.modalObject = new bootstrap.Modal(document.getElementById('catModal'), {});
    this.modalObject.show()
    this.loading = false
  }
}
</script>
