<template>
  <div style="width: 90%; margin: 0 auto">
    <div class="loading" v-if="loading === true">
      <div class="text-center">
        <div class="spinner-border mt-5 m-auto" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="d-flex flex-wrap">
        <div class="product-block d-flex flex-column m-auto" v-for="(row, index) in productsTest">
          <div @click="refresh()" class="">
            <router-link class="nav-link" :to="{ path: '/product', query: {id: row.id}}">
              <div class="img-block">
                <div v-if="row.img" class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl+row.img + ')' }"></div>
                <div v-else class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
              </div>
              <div class="img-bottom">
                <div class="d-flex flex-column">
                  <div>
                    <span class="product-cost fw-semibold">{{new Intl.NumberFormat("ru-RU").format(row.price)}}</span>
                    <span class="px-1 fw-semibold currency">TMT</span>
                    <span class="text-decoration-line-through text-secondary opacity-50 old-cost" v-if="Number(row.discount) !== 0">
                      {{new Intl.NumberFormat("ru-RU").format(row.discount)}}
                      </span>
                  </div>
                  <!--                    <span class="text-secondary product-text"  style="margin: 0; padding: 0;">TMT</span>-->
                  <span class="d-inline-block text-truncate w-100 text-secondary product-text">{{row.name}}</span>
                </div>
              </div>
            </router-link>
          </div>
          <div class="">
            <button v-if="!checkCart(row.id)" type="button" class="btn my-btn-color btn-sm px-4 py-1 my-0" @click="addCart(row)">В корзину</button>
            <button v-else type="button" class="btn my-btn-color btn-sm px-2 py-1 my-0" @click="dropCart(row)">Убрать из корзины</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import func from "../../js/functions";
import router from "../../router";
import apiClient from "@/api/axios";
import apiImg from "@/api/axiosImg";

export default {
  name: "SeeMorePage",
  data(){
    return {
      id: this.$route.query.id,
      baseUrl: apiImg,
      productsTest: null,
      loading: true,
      search: {
        catalog_id: null,
        group_id: null
      },
      productsCart: [],
    }
  },
  props: {
    searchParent: {
      required: true
    }
  },
  methods: {
    refresh(){
      if (this.id !== null) {
        window.location.href = window.location.href     // Для обновления страницы. Так сохраняется история страниц
      }
    },
    addCart(product){
      this.productsCart.unshift(product.id)
      window.localStorage.setItem('productsCart', JSON.stringify(this.productsCart))
      this.getCartCount();
    },
    dropCart(row){
      let index;
      this.productsCart.forEach((rowArr, indexArr) => {
        if (rowArr === row.id)
          index = indexArr
      })

      this.productsCart.splice(index, 1);
      window.localStorage.setItem('productsCart', JSON.stringify(this.productsCart))
      this.getCartCount();
    },
    checkCart(id){
      let flag = false
      this.productsCart.forEach((row) => {
        if (row === id)
          flag = true
      })
      return flag;
    },
    async getData() {
      this.loading = true

        await apiClient.get(`/v1/client-products`, {
          params: {
            catalog_id: this.searchParent.catalog_id ?? null,
            group_id: this.searchParent.group_id ?? null,
          }
        }).then(response => (
            this.productsTest = response.data
        ))

      if (this.id !== null) {
        let index;
        this.productsTest.forEach((function (row, ind) {
          if (Number(this.id) === row.id)
            index = ind
        }).bind(this))
        this.productsTest.splice(index, 1);
      }

      this.loading = false
    },
    getCartCount() {
      this.$emit('updateParent', {})
    },
  },
  async mounted() {
    this.productsCart = JSON.parse(window.localStorage.getItem('productsCart'));
    if (this.productsCart == null)
      this.productsCart = []
    await this.getData()
  }
}
</script>

<style scoped>
@import '../../assets/client/base.css';
@import '../../assets/client/client-page-1.css';
@import '../../assets/client/client-page-1100.css';
@import '../../assets/client/client-page-850.css';
@import '../../assets/client/client-page-600.css';
</style>