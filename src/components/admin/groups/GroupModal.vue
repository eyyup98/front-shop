<template>

  <div class="modal">
    <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
      <div class="window" v-on:keyup.enter="save" v-on:keyup.esc="closeModal" v-else>
        <label>Каталог</label>
        <select v-model="group.catalog_id">
            <option v-for="item in catalogs" :value="item.id">{{item.name}}</option>
        </select>
        <label>Название группы</label>
        <input v-model="group.name">
        <label>Активный</label>
        <input type="checkbox" :checked="group.active" @click="active">
        <label>Подгруппы</label>
        <div v-for="(param, index) in group.subgroups" style="display: flex; flex-wrap:wrap; justify-content: space-between; margin: 5px 0">
          <input v-model="param.name" style="flex: 0 1 70%;">
          <button @click="deleteParam(index)" style="flex: 0 1 20%;">d</button>
        </div>

        <button @click="addParam">+</button>
        <button class="button" @click="closeModal">Отмена</button>
        <button class="button" @click="save">Сохранить</button>
        <span id="modal-message"></span>
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
    }
  },
  methods: {
    closeModal() {
      this.$emit('updateParent', {
        changed: false,
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
      if (confirm(`Вы действителдьно хотите удалить параметр "` + this.group.subgroups[index].name ?? '' + '"')) {
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

      this.$emit('updateParent', {
        changed: true
      })
    }
  },
  async mounted() {
    this.group = JSON.parse(JSON.stringify(this.object));
    await this.getCatalogs();
    this.loading = false
  }
}
</script>

<style scoped>
</style>