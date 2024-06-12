<template>
  <div class="wrapper">
    <NavBarClient :cartCount="this.productsCart.length" @updateParent="updateParentMethod"></NavBarClient>

    <div class="loading" v-if="loading === true">
      <div class="text-center">
        <div class="spinner-border mt-5 m-auto" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="m-auto">
        <div class="d-flex m-auto" id="product-for-height">
          <div class="d-flex pp-content-block">
            <div class="img-list d-flex justify-content-around position-relative" v-if="product.img_s.length > 1">
              <div class="position-absolute w-100 h-100">
                <ul class="images no-scrollbar">
                  <li v-for="(img, index) in product.img_s" @click="img_index = index">
                    <div class="img-block">
                      <div class="w-100 img-list-client"
                           v-bind:style="{ backgroundImage: 'url(' + baseUrl+img.src + ')' }">
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div id="carouselExampleIndicators" class="carousel slide first-photo-block">
              <div id="carouselExampleIndicators" class="carousel slide h-100">
                <div class="carousel-indicators">
                  <button type="button" data-bs-target="#carouselExampleIndicators" :data-bs-slide-to="index"
                          :class="index === img_index ? ' active' : ''" aria-current="true" v-for="(param, index) in product.img_s"></button>
                </div>
                <div class="carousel-inner" style="border: #0a53be solid 2px">
                  <div class="carousel-item" :class="index === img_index ? ' active' : ''" v-for="(param, index) in product.img_s">
                    <div class="img-block">
                      <div class="img-client-first" v-bind:style="{ backgroundImage: 'url(' + baseUrl+product.img_l[index].src + ')' }"></div>
                    </div>
                  </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev"
                        >
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next"
                        >
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>
            </div>

<!--            <div class="ps-1 h-100 w-100">-->
<!--              <div v-if="product.img_l.length !== 0" class="h-100 d-flex position-relative">-->
<!--                <div id="zoom" class="zoom h-100" @mousemove="zoom($event, baseUrl+product.img_l[img_index].src)" @mouseout="zoomOut">-->
<!--                  <button class="carousel-btn position-absolute z-1 top-50 start-0 d-flex justify-content-center align-items-center ms-1"-->
<!--                          @click="buttonPrevious" id="buttonPrevious">🠔</button>-->
<!--                  <div class="img-client-first" v-bind:style="{ backgroundImage: 'url(' + baseUrl+product.img_l[img_index].src + ')' }"></div>-->
<!--                  <button class="carousel-btn position-absolute z-1 top-50 end-0 d-flex justify-content-center align-items-center me-1"-->
<!--                          @click="buttonNext" id="buttonNext">🠖</button>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div v-else class="img-client-first h-100" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>-->
<!--            </div>-->
          </div>
          <div class="flex-column pp-content-block">
            <h5 class="fw-bolder ps-3">{{ product.name }}</h5>
            <div class="d-flex flex-row align-items-end mt-4 ps-3">
              <div class="fw-bold d-flex align-items-end alignment fs-3">
                {{ new Intl.NumberFormat("ru-RU").format(product.price) }} <span class="h5 text-secondary ms-2">TMT</span>
              </div>
              <div class="text-decoration-line-through ms-4 alignment text-secondary opacity-75" v-if="Number(product.discount) !== 0">
                {{ new Intl.NumberFormat("ru-RU").format(product.discount) }}
              </div>
            </div>

            <div class="p-3 flex-column flex-column mt-4">
              <h5 class="mb-4">Характеристики и описание</h5>
              <div v-for="(param, index) in product.params" class="d-flex justify-content-between">
                <div class="w-50 mt-2" v-if="index < 3">{{param.name}}</div>
                <div class="w-50 mt-2" v-if="index < 3">{{param.value}}</div>
              </div>
              <div v-if="product.params.length > 3" class="p-0 m-0">
                <span class="p-0 m-0">...</span>
                <p><a data-bs-toggle="offcanvas"
                      class="btn btn-link link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover p-0 m-0"
                      data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                  Все характеристики и описание
                </a></p>
              </div>
              <button v-if="!checkCart(product.id)" type="button" class="btn my-btn-color" @click="addCart">Добавить в корзину</button>
              <button v-else type="button" class="btn my-btn-color" @click="dropCart">Убрать из корзины</button>
            </div>
          </div>
        </div>

        <div class="ms-4 mt-4 mb-4">
          <h4 class="fw-bold">Смотрите также</h4>
          <SeeMorePage v-if="productsListModal" :searchParent="search" @updateParent="updateCartCount"></SeeMorePage>
        </div>
      </div>

      <div class="offcanvas offcanvas-end pt-5 mt-2" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title fw-bolder" id="offcanvasRightLabel">Характеристики и описание</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <div v-for="(param) in product.params" class="d-flex justify-content-between">
            <div class="w-50 mt-2">{{param.name}}</div>
            <div class="w-50 mt-2 ms-4">{{param.value}}</div>
          </div>
          <div class="d-flex flex-column">
            <div class="w-50 mt-2">Описание товара</div>
            <div class="w-50 mt-2">{{product.description}}</div>
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
import SeeMorePage from "./SeeMorePage.vue";
import apiClient from "@/api/axios";
import apiImg from "@/api/axiosImg";

export default {
  name: "ProductPage",
  components: {
    NavBarClient,
    SeeMorePage,
  },
  data() {
    return {
      id: this.$route.query.id,
      loading: true,
      product: null,
      baseUrl: apiImg,
      img_index: 0,
      search: {
        catalog_id: null,
        group_id: null
      },
      keyTest: 0,
      productsListModal: false,
      productsCart: []
    }
  },
  methods: {
    updateCartCount(){
      this.getCartCount()
    },
    checkCart(id){
      let flag = false
      this.productsCart.forEach((row) => {
        if (row === id)
          flag = true
      })
      return flag;
    },
    dropCart(){
      let index;
      this.productsCart.forEach((rowArr, indexArr) => {
        if (rowArr === this.product.id)
          index = indexArr
      })

      this.productsCart.splice(index, 1);
      window.localStorage.setItem('productsCart', JSON.stringify(this.productsCart))
      this.getCartCount();
    },
    addCart(){
      let flag = true
      this.productsCart.forEach((row) => {
        if (row === this.product.id)
          flag = false
      })

      if (flag) {
        this.productsCart.unshift(this.product.id)
        window.localStorage.setItem('productsCart', JSON.stringify(this.productsCart))
        this.getCartCount();
      }
    },
    buttonPrevious(){
      if (0 === this.img_index)
        this.img_index = this.product.img_s.length - 1
      else
        this.img_index = this.img_index - 1

      console.log(this.img_index)
    },
    buttonNext(){
      if ((this.product.img_s.length - 1) === this.img_index)
        this.img_index = 0
      else
        this.img_index = this.img_index + 1

      console.log(this.img_index)
    },
    zoomOut() {
      document.getElementById('zoom').style.backgroundImage = 'none';
      document.getElementById('buttonPrevious').style.opacity = '0';
      document.getElementById('buttonNext').style.opacity = '0';
    },
    zoom(e, url){
      let zoomer = e.currentTarget;
      let offsetX;
      let offsetY
      e.offsetX ? offsetX = e.offsetX : 0
      e.offsetY ? offsetY = e.offsetY : 0
      let x = offsetX/zoomer.offsetWidth*100
      let y = offsetY/zoomer.offsetHeight*100
      zoomer.style.backgroundPosition = x + '% ' + y + '%';
      document.getElementById('zoom').style.backgroundImage = 'url(' + url + ')'
      document.getElementById('buttonPrevious').style.opacity = '1';
      document.getElementById('buttonNext').style.opacity = '1';
    },
    async updateParentMethod(data) {
      this.search = {
        catalog_id: data.search.catalog_id ?? null,
        group_id: data.search.group_id ?? null,
      }

      window.localStorage.setItem('searchParams', JSON.stringify(this.search))
      await router.push({name: 'home'});
    },
    async getData() {
      this.loading = true
      let openProductsList = JSON.parse(window.localStorage.getItem('openProductsList'));

      if (openProductsList !== null) {
        openProductsList.forEach((function (eachEle) {
          if (eachEle.id === Number(this.id))
            this.product = eachEle
        }).bind(this))
      } else {
        openProductsList = []
      }

      if (this.product === null) {
        await apiClient.get(`/v1/client-products/${this.id}`, {
          params: {}
        }).then(response => (
            this.product = response.data
        ))
        openProductsList.push(this.product)
        window.localStorage.setItem('openProductsList', JSON.stringify(openProductsList))
      }
      this.loading = false
    },
    handleScroll() {
      try {
        let height = document.getElementById('product-for-height').offsetHeight;
        if (window.scrollY+(height*0.95) >= height) {
          this.productsListModal = true
        }
      } catch (exception){}
    },
    getCartCount() {
      this.productsCart = JSON.parse(window.localStorage.getItem('productsCart'));
      if (this.productsCart == null)
        this.productsCart = []
    },
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  async mounted() {
    this.getCartCount();
    window.scrollTo(0, 0);
    await this.getData()
    this.search = {
      catalog_id: null,
      group_id: this.product.group_id
    }
    window.localStorage.setItem('reloadPage', JSON.stringify(this.$route.path))
    window.addEventListener('scroll', this.handleScroll);
  }
}
</script>

<style scoped>

@import '../../assets/client/product-page-1.css';
</style>