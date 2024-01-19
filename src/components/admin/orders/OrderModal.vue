<template>
  <div class="modal fade" id="orderModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content" v-if="!loading">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Заказ # {{ order.id }}</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="card">
            <div class="card-header">
              <div class="d-flex flex-row">
                <div class="w-50">
                  <label class="form-label mb-0">Имя</label>
                  <label class="form-control form-control-sm">{{ order.buyer_name }}</label>
                </div>
                <div class="w-50 ms-2">
                  <label class="form-label mb-0">Номер телефона</label>
                  <div class="input-group mb-3">
                    <label class="form-control form-control-sm">{{ order.buyer_phone }}</label>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-row mb-2">
                <div class="h-100 w-50">
                  <label class="form-label mb-0">Адрес доставки</label>
                  <label class="form-control form-control-sm" v-if="order.buyer_address !== ''">{{ order.buyer_address }}</label>
                  <label class="form-control form-control-sm text-secondary" v-else>-</label>
                </div>
                <div class="h-100 w-50 ms-2">
                  <label class="form-label mb-0">Комментарий заказчика</label>
                  <label class="form-control form-control-sm" v-if="order.buyer_comment !== ''">{{ order.buyer_comment }}</label>
                  <label class="form-control form-control-sm text-secondary" v-else>-</label>
                </div>
              </div>

              <div class="d-flex flex-column">
                <div v-for="info in order.order_info">
                  <div class="card mt-2">
                    <div class="card-body p-2">
                      <h6><span class="text-secondary">Название: </span>{{ info.name }}</h6>
                      <div class="d-flex justify-content-start">
                        <h6 class="me-4" v-if="info.count > 1"><span class="text-secondary">Цена {{info.count}} шт: </span>
                          {{ new Intl.NumberFormat("ru-RU").format(info.price * info.count) }}
                        </h6>
                        <h6><span class="text-secondary">Цена 1 шт: </span>{{ new Intl.NumberFormat("ru-RU").format(info.price) }}</h6>
                      </div>
                      <h6><span class="text-secondary">Количество штук: </span>{{ info.count }}</h6>
                    </div>
                  </div>
                </div>
                <div class="card mt-2">
                  <div class="card-body p-2">
                  <h5 class="fw-bold">Итого</h5>
                    <h6><span class="text-secondary">Количество штук: </span>{{ productCount }}</h6>
                    <h6><span class="text-secondary">Общая цена: </span>{{ new Intl.NumberFormat("ru-RU").format(productSum) }} <span class="h6 text-secondary">TMT</span></h6>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-body">
              <div class="mb-2">
                <label class="form-label mb-0">Комментарий продовца</label>
                <textarea type="text" class="form-control" v-model="order.other_info" placeholder=""></textarea>
              </div>
              <div>
              <label>Статус заказа</label>
              <select class="form-control h-100" v-model="order.status">
                <option :value="0">Не обработан</option>
                <option :value="1">Принят</option>
                <option :value="2">Завершён</option>
                <option :value="3">Отменён</option>
              </select>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Отмена</button>
          <button type="button" class="btn btn-primary" @click="save">Сохранить</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import func from "../../../js/functions";
import axios from "axios";

export default {
  name: "OrderModal",
  data(){
    return {
      order: null,
      modalObject: null,
      loading: true,
      productCount: 0,
      productSum: 0
    }
  },
  props: {
    object: {
      required: false
    }
  },
  methods: {
    closeModal(changed = false) {
      this.modalObject.hide();
      this.$emit('updateParent', {
        changed: changed
      })
    },
    async save() {
      try {
        await axios.post(`https://etaganov-trade.ru/api/v1/orders/${this.order.id}`, {
          token: localStorage.access_token,
          params: {
            other_info: this.order.other_info,
            status: this.order.status,
          }
        })
      } catch (exception) {
        func.toastElList(exception.response.data.msg);
        return;
      }

      this.closeModal(true)
    }
  },
  mounted() {
    this.order = JSON.parse(JSON.stringify(this.object));
    this.order.order_info.forEach((function (row) {
      this.productCount = row.count + this.productCount
      this.productSum = (row.count * row.price) + this.productSum
    }).bind(this))
    this.modalObject = new bootstrap.Modal(document.getElementById('orderModal'), {});
    this.modalObject.show()
    this.loading = false
  }
}
</script>

<style scoped>

</style>