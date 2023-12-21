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
      <div class="d-flex m-auto">
      <div class="p-2 w-50 d-flex" style="height: 85vh">
        <div class="img-list w-25" v-if="product.img.length > 1">
          <ul class="images h-100 no-scrollbar">
            <li v-for="(img, index) in product.img" @click="img_index = index">
              <div class="w-100 img-list-client h-100"
                   v-bind:style="{ backgroundImage: 'url(' + baseUrl+img.src + ')' }">
              </div>
            </li>
          </ul>
        </div>
        <div class="ps-1 w-75 h-100">
          <div v-if="product.img.length !== 0" class="img-client-first"
               v-bind:style="{ backgroundImage: 'url(' + baseUrl+product.img[img_index].src + ')' }"></div>
          <div v-else class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
        </div>
      </div>
      <div class="p-2 flex-column flex-column">
        <h5 class="fw-bolder">{{ product.name }}</h5>
        <div class="d-flex flex-row align-items-end">
          <span class="fw-bold d-flex align-items-end" style="font-size: 28px">{{ product.price }}</span>
          <span class="text-decoration-line-through ms-4" style="color: #656565" v-if="Number(product.discount) !== 0">{{ product.discount }}</span>
        </div>
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
import { defineComponent } from 'vue'

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
      img_index: 0
    }
  },
  methods: {
    async updateParentMethod(data) {
      this.search = {
        catalog_id: data.search.catalog_id ?? null,
        group_id: data.search.group_id ?? null,
      }

      await this.getData()
    },
    async getData() {
      this.loading = true
      await axios.get(`http://back.ey/api/v1/client-products/${this.id}`, {
        params: {
        }
      }).then(response => (
          this.product = response.data
      ))
      this.loading = false
    },
  },
  async mounted() {
    await this.getData()
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
  height: 100%;
  /*height: 90%;*/
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 2%;
}
.img-list-client {
  width: 100%;
  /*height: 200px;*/
  /*height: 90%;*/
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 5%;
}
ul.images {
  margin: 0;
  padding: 0;
  display:flex;
  flex-direction:column;
  justify-content: space-between;
  overflow: scroll;
}
ul.images li {
  flex: 0 0 auto;
  width: 100%;
  height: 40%;
  margin: 0 0 5px 0;
  padding: 5px;
}
ul.images li:hover{
  padding: 0;
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
</style>