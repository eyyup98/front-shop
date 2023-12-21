<template>
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
        <div class="product-block my-3 d-flex flex-column p-2 m-auto" v-for="row in products" @click="openProduct(row)">
          <div>
            <div v-if="row.img" class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl+row.img + ')' }"></div>
            <div v-else class="img" v-bind:style="{ backgroundImage: 'url(' + baseUrl + '/images/no-photo.jpg)' }"></div>
          </div>
          <div class="px-2">
            <div class="d-flex justify-content-between pb-0 mb-0">
              <span class="h4">{{row.price}}</span>
              <span class="text-decoration-line-through" v-if="Number(row.discount) !== 0">{{row.discount}}</span>
            </div>
            <h6 class="d-inline-block text-truncate mt-0 pt-0 w-100">{{row.name}}</h6>
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
import { useRouter } from 'vue-router'

onscroll = function(){
  if(window.scrollY+1 >= document.documentElement.scrollHeight-document.documentElement.clientHeight)
    alert('Конец прокрутки');
};

export default {
  name: "ClientPage",
  components: {
    NavBarClient
  },
  data() {
    return {
      loading: true,
      products: null,
      search: {
        catalog_id: null,
        group_id: null
      },
      searchList: [],
      baseUrl: 'http://back-img.ey'
    }
  },
  methods: {
    openProduct(row){
      const routeData = this.$router.resolve({
        name: "product",
        query: { id: row.id },
      });
      window.open(routeData.href, "_blank");
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
      await axios.get(`http://back.ey/api/v1/client-products`, {
        params: {
          catalog_id: this.search.catalog_id,
          group_id: this.search.group_id,
        }
      }).then(response => (
          this.products = response.data
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

.img{
  width: 100%;
  height: 40vh;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 3%;
  /*border: 3px saddlebrown solid;*/
}
.product-block {
  display: flex;
  flex-direction:column;
  /*flex: 0 1 25%;*/
  width: 280px;
  padding: 10px;
  border-radius: 3%;
}
.product-block:hover{
  transform: scale(1.1, 1.1);
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  border-radius: 3%;
}
</style>