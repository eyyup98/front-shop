<template>
  <ProductModal v-if="this.modal === true" @updateParent="updateParentMethod" :objectParent="modalProduct">
  </ProductModal>
  <div class="container-list">
    <h1 class="h1">Товары</h1>
    <div class="d-flex justify-content-center w-25 m-auto my-3">
      <button class="btn btn-outline-dark w-75" @click="addProduct">Добавить товар</button>
    </div>

    <div class="loading" v-if="loading === true">Загрузка данных...</div>
    <div class="" v-else>

      <div class="d-flex justify-content-center">
        <div class="d-flex flex-column me-2 w-25">
          <h5 class="fw-semibold">Каталог</h5>
          <select class="form-select h-100 w-100" v-model="search.catalog_index" @change="search.group_index = null">
            <option :value="null" selected>Все</option>
            <option v-for="(item, index) in catalogs" :value="index">{{item.name}}</option>
          </select>
        </div>
        <div class="d-flex flex-column me-2 w-25">
          <h5 class="fw-semibold">Группа</h5>
          <select class="form-select h-100 w-100" v-model="search.group_index">
            <option :value="null" selected>Все</option>
            <option v-if="search.catalog_index !== null" v-for="(item, index) in catalogs[search.catalog_index].groups"
                    :value="index">{{item.name}}</option>
          </select>
        </div>
        <div class="d-flex align-items-end">
          <button type="button" class="btn btn-secondary w-100" @click="getData">Найти</button>
        </div>
      </div>

      <div class="d-flex flex-wrap">
        <div class="product-block my-3 d-flex flex-column p-2 m-auto" v-for="row in products" @click="editProduct(row)">
          <div>
            <div v-if="row.img" class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl+row.img + ')' }"></div>
            <div v-else class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
          </div>
          <div class="px-2">
            <div class="d-flex justify-content-between pb-0 mb-0">
              <span class="h4">{{row.price}}</span>
              <span class="text-decoration-line-through" v-if="Number(row.discount) !== 0">{{row.discount}}</span>
            </div>
            <h6 class="d-inline-block text-truncate mt-0 pt-0 w-100">{{row.name}}</h6>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductModal from "./ProductModal.vue";
import axios from "axios";

export default {
  name: "Products",
  components: {
    ProductModal
  },
  data() {
    return {
      loading: true,
      products: null,
      catalogs: null,
      search: {
        catalog_index: null,
        group_index: null
      },
      modalProduct: null,
      modal: null,
      baseUrl: 'http://back-img.ey'
    }
  },
  methods: {
    addProduct(){
      this.modalProduct = this.newProduct()
      this.modal = true
    },
    editProduct(object){
      this.modalProduct = {id: object.id}
      this.modal = true
    },
    async getData() {
      this.loading = true

      let catalog_id = null;
      let group_id = null;

      try {
          catalog_id = this.catalogs[this.search.catalog_index].id;
          group_id = this.catalogs[this.search.catalog_index].groups[this.search.group_index].id;
      } catch (exception) {}

        await axios.get('http://back.ey/api/v1/products', {
          params: {
            token: localStorage.access_token,
            catalog_id: catalog_id,
            group_id: group_id
          }
        }).then(response => (
            this.products = response.data
        ))

      this.loading = false
    },
    async updateParentMethod(data) {
      this.modal = false

      if (data.changed === true) {
        this.loading = true
        await this.getData()
      }
    },
    async getCatalogs() {
      this.loading = true
      try {
        await axios.get('http://back.ey/api/v1/catalogs/for-groups', {
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
    newProduct() {
      return {
        id: '',
        name: '',
        price: 0,
        discount: 0,
        active: true,
        img: []
      }
    }
  },
  async mounted() {
    await this.getCatalogs();
    await this.getData()
  }
}
</script>

<style scoped>
.img{
  width: 100%;
  height: 40vh;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 3%;
  /*border: 3px saddlebrown solid;*/
}
.product-block {
  display: flex;
  flex-direction:column;
  /*flex: 0 1 25%;*/
  width: 280px;
  padding: 10px;
  border-radius: 3%;
}
.product-block:hover{
  transform: scale(1.1, 1.1);
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  border-radius: 3%;
}
.container-list{
  padding: 10px;
  display: flex;
  flex-direction:column;
  /*background-color: rgba(0, 0, 0, 0.01);*/
}
</style>