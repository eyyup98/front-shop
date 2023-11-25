<template>
  <ProductModal v-if="modal === true" @updateParent="updateParentMethod" :objectParent="modalProduct"></ProductModal>
<!--  <img v-bind:src="url" alt="" :height="100" />-->
  <div class="container">
    <h1 class="h1 m">Товары</h1>
    <button class="button" @click="addProduct">Добавить</button>
    <div class="loading" v-if="loading === true">Загрузка данных...</div>
    <div class="products-container">
      <div class="product-block">

      </div>
    </div>
  </div>
</template>

<script>
import ProductModal from "./ProductModal.vue";

export default {
  name: "Products",
  components: {
    ProductModal
  },
  data() {
    return {
      loading: true,
      modalProduct: null,
      modal: null,
      url: 'http://back-img.ey/images/1.jpg'
    }
  },
  methods: {
    addProduct(){
      this.modalProduct = this.newProduct()
      this.modal = true
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
}
</script>

<style scoped>

</style>