<template>
  <div style="background-color: rgba(248,248,248,0.5)" class="pb-4">
    <NavBarClient @updateParent="updateParentMethod"></NavBarClient>

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
          <div :name="'product-block'" class="product-block my-3 d-flex flex-column p-2 m-auto" v-for="(row, index) in products" @mousemove="moveBtn(index)" @mouseout="outBtn">
            <div @click="openProduct(row);" class="mb-0 pb-0">
              <router-link class="nav-link" :to="{ path: '/product', query: {id: row.id}}">
                <div>
                  <div v-if="row.img" class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl+row.img + ')' }"></div>
                  <div v-else class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
                </div>
                <div class="px-2 mt-3">
                  <div class="d-flex justify-content-between pb-0 mb-0">
                    <span class="h4 fw-semibold">{{row.price}}</span>
                    <span class="text-decoration-line-through" style="color: #656565;" v-if="Number(row.discount) !== 0">{{row.discount}}</span>
                  </div>
                  <h6 class="d-inline-block text-truncate mt-0 pt-0 w-100 py-1" style="color: #656565;">{{row.name}}</h6>
                </div>
              </router-link>
            </div>
            <div class="w-100 bottom-0 py-0 my-0">
              <button name="hdhdh" type="button" class="btn my-btn-color btn-sm px-4 py-1 my-0" @click="addCart(row)">В корзину</button>
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
      baseUrl: 'http://back-img.ey',
      products: null,
      loading: true,
      search: {
        catalog_id: null,
        group_id: null
      },
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
      let productsCart = JSON.parse(window.localStorage.getItem('productsCart'));
      if (productsCart == null)
        productsCart = []

      let flag = true
      productsCart.forEach((row) => {
        if (row.id === product.id)
          flag = false
      })

      if (flag) {
        productsCart.unshift(product)
        window.localStorage.setItem('productsCart', JSON.stringify(productsCart))
      }
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

        await axios.get(`http://back.ey/api/v1/client-products`, {
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
  },
  async mounted() {
    await this.getData()

    // console.log(products)

    window.localStorage.setItem('reloadPage', JSON.stringify(this.$route.path))
  }
}
</script>

<style scoped>

.img{
  width: 100%;
  height: 50vh;
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
  min-width: 280px;
  max-width: 300px;
  padding: 10px;
  border-radius: 3%;
  aspect-ratio: 9/12;
  /*background-color: rgb(255, 255, 255);*/
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
.product-block:hover{
  transform: scale(1.1, 1.1);
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  border-radius: 3%;
}
.my-btn-color{
  background-color: #d946d2;
  color: white;
}
.my-btn-color:hover{
  background-color: #ad2ea9;
}
.ttt{
  /*display: none;*/
  opacity: 0;
}
</style>