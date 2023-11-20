<template>

  <div class="modal">
      <div class="window">
        <label>Каталог</label>
<!--        <div class="loading" v-if="loading === true">Загрузка данных...</div>-->
        <select v-model="group.catalog_id">
          <option v-for="item in catalogs" :value="item.id">{{item.name}}</option>
        </select>
        <div v-if="groupType === 'parent'">
          <label>Название группы</label>
          <input v-model="group.name">
        </div>
        <div v-else>
          <label>Группа</label>
          <select v-model="group.parent_id">
            <option v-for="item in groupsParent" :value="item.id">{{item.name}}</option>
          </select>
          <input v-model="group.name">
        </div>
        <label>Активный</label>
        <p>
        <input type="checkbox" name="catalog-active" :checked="group.active" @click="active">
        </p>
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
  components: {
    group: null
  },
  props: {
    group: {
      required: false
    },
    groupsParent: {
      required: false
    },
    groupType: {
      required: true
    }
  },
  data(){
    return {
      catalogs: null,
      loading: true,
    }
  },
  methods: {
    closeModal() {
      this.$emit('updateParent', {
        changed: false,
      })
    },
    active(){
      if (this.catalog.active === 1) {
        this.catalog.active = 0
      } else if (this.catalog.active === 0) {
        this.catalog.active = 1
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
      console.log(this.group)

      if (this.group.name.replace(/\s/g, "") === '') {
        document.getElementById('modal-message').innerHTML  = 'Необходимо заполнить название'
        setTimeout(() => {
          document.getElementById('modal-message').innerHTML  = ''
        }, 2000);
        return;
      }

      try {
        await axios.post(`http://back.ey/api/v1/groups/${this.group.id}`, {
          token: localStorage.access_token,
          params: {
            catalog_id: this.group.catalog_id,
            parent_id: this.group.parent_id,
            name: this.group.name,
            active: this.group.active,
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
    }
  },
  async mounted() {
    this.loading = true
    await this.getCatalogs();
  }
}
</script>

<style scoped>
</style>