<template>
  <div class="wrapper">
    <NavBarClient :cartCount="this.productsCart.length" @updateParent="updateParentMethod"></NavBarClient>

    <div>
      <div class="loading position-absolute start-50 top-50" v-if="loading === true">
        <div class="text-center">
          <div class="spinner-border mt-5 m-auto" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="d-flex flex-wrap content">
          <div :name="'product-block'" class="product-block d-flex flex-column m-auto" v-for="(row, index) in products" @mousemove="moveBtn(index)" @mouseout="outBtn">
            <div @click="openProduct(row);">
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
            <div class="button-block">
              <button v-if="!checkCart(row.id)" type="button" class="btn my-btn-color btn-sm bottom-text" @click="addCart(row)">В корзину</button>
              <button v-else type="button" class="btn my-btn-color btn-sm bottom-text" @click="dropCart(row)">Убрать из корзины</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavBarClient from "./NavBarClient.vue";
import func from "../../js/functions";
import router from "../../router";
import apiClient from "@/api/axios";
import apiImg from "@/api/axiosImg";

onscroll = function(){
  // if(window.scrollY+1 >= document.documentElement.scrollHeight-document.documentElement.clientHeight)
  //   alert('Конец прокрутки');
};

let posLeft;
let posTop;
window.onscroll = function() {
  posLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
  posTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

window.onbeforeunload = () => {
  let reloadPage = JSON.parse(window.localStorage.getItem('reloadPage'));
  if (reloadPage === '/') {
    localStorage.removeItem('openProductsList');
    localStorage.removeItem('catalogList');
  }
}

export default {
  name: "ClientPage",
  components: {
    NavBarClient
  },
  data() {
    return {
      baseUrl: apiImg,
      products: null,
      loading: true,
      search: {
        catalog_id: null,
        group_id: null
      },
      productsCart: [],
    }
  },
  methods: {
    refresh(){
      window.location.href = window.location.href
    },
    moveBtn(e){
    },
    outBtn(){
      // document.getElementById('addCartBtn').style.display = 'none'
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
    openProduct(){
      // window.localStorage.setItem('pagePosition', JSON.stringify({x: posLeft, y: posTop}))
      window.localStorage.setItem('productsList', JSON.stringify(this.products))
    },
    async updateParentMethod(data) {
      this.search = {
        catalog_id: data.search.catalog_id ?? null,
        group_id: data.search.group_id ?? null,
      }

      await this.getData()
    },
    async getData() {
      this.loading = true
      let productsCache = window.localStorage.getItem('productsList')
      let searchParams = window.localStorage.getItem('searchParams');

      if (productsCache === null || searchParams !== null) {
        if (searchParams !== null)
          this.search = JSON.parse(searchParams)

        await apiClient.get(`/v1/client-products`, {
          params: {
            catalog_id: this.search.catalog_id,
            group_id: this.search.group_id,
          }
        }).then(response => (
            this.products = response.data
        ))
        window.localStorage.removeItem('searchParams')
      } else {
        this.products = JSON.parse(productsCache)
        window.localStorage.removeItem('productsList')
      }

      this.loading = false
    },
    getCartCount() {
      this.productsCart = JSON.parse(window.localStorage.getItem('productsCart'));
      if (this.productsCart == null)
        this.productsCart = []
    },
  },
  async mounted() {
    this.getCartCount();
    await this.getData()
    window.localStorage.setItem('reloadPage', JSON.stringify(this.$route.path))
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