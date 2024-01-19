<template>
  <OrderModal v-if="modal === true" :object="modalOrder" @updateParent="updateParentMethod"></OrderModal>

  <div class="container-block">
    <div class="d-flex flex-column">
      <div class="loading" v-if="loading === true">
        <div class="text-center">
          <div class="spinner-border mt-5 m-auto" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="orders.length > 0">
          <h1 class="h1">Заказы</h1>
          <div class="d-flex justify-content-start mt-0 p-2 cart-list" v-for="(row, index) in orders">
            <div class="card w-100">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div class="d-flex">
                    <h5 class="card-title">{{ '# ' + row.id }}</h5>
                  </div>
                  <div class="card-title p-1 btn btn-warning btn-sm disabled" v-if="row.status === 0">
                    {{ row.status_name }}
                  </div>
                  <div class="card-title p-1 btn btn-success btn-sm disabled" v-if="row.status === 1">
                    {{ row.status_name }}
                  </div>
                  <div class="card-title p-1 btn btn-dark btn-sm disabled" v-if="row.status === 2">
                    {{ row.status_name }}
                  </div>
                  <div class="card-title p-1 btn btn-secondary btn-sm disabled" v-if="row.status === 3">
                    {{ row.status_name }}
                  </div>
                </div>
                <div class="d-flex justify-content-start">
                  <h5 class="card-title"><span class="card-subtitle text-body-secondary fs-6 opacity-75">Дата заказа:</span> {{ row.created_at }}</h5>
                </div>
                <div class="d-flex flex-column">
                  <div class="d-flex flex-row">
                    <h5 class="card-title">
                      <span class="card-subtitle text-body-secondary fs-6 opacity-75">Имя:</span>
                      {{ row.buyer_name }}
                    </h5>
                    <h5 class="card-title ms-4">
                      <span class="card-subtitle text-body-secondary fs-6 opacity-75">Телефон: </span>
                      <span class="fw-semibold">{{ row.buyer_phone }}</span>
                    </h5>
                    <h5 class="card-title ms-4">
                      <span class="card-subtitle text-body-secondary fs-6 opacity-75">Адрес: </span>
                      {{ row.buyer_address }}
                    </h5>
                  </div>
                </div>
                <div v-for="info in row.order_info">
                  <p class="card-text text-body-secondary opacity-50" style="font-size: 16px">{{ info.name }}</p>
                </div>
                <div class="mt-2">
                  <button class="btn btn-primary btn-sm" type="button" @click="openOrder(row)">Открыть заказ</button>
                </div>
              </div>
            </div>
          </div>

          <nav aria-label="Page navigation example" class="mt-3">
            <ul class="pagination justify-content-center pagination-sm">
              <li class="page-item">
                <button class="page-link" @click="selectPagination(null, 'prev')">Назад</button>
              </li>
              <template v-for="pag in pagination">
                <li class="page-item"><button class="page-link" @click="selectPagination(pag, 'number')">{{pag}}</button></li>
              </template>
              <li class="page-item">
                <button class="page-link" @click="selectPagination(null, 'next')">Вперёд</button>
              </li>
            </ul>
          </nav>
        </div>
        <div v-else>
          <h4 class="text-center mt-5">Пусто</h4>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import OrderModal from "./OrderModal.vue";
import func from "../../../js/functions";

export default {
  name: "Orders",
  components: {
    OrderModal
  },
  data() {
    return {
      orders: null,
      loading: true,
      modal: false,
      modalOrder: null,
      pagination: 0,
      activePage: 1,
    }
  },
  methods: {
    openOrder(row){
      this.modalOrder = row
      this.modal = true
    },
    selectPagination(ind, type){
      if (type === 'prev' && this.activePage !== 1) {
        this.activePage = this.activePage - 1
      } else if (type === 'next' && this.activePage !== this.pagination) {
        this.activePage = this.activePage + 1
      } else if (type === 'number' && ind !== this.activePage) {
        this.activePage = ind
      } else {
        return;
      }

      this.getData()
    },
    async getData(){
      this.loading = true
      let data;

      await axios.get(`https://etaganov-trade.ru/api/v1/orders`, {
        params: {
          token: localStorage.access_token,
          pagination: this.activePage
        }
      }).then(response => (
          data = response.data
      ))

      this.orders = data.data

      this.pagination = Math.ceil(data.count / 10)

      this.loading = false
    },
    async updateParentMethod(data) {
      this.modal = false
      if (data.changed === true) {
        this.loading = true
        await this.getData()
        func.toastElList('Сохранено');
      }
    },
  },
  mounted() {
    this.getData()
  }
}
</script>
<style scoped>
.disabled {
  opacity: 1;
}
</style>