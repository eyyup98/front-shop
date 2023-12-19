<template>
<div>
  <div class="loading" v-if="loading === true">Загрузка данных...</div>
  <div v-else>
<!--    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>-->

    <div class="d-flex flex-wrap">
      <div class="product-block my-3 d-flex flex-column p-2 m-auto" v-for="row in products" @click="editProduct(row)">
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

export default {
  name: "ClientPage",
  data() {
    return {
      loading: true,
      products: null,
      search: {
        catalog_index: null,
        group_index: null,
      },
      searchList: [],
      baseUrl: 'http://back-img.ey'
    }
  },
  methods: {
    async getData() {
      this.loading = true

      await axios.get(`http://back.ey/api/v1/products`, {
        params: {
          token: localStorage.access_token,
          catalog_id: this.catalog_id,
          group_id: this.group_id,
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
.container-list{
  padding: 10px;
  display: flex;
  flex-direction:column;
  /*background-color: rgba(0, 0, 0, 0.01);*/
}
</style>