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
      <div class="container m-auto my-bc" id="product-for-height">
        <div class="d-flex pr-control-flex">
          <div class="pr-img-block">
              <swiper
                  :slidesPerView="'auto'"
                  :spaceBetween="0"
                  :modules="modules"
                  class="mySwiper"
              >
                <swiper-slide v-for="(image, index) in product.img_l">
                  <img :src="baseUrl+image.src" class="slider-image">
                </swiper-slide>
              </swiper>
          </div>
          <div class="pr-content-block">
            <div class="flex-column pp-content-block info-block card-pr-text-block">
              <div class="separation-blocks">
                <div class="card-pr-cost">{{new Intl.NumberFormat("ru-RU").format(product.price)}}</div>
                <span class="card-pr-currency ps-1 pe-3">TMT</span>
                <span class="text-decoration-line-through opacity-75 card-pr-discount" v-if="Number(product.discount) !== 0">
                      {{new Intl.NumberFormat("ru-RU").format(product.discount)}}
                      </span>
              </div>

              <div class="flex-column">
                <div class="separation-blocks">
                  <div class="card-pr-name">{{ product.name }}</div>
                  <!--              <h5 class="mb-4">Характеристики и описание</h5>-->
                  <div v-for="(param, index) in product.params" class="d-flex justify-content-between pr-params-list">
                    <div class="line-start text-secondary card-har pe-1" v-if="index < 5">{{param.name}}</div>
                    <div class="dotted-line" v-if="index < 5"></div>
                    <div class="line-end card-har card-har-val ps-1 text-right" v-if="index < 5">{{param.value}}</div>
                  </div>
                  <div v-if="product.params.length > 5" class="mt-2">
                    <p><a data-bs-toggle="offcanvas"
                          class="btn btn-link link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover p-0 m-0"
                          data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                      <span class="all-har bottom-text">Все характеристики и описание</span>
                    </a></p>
                  </div>
                </div>
                <button v-if="!checkCart(product.id)" type="button" class="btn my-btn-color bottom-text pr-btn" @click="addCart">Добавить в корзину</button>
                <button v-else type="button" class="btn my-btn-color bottom-text pr-btn" @click="dropCart">Убрать из корзины</button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-pr-name see-more">Смотрите также</div>

        <div class="">
          <SeeMorePage v-if="productsListModal" :searchParent="search" @updateParent="updateCartCount"></SeeMorePage>
        </div>
      </div>

      <div class="offcanvas-block">
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title fw-bolder p-2 card-pr-name" id="offcanvasRightLabel">Характеристики и описание</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body p-4 pt-0">
            <div v-for="(param) in product.params" class="d-flex justify-content-between mb-2">
              <div class="line-start text-secondary card-har pe-1">{{param.name}}</div>
              <div class="dotted-line"></div>
              <div class="line-end card-har card-har-val ps-1 text-right">{{param.value}}</div>
            </div>
<!--            <div class="d-flex flex-column" v-if="product.description !== null">-->
            <div class="d-flex flex-column" v-if="product.description !== null && product.description !== ''">
              <div class="card-har text-secondary">Описание товара</div>
              <div class="card-har">{{product.description}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NavBarFooter :cartCount="this.productsCart.length" @updateParent="updateParentMethod"></NavBarFooter>
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
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import NavBarFooter from "./NavBarFooter.vue";
export default {
  name: "ProductPage",
  components: {
    NavBarFooter,
    NavBarClient,
    SeeMorePage,
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [Pagination],
    };
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
      productsCart: [],
      currentImage: 0,
      touchStartX: 0,
      touchEndX: 0
    }
  },
  methods: {
    nextImage() {
      this.currentImage = (this.currentImage + 1) % this.product.img_l.length;
    },
    prevImage() {
      this.currentImage = (this.currentImage - 1 + this.product.img_l.length) % this.product.img_l.length;
    },
    handleSwipe() {
      const swipeThreshold = 50; // Минимальное расстояние в пикселях для распознавания свайпа
      if (this.touchEndX < this.touchStartX - swipeThreshold) {
        this.nextImage();
      } else if (this.touchEndX > this.touchStartX + swipeThreshold) {
        this.prevImage();
      }
    },
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

@import '../../assets/client/base.css';
@import '../../assets/client/product-page-1.css';
@import '../../assets/client/product-page-1000.css';
@import '../../assets/client/product-page-700.css';
@import '../../assets/client/font-size.css';
@import '../../assets/client/product-page-test.css';

</style>