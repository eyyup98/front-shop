<template>

  <NavBarClient @updateParent="updateParentMethod" :cartCount="0"></NavBarClient>

  <OrderModal v-if="modal === true" :object="orderObject" @updateParent="updateOrder"></OrderModal>

  <div class="p-4">
    <div style="width: 90%; margin: 0 auto">
      <div class="loading" v-if="loading === true">
        <div class="text-center">
          <div class="spinner-border mt-5 m-auto" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <div v-else>
        <button v-if="cartHistory.length > 1" type="button" class="btn btn-warning btn-lg mb-2 ms-2" @click="openOrderHistory">Посмотреть мои заказы</button>

        <h2 class="ps-2 fw-semibold mb-4">Корзина</h2>

        <div v-if="products.length === 0" class="ps-2">
          <h6>В корзине пусто</h6>
          <router-link to="/">
            <button type="button" class="btn btn-link ps-0">Пройти в главную страницу</button>
          </router-link>
        </div>

        <div class="d-flex flex-column w-100">
          <div v-if="products.length > 0">
            <div class="card" style="max-width: 400px">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <h5 class="card-title me-2">Итого</h5>
                  <h5 class="card-title fw-semibold">{{ new Intl.NumberFormat("ru-RU").format(sum) }} TMT</h5>
                </div>
                <div class="d-flex justify-content-between">
                  <h5 class="card-title link-secondary me-2">Товыры</h5>
                  <h5 class="card-title link-secondary">{{ count }} шт.</h5>
                </div>
                <div class="w-100 d-flex justify-content-start mt-2">
                  <button class="btn my-btn-color" @click="openOrder">Заказать</button>
                </div>
              </div>
            </div>
          </div>
          <div class="w-100 mt-2">
            <div class="d-flex justify-content-start mt-2 p-2 cart-list" v-for="(row, index) in products">
              <router-link class="nav-link" :to="{ path: '/product', query: {id: row.id}}">
                <div v-if="row.img" class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl+row.img + ')' }"></div>
                <div v-else class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
              </router-link>
              <div class="d-flex flex-column ms-3">
                <router-link class="nav-link" :to="{ path: '/product', query: {id: row.id}}">
                  <h5 class="link-secondary fw-semibold">{{ row.name }}</h5>
                </router-link>
                <h6 class="fw-bold">{{ new Intl.NumberFormat("ru-RU").format(row.price * row.count) }} TMT</h6>
                <h6 class="text-decoration-line-through link-secondary" v-if="Number(row.discount) !== 0">
                  {{ new Intl.NumberFormat("ru-RU").format(row.discount * row.count) }} TMT
                </h6>
                <nav class="d-flex flex-row mt-2">
                  <ul class="pagination justify-content-center">
                    <li class="page-item">
                      <button v-if="row.count !== 1" @click="row.count = row.count - 1; changeData();" class="page-link fw-bolder">-</button>
                      <button v-else class="page-link disabled fw-bolder">-</button>
                    </li>
                    <li class="page-item"><span class="page-link text-bg-light">{{ row.count }}</span></li>
                    <li class="page-item p-0" @click="row.count = row.count + 1; changeData();">
                      <button class="page-link fw-bolder">+</button>
                    </li>
                  </ul>
                  <button class="h-75 btn btn-light d-flex align-items-center ms-3">
                    <img class="m-0 p-0" src="@/assets/icons/delete.png" width="30" height="30" @click="deleteProduct(index)"/>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import NavBarClient from "./NavBarClient.vue";
import OrderModal from "./OrderModal.vue";
import router from "../../router";
import axios from "axios";

export default {
  name: "CartProduct",
  components: {
    NavBarClient,
    OrderModal
  },
  data() {
    return {
      products: null,
      loading: true,
      baseUrl: 'http://back-img.ey',
      count: 0,
      sum: 0,
      modal: false,
      orderObject: null,
      cartHistory: null,
    }
  },
  methods: {
    updateOrder(data){
      this.modal = false

      if (data.changed === true) {
        window.localStorage.removeItem('productsCart')

        let cartHistory = JSON.parse(window.localStorage.getItem('cartHistory'));
        if (cartHistory == null)
          cartHistory = []

        cartHistory.unshift(data.order_id)
        window.localStorage.setItem('cartHistory', JSON.stringify(cartHistory))

        this.products = [];
      }
    },
    openOrderHistory(){
      console.log('openOrderHistory')
    },
    openOrder(){
      this.orderObject = this.products
      this.modal = true
    },
    deleteProduct(index){
      this.products.splice(index, 1);
      window.localStorage.setItem('productsCart', JSON.stringify(this.products))
    },
    changeData(){
      this.count = 0
      this.sum = 0
      this.products.forEach((function (row) {
        this.count = this.count + row.count
        this.sum = Number(this.sum) + (Number(row.price) * row.count)
      }).bind(this))
    },
    async updateParentMethod(data) {
      const search = {
        catalog_id: data.search.catalog_id ?? null,
        group_id: data.search.group_id ?? null,
      }

      window.localStorage.setItem('searchParams', JSON.stringify(search))
      await router.push({name: 'home'});
    },
    async getData(){
      this.loading = true

      await axios.post(`http://back.ey/api/v1/products/for-cart`, {
        token: localStorage.access_token,
        params: {
          productsList: JSON.parse(window.localStorage.getItem('productsCart')) ?? []
        }
      }).then(response => (
          this.products = response.data
      ))

      this.loading = false
    },
  },
  async mounted() {
    this.cartHistory = JSON.parse(window.localStorage.getItem('cartHistory')) ?? [];
    await this.getData()
    if (this.products.length > 0) {
      this.products.forEach((row) => {
        row.count = 1
      })
      this.changeData()
    }
    this.loading = false

    console.log(this.cartHistory)
  }
}
</script>

<style scoped>
.img{
  width: 150px;
  /*height: 25vh;*/
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 3%;
  aspect-ratio: 9/12;
  /*border: 3px saddlebrown solid;*/
}
.cart-list:hover{
  background-color: #f6f6f6;
  border-radius: 10px;
}
.my-btn-color{
  background-color: #d946d2;
  color: white;
}
.my-btn-color:hover{
  background-color: #ad2ea9;
  color: white;
}
</style>