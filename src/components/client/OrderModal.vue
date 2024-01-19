<template>
  <div class="modal fade mt-5" id="orderModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Создание заказа</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-2">
            <label class="form-label mb-0">Имя</label>
            <input type="text" class="form-control h-50" v-model="user.name">
          </div>
          <div class="mb-2">
            <label class="form-label mb-0">Номер телефона</label>
            <div class="input-group mb-3">
              <span class="input-group-text h-50">+993</span>
              <input type="tel" class="form-control h-50" v-model="user.phone" placeholder="********">
            </div>
          </div>
          <div class="mb-2">
            <label class="form-label mb-0">Адрес доставки</label>
            <textarea type="text" class="form-control" v-model="user.address" placeholder="Напишите адрес доставки"></textarea>
          </div>
          <div class="mb-2">
            <label class="form-label mb-0">Комментарий к заказу</label>
            <textarea type="text" class="form-control" v-model="user.comment" placeholder="Здесь вы можете оставить дополнительную информацию для заказа"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Отмена</button>
          <button type="button" class="btn btn-primary" @click="sendOrders">Отправить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import func from "../../js/functions";
import axios from "axios";

export default {
  name: "OrderModal",
  data(){
    return {
      modalObject: null,
      orders: null,
      user: {
        name: '',
        phone: '',
        comment: '',
        address: ''
      }
    }
  },
  props: {
    object: {
      required: true
    }
  },
  methods: {
    closeModal(changed = false, id) {
      this.modalObject.hide();
      this.$emit('updateParent', {
        changed: changed,
        order_id: id
      })
    },
    async sendOrders() {
      if (this.user.name.replace(/\s/g, "") === '') {
        func.toastElList('Напишите своё имя');
        return;
      }

      if (this.user.phone.replace(/\s/g, "") === '') {
        func.toastElList('Напишите номер телефона');
        return;
      }

      const validatePhoneNumberRegex = /^\d{2}?\d{6}$/;
      if (!validatePhoneNumberRegex.test(this.user.phone)) {
        func.toastElList('Неверный формат телефонного номера');
        return;
      }

      let products = [];

      this.object.forEach((row, index) => {
        products[index] = {
          id: row.id,
          name: row.name,
          price: row.price,
          discount: row.discount,
          count: row.count,
        }
      })

      let id;
      try {
        await axios.post(`https://etaganov-trade.ru/api/v1/client-orders`, {
          token: localStorage.access_token,
          params: {
            user: this.user,
            orders: products
          }
        }).then(response => (
            id = response.data.data.id
        ))
      } catch (exception) {
        console.log(exception.response.data.msg)
        func.toastElList('Произошла ошибка. Приносим свои извинения. Попробуйте позже');
        return;
      }

      this.closeModal(true, id)
    }
  },
  mounted() {
    this.orders = JSON.parse(JSON.stringify(this.object));
    this.modalObject = new bootstrap.Modal(document.getElementById('orderModal'), {});
    this.modalObject.show()
  }
}
</script>

<style scoped>

</style>