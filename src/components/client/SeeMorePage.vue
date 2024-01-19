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
        <div class="product-block my-3 d-flex flex-column p-2 m-auto" v-for="(row, index) in productsTest">
          <div @click="refresh()" class="mb-0 pb-0">
            <router-link class="nav-link" :to="{ path: '/product', query: {id: row.id}}">
              <div>
                <div v-if="row.img" class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl+row.img + ')' }"></div>
                <div v-else class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
              </div>
              <div class="px-2 mt-3">
                <div class="d-flex justify-content-between pb-0 mb-0">
                  <span class="h4 fw-semibold">{{new Intl.NumberFormat("ru-RU").format(row.price)}} <span class="h6 text-secondary">TMT</span></span>
                  <span class="text-decoration-line-through text-secondary opacity-50" style="font-size: 16px" v-if="Number(row.discount) !== 0">
                    {{new Intl.NumberFormat("ru-RU").format(row.discount)}}
                  </span>
                </div>
                <h6 class="d-inline-block text-truncate mt-0 pt-0 w-100 py-1 text-secondary">{{row.name}}</h6>
              </div>
            </router-link>
          </div>
          <div class="w-100 bottom-0 py-0 my-0">
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

export default {
  name: "SeeMorePage",
  data(){
    return {
      id: this.$route.query.id,
      baseUrl: 'https://etaganov-trade.ru',
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

        await axios.get(`https://etaganov-trade.ru/api/v1/client-products`, {
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
</style>