<template>
  <ProductModal v-if="this.modal === true" @updateParent="updateParentMethod" :objectParent="modalProduct">
  </ProductModal>
  <div class="container-block">
    <div class="container-list">
      <h1 class="h1">Товары</h1>
      <div class="d-flex justify-content-center w-25 m-auto my-3">
        <button class="btn btn-outline-dark w-75" @click="addProduct">Добавить товар</button>
      </div>

      <div class="d-flex justify-content-center">
        <div class="d-flex flex-column me-2 w-25">
          <h5 class="fw-semibold">Каталог</h5>
          <select class="form-select h-100 w-100" v-model="search.catalog_index" @change="changeData(); search.group_index = null">
            <option :value="null" selected>Все</option>
            <option v-for="(item, index) in catalogs" :value="index">{{item.name}}</option>
          </select>
        </div>
        <div class="d-flex flex-column me-2 w-25">
          <h5 class="fw-semibold">Группа</h5>
          <select class="form-select h-100 w-100" v-model="search.group_index" @change="changeData">
            <option :value="null" selected>Все</option>
            <option v-if="search.catalog_index !== null" v-for="(item, index) in catalogs[search.catalog_index].groups"
                    :value="index">{{item.name}}</option>
          </select>
        </div>

        <div class="d-flex flex-column me-2 w-25">
          <h5 class="fw-semibold">Поиск товара</h5>
          <div class="w-100 h-100 d-flex flex-row">
            <div class="form-outline w-100 position-relative" data-mdb-input-init>
              <input type="search" class="form-control h-100" @input="searchMethod" @keyup.enter="getData" v-model="search.searchInput"/>
              <div class="w-100 position-absolute z-1">
                <div class="dropdown">
                  <ul class="dropdown-menu d-inline-block w-100" v-if="searchList.length > 0">
                    <li><a class="dropdown-item d-inline-block text-truncate" v-for="item in searchList" @click="checkProduct(item)">{{ item.name }}</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex align-items-end flex-row">
          <button type="button" class="btn btn-success ms-2" @click="getData">Найти</button>
          <button type="button" class="btn btn-secondary ms-2 text-nowrap" @click="clearSearch">Очистить фильтр</button>
        </div>
      </div>

      <div class="loading" v-if="loading === true">Загрузка данных...</div>
      <div class="" v-else>

        <div class="d-flex flex-wrap">
          <div class="product-block my-3 d-flex flex-column p-2 m-auto" v-for="row in products">
            <div @click="editProduct(row)">
              <div>
                <div v-if="row.img" class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl+row.img + ')' }"></div>
                <div v-else class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
              </div>
              <div class="px-2">
                <div class="d-flex justify-content-between pb-0 mb-0">
                  <span class="h4 fw-semibold alignment">{{new Intl.NumberFormat("ru-RU").format(row.price)}} <span class="h6 text-secondary">TMT</span></span>
                  <span class="text-decoration-line-through alignment text-secondary opacity-50" style="font-size: 16px" v-if="Number(row.discount) !== 0">
                    {{new Intl.NumberFormat("ru-RU").format(row.discount)}}
                  </span>
                </div>
                <span class="d-inline-block text-truncate mt-0 pt-0 w-100 name">{{row.name}}</span>
              </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm mt-2 w-50" @click="deleteProduct(row)">Удалить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProductModal from "./ProductModal.vue";
import axios from "axios";
import func from "../../../js/functions";

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
      catalog_id: null,
      group_id: null,
      search: {
        catalog_index: null,
        group_index: null,
        searchInput: '',
      },
      searchList: [],
      modalProduct: null,
      modal: null,
      baseUrl: 'http://back-img.ey'
    }
  },
  methods: {
    async deleteProduct(product){
      if (confirm(`Вы действителдьно хотите удалить параметр "` + (product.name ?? '') + '"')) {
        try {
          await axios.delete(`https://etaganov-trade.ru/api/v1/products/${product.id}`, {
            params: {
              token: localStorage.access_token,
            }
          })
        } catch (exception) {
          func.toastElList(exception.response.data.msg);
          return;
        }
        await this.getData()
      }
    },
    async searchMethod() {
      if (this.search.searchInput !== '') {
        await axios.get('https://etaganov-trade.ru/api/v1/products/search', {
          params: {
            token: localStorage.access_token,
            catalog_id: this.catalog_id,
            group_id: this.group_id,
            search: this.search.searchInput
          }
        }).then(response => (
            this.searchList = response.data
        ))
      }
    },
    checkProduct(product){
      this.getData(product.id)
      this.search.searchInput = product.name
      this.searchList = []
    },
    clearSearch() {
      this.search = {
        catalog_index: null,
        group_index: null,
        searchInput: ''
      }
      this.catalog_id = null
      this.group_id = null
      this.getData()
    },
    addProduct(){
      this.modalProduct = this.newProduct()
      this.modal = true
    },
    editProduct(object){
      this.modalProduct = {id: object.id}
      this.modal = true
    },
    changeData(){
      try {
        this.catalog_id = this.catalogs[this.search.catalog_index].catalog_id;
        this.group_id = this.catalogs[this.search.catalog_index].groups[this.search.group_index].id;
      } catch (exception) {}
    },
    async getData(id) {
      this.searchList = []
      this.loading = true

      await axios.get(`https://etaganov-trade.ru/api/v1/products`, {
        params: {
          token: localStorage.access_token,
          catalog_id: this.catalog_id,
          group_id: this.group_id,
          product_id: typeof id !== 'number' ? null : id,
          search: this.search.searchInput === '' ? null : this.search.searchInput
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
        await axios.get('https://etaganov-trade.ru/api/v1/catalogs/for-groups', {
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
        description: null,
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
  /*height: 40vh;*/
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 3%;
  aspect-ratio: 9/12;
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
.alignment{
  line-height:60px;
  margin:0;
  text-align:center;
  padding: 0;
}
.name{
  color: #939393;
}
</style>