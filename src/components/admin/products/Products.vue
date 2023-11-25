<template>
  <ProductModal v-if="modal === true" @updateParent="updateParentMethod" :objectParent="modalProduct"></ProductModal>
<!--  <img v-bind:src="url" alt="" :height="100" />-->
  <div class="container">
    <h1 class="h1 m">Товары</h1>
    <button class="button" @click="addProduct">Добавить</button>
    <div class="loading" v-if="loading === true">Загрузка данных...</div>
    <div class="products-container">
      <div class="product-block" v-for="row in products">
        <div v-if="row.img" class="div-img" style="background-color: #f8f8f8">
          <img :src="baseUrl+row.img" class="img" alt=""/>
        </div>
        <div v-else class="div-img"> </div>
        <div class="product-block-text">
          <label>{{row.name}}</label>
          <label>{{row.price}}</label>
          <label>{{row.discount}}</label>
          <div class="product-buttons">
            <i class="delete" @click="deleteParam(row)">d</i>
            <i class="edit" @click="editParam(row)">e</i>
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
    async getData() {
      this.loading = true

      await axios.get('http://back.ey/api/v1/products', {
        params: {
          token: localStorage.access_token
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
    newProduct() {
        return {
          id: '',
          catalog_id: null,
          group_id: null,
          subgroup_id: null,
          name: '',
          price: 0,
          discount: 0,
          active: true,
          img: [],
          params: [],
        }
      }
  },
  async mounted() {
    await this.getData()
  }
}
</script>

<style scoped>
.img{
  width: 150px;
}
.product-block {
  border: solid 2px black;
  margin: 5px;
  background-color: #f8f8f8;
  display: flex;
  flex-direction:column;
}
.products-container{
  display:flex;
  flex-wrap:wrap;
  position: relative;
}
.div-img{
  height: 100px;
  width: 150px;
  background-color: #2c3e50;
}
.product-block-text{
  /*position: absolute;*/
  /*bottom: 5px;*/
  display: flex;
  flex-direction: column;
}
.product-buttons{
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.25);
}
</style>