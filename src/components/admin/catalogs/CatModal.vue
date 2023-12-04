<template>

  <div id="myModal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" @click="eventHide">
      <div class="modal-dialog modal-lg">
        <div class="modal-content card bg-light mb-3">
          <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
          <div class="card bg-light p-mod" v-else>
            <label>Название каталога</label>
            <input class="form-control form-control-bg px-3 p-2 h-25" type="text" v-model="catalog.name" v-on:keyup.enter="save" v-on:keyup.esc="closeModal">

            <div class="form-check form-check-inline mt-2">
              <input class="form-check-input" type="checkbox" name="catalog-active" :checked="catalog.active" @click="active">
              <label class="form-check-label">Активный</label>
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
  name: "CatModal",
  components: {
    catalog: null
  },
  props: {
    catalog: {
      required: false
    }
  },
  data(){
    return {
      response: null,
      loading: false,
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
      if (this.catalog.active === 1) {
        this.catalog.active = 0
      } else if (this.catalog.active === 0) {
        this.catalog.active = 1
      }
    },
    async save() {
      if (this.catalog.name.replace(/\s/g, "") === '') {
        document.getElementById('modal-message').innerHTML  = 'Необходимо заполнить название'
        setTimeout(() => {
          document.getElementById('modal-message').innerHTML  = ''
        }, 2000);
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
        this.response = exception.response.data
        document.getElementById('modal-message').innerHTML  = exception.response.data.msg
        setTimeout(() => {
          document.getElementById('modal-message').innerHTML  = ''
        }, 2000);
        return;
      }

      this.closeModal(true)
    }
  },
  async mounted() {
    $('#myModal').modal('show')
  }
}
</script>

<style scoped>
</style>