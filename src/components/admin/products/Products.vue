<template>
  <ProductModal v-if="this.modal === true" @updateParent="updateParentMethod" :objectParent="modalProduct">
  </ProductModal>
  <div class="container-list">
    <h1 class="h1 m">Товары</h1>
    <button class="btn btn-outline-primary w-25 my-3 mx-auto" @click="addProduct">Добавить</button>

    <div class="loading" v-if="loading === true">Загрузка данных...</div>
    <div class="products-container" v-else>
      <div class="product-block" v-for="row in products" @click="editProduct(row)">
        <div class="div-img" style="background-color: #f8f8f8">
          <div v-if="row.img" class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl+row.img + ')' }"></div>
          <div v-else class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
        </div>
        <div class="product-block-text">
          <label>{{row.name}}</label>
          <label>{{row.price}}</label>
          <label>{{row.discount}}</label>
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
    editProduct(object){
      this.modalProduct = {id: object.id}
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
  width: 100%;
  height: 40vh;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 3%;
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
}
.products-container{
  display:flex;
  flex-wrap:wrap;
  position: relative;
}
.product-block-text{
  display: flex;
  flex-direction: column;
}
.container-list{
  padding: 10px;
  display: flex;
  flex-direction:column;
  /*background-color: rgba(0, 0, 0, 0.01);*/
}
</style>