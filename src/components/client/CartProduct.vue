<template>
  <div class="wrapper">
    <NavBarClient @updateParent="updateParentMethod" :cartCount="0"></NavBarClient>

    <OrderModal v-if="modal === true" :object="orderObject" @updateParent="updateOrder"></OrderModal>

    <div class="content">
      <div>
        <div class="loading" v-if="loading === true">
          <div class="text-center">
            <div class="spinner-border mt-5 m-auto" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
        <div v-else>
          <button v-if="cartHistory.length > 1" type="button" class="btn btn-warning btn-lg mb-2 ms-2" @click="openOrderHistory">Посмотреть мои заказы</button>

          <div v-if="products.length === 0" class="ps-2">
            <h6>В корзине пусто</h6>
          </div>

          <div class="d-flex-cart w-100">
            <div class="cart-products">
              <div class="d-flex justify-content-start cart-list" v-for="(row, index) in products">
                <router-link class="nav-link" :to="{ path: '/product', query: {id: row.id}}">
                  <div v-if="row.img" class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl+row.img + ')' }"></div>
                  <div v-else class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
                </router-link>
                <div class="d-flex flex-wrap align-content-between all-text-cart">
                  <div class="d-flex flex-column w-100">
                    <router-link class="nav-link" :to="{ path: '/product', query: {id: row.id}}">
                      <span class="link-secondary fw-semibold product-name">{{ row.name }}</span>
                    </router-link>
                    <span class="fw-bold">{{ new Intl.NumberFormat("ru-RU").format(row.price * row.count) }} TMT</span>
                    <span class="text-decoration-line-through link-secondary" v-if="Number(row.discount) !== 0">
                      {{ new Intl.NumberFormat("ru-RU").format(row.discount * row.count) }} TMT
                    </span>
                  </div>
                  <div class="w-100">
                    <nav class="d-flex flex-row">
                      <ul class="pagination justify-content-center">
                        <li class="page-item">
                          <button v-if="row.count !== 1" @click="row.count = row.count - 1; changeData();" class="page-link fw-bolder pagination-button">-</button>
                          <button v-else class="page-link disabled fw-bolder pagination-button">-</button>
                        </li>
                        <li class="page-item"><span class="page-link text-bg-light pagination-count">{{ row.count }}</span></li>
                        <li class="page-item p-0" @click="row.count = row.count + 1; changeData();">
                          <button class="page-link fw-bolder pagination-button">+</button>
                        </li>
                      </ul>
                      <button class="h-75 btn btn-light d-flex align-items-center cart-delete-btn">
                        <img class="m-0 p-0" src="@/assets/icons/delete.png" width="30" height="30" @click="deleteProduct(index)"/>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="products.length > 0" class="cart-total">
              <div class="card w-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between">
                    <span class="card-title">Итого</span>
                    <span class="card-title fw-semibold">{{ new Intl.NumberFormat("ru-RU").format(sum) }} TMT</span>
                  </div>
                  <div class="d-flex justify-content-between">
                    <span class="card-title link-secondary me-2">Товары</span>
                    <span class="card-title link-secondary fw-semibold">{{ count }} шт.</span>
                  </div>
                  <div class="d-flex justify-content-start order-btn-block">
                    <button class="btn my-btn-color" @click="openOrder">Заказать</button>
                  </div>
                </div>
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
import apiClient from "@/api/axios";
import apiImg from "@/api/axiosImg";

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
      baseUrl: apiImg,
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

      await apiClient.post(`/v1/client-products/for-cart`, {
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

@import '../../assets/client/base.css';
@import '../../assets/client/cart-1.css';
@import '../../assets/client/cart-900.css';
@import '../../assets/client/cart-500.css';

</style>