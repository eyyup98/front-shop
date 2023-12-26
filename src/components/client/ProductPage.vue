<template>
  <NavBarClient @updateParent="updateParentMethod"></NavBarClient>

  <div class="loading" v-if="loading === true">
    <div class="text-center">
      <div class="spinner-border mt-5 m-auto" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
  <div v-else>
    <div style="width: 95%" class="m-auto">
      <div class="d-flex m-auto" style="height: 85vh; /*border: #a80000 solid 2px*/">
        <div class="p-2 w-50 d-flex" style="height: 85vh">

          <div class="img-list w-100 d-flex justify-content-around" v-if="product.img.length > 1">
            <ul class="images h-100 no-scrollbar">
              <li v-for="(img, index) in product.img" @click="img_index = index">
                <div class="w-100 img-list-client h-100"
                     v-bind:style="{ backgroundImage: 'url(' + baseUrl+img.src + ')' }">
                </div>
              </li>
            </ul>
          </div>

          <div class="ps-1 h-100">
            <div v-if="product.img.length !== 0" class="h-100 d-flex position-relative">
              <div id="zoom" class="zoom h-100" @mousemove="zoom($event, baseUrl+product.img[img_index].src)" @mouseout="zoomOut">
                <button class="carousel-btn position-absolute z-1 top-50 start-0 d-flex justify-content-center align-items-center ms-1"
                        @click="buttonPrevious" id="buttonPrevious">🠔</button>
                <div class="img-client-first" v-bind:style="{ backgroundImage: 'url(' + baseUrl+product.img[img_index].src + ')' }"></div>
                <button class="carousel-btn position-absolute z-1 top-50 end-0 d-flex justify-content-center align-items-center me-1"
                        @click="buttonNext" id="buttonNext">🠖</button>
              </div>
            </div>
            <div v-else class="img-client-first h-100" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
          </div>
        </div>
        <div class="p-2 flex-column flex-column w-50"  style="height: 85vh; /*border: #008200 2px solid*/">
          <h5 class="fw-bolder ps-3">{{ product.name }}</h5>
          <div class="d-flex flex-row align-items-end mt-4 ps-3">
            <div class="fw-bold d-flex align-items-end alignment" style="font-size: 34px">{{ product.price }}</div>
            <div class="text-decoration-line-through ms-4 alignment" style="color: #656565" v-if="Number(product.discount) !== 0">{{ product.discount }}</div>
          </div>

          <div class="p-3 flex-column flex-column mt-4" style="box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 2%; ">
            <h5 class="mb-4" style="font-size: 20px">Характеристики и описание</h5>
            <div v-for="(param, index) in product.params" class="d-flex justify-content-between">
              <div class="w-50 mt-2" v-if="index < 3" style="font-size:16px; color: #656565">{{param.name}}</div>
              <div class="w-50 mt-2" v-if="index < 3" style="font-size: 16px">{{param.value}}</div>
            </div>
            <div v-if="product.params.length > 3" class="p-0 m-0">
              <span class="p-0 m-0">...</span>
              <p><a data-bs-toggle="offcanvas"
                    class="btn btn-link link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover p-0 m-0"
                    data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                Все характеристики и описание
              </a></p>
            </div>
            <button type="button" class="btn px-4" style="background-color: #d946d2; color: white;"><span class="fw-bolder">Добавить в корзину</span></button>
          </div>
        </div>
      </div>
    </div>

    <div class="offcanvas offcanvas-end pt-5 mt-2" style="width: 40%" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title fw-bolder" id="offcanvasRightLabel">Характеристики и описание</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div v-for="(param) in product.params" class="d-flex justify-content-between">
          <div class="w-50 mt-2" style="color: #656565">{{param.name}}</div>
          <div class="w-50 mt-2 ms-4">{{param.value}}</div>
        </div>
        <div class="d-flex flex-column">
          <div class="w-50 mt-2" style="color: #656565">Описание товара</div>
          <div class="w-50 mt-2">{{product.description}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavBarClient from "./NavBarClient.vue";
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import func from "../../js/functions";
import router from "../../router";

export default {
  name: "ProductPage",
  components: {
    NavBarClient,
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  data() {
    return {
      id: this.$route.query.id,
      loading: true,
      product: null,
      baseUrl: 'http://back-img.ey',
      img_index: 0,
    }
  },
  methods: {
    buttonPrevious(){
      if (0 === this.img_index)
        this.img_index = this.product.img.length - 1
      else
        this.img_index = this.img_index - 1
    },
    buttonNext(){
      if ((this.product.img.length - 1) === this.img_index)
        this.img_index = 0
      else
        this.img_index = this.img_index + 1
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
        await axios.get(`http://back.ey/api/v1/client-products/${this.id}`, {
          params: {}
        }).then(response => (
            this.product = response.data
        ))
        openProductsList.push(this.product)
        window.localStorage.setItem('openProductsList', JSON.stringify(openProductsList))
      }
      this.loading = false
    },
  },
  async mounted() {
    await this.getData()
    // window.localStorage.setItem('reloadPage', JSON.stringify(this.$route.path))
  }
}
</script>

<style scoped>
.w-33{
  width: 33%;
  margin: 0 auto;
}
.img-client-first{
  width: 100%;
  /*height: 100%;*/
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 3%;
  aspect-ratio: 9/12;
  /*border: #2c3e50 2px solid;*/
}
.img-list-client {
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 5%;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
  /*min-width: 20%;*/
  /*max-width: 90%;*/
  aspect-ratio: 9/12;
}
ul.images {
  margin: 0;
  padding: 0;
  display:flex;
  flex-direction:column;
  overflow: scroll;
  width: 70%;
}
@media screen and (max-width: 1500px) {
  ul.images {
    width: 100%;
  }
}
ul.images li {
  display: inline-block;
  flex: 0 0 auto;
  width: 100%;
  min-height: 20%;
  aspect-ratio: 9/12;
  margin: 0 0 5px 0;
  padding: 5px;
  border-radius: 5%;
}
ul.images li:hover{
  padding: 0;
  border: 2px solid rgba(0,0,0,0.1);
  box-shadow: 0 0 5px rgba(0,0,0,0);
  border-radius: 6%;
}
ul.images li:last-child{
  margin: 0;
}
.no-scrollbar {
  overflow-y: scroll;
  scrollbar-width: none; /*mozilla*/
}
.no-scrollbar::-webkit-scrollbar {
  display: none; /*chrome*/
}
div.zoom {
  background-position: 50% 50%;
  position: relative;
  height: 100%;
  /*width: 100%;*/
  overflow: hidden;
  cursor: zoom-in;
  background-repeat: no-repeat;
  border-radius: 3%;
}
div.zoom .img-client-first:hover {
  opacity: 0;
}
div.zoom .img-client-first {
  transition: opacity 0.5s;
  display: block;
  height: 100%;
  margin: 0 auto;
  opacity: 1;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
.alignment{
  line-height:60px;
  margin:0;
  text-align:center;
  padding: 0;
}
.carousel-btn{
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-color: white;
}
.carousel-btn{
  opacity: 0;
}
.carousel-btn:hover{
  color: #d946d2;
}
</style>