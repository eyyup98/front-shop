<template>

  <div class="modal fade" id="productModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="loading h4" v-if="loading === true">Загрузка данных...</div>
      <div class="modal-content" v-else>
        <div class="modal-header">
          <h1 v-if="product.id === ''" class="modal-title fs-5">Создание товара</h1>
          <h1 v-else class="modal-title fs-5">Редактирование товара</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeModal"></button>
        </div>
        <div class="modal-body d-flex flex-column">
          <label>Каталог</label>
          <select class="form-control form-control-sm" v-if="product.id === ''" v-model="product.catalog_id" @change="product.group_id = null; product.subgroup_id = null">
            <option v-for="item in catalogs" :value="item.id">{{item.name}}</option>
          </select>
          <span class="ms-3" v-else>{{product.catalog_name}}</span>
          <label class="mt-2">Группа</label>
          <select class="form-control form-control-sm" v-if="product.id === ''" v-model="product.group_id" @change="product.subgroup_id = null">
            <option v-if="product.catalog_id === null" :value="null">Сперва выберите каталог</option>
            <template v-for="item in groups">
              <option v-if="item.catalog_id === product.catalog_id" :value="item.id">{{ item.name}}</option>
            </template>
          </select>
          <span class="ms-3" v-else>{{product.group_name}}</span>
          <label class="mt-2" v-if="product.subgroup_name || product.id === ''">Подгруппа</label>
          <select class="form-control form-control-sm" v-if="product.id === ''" v-model="product.subgroup_id">
            <template v-for="item in subgroups">
              <option v-if="item.parent_id === product.group_id" :value="item.id">{{ item.name}}</option>
            </template>
          </select>
          <span class="ms-3" v-else>{{product.subgroup_name}}</span>

          <label class="mt-2">Название товара</label>
          <input class="form-control form-control-sm px-3 p-2" type="text" v-model="product.name">

          <div v-for="(row) in params">
            <div v-if="row.catalog_id === product.catalog_id && (row.group_id === product.group_id || row.group_id === product.subgroup_id)">

              <label class="mt-2" v-if="row.params.length > 0">Параметры</label>
              <br><label class="ms-5 my-0" v-if="row.params.length > 0">{{ row.name }}</label>
              <div class="form-group row d-flex justify-content-center ms-5 ps-5 mt-1" v-for="(row2) in row.params">
                <label class="col-sm-6 col-form-label col-form-label-sm">{{ row2.name }}</label>
                <div class="col-sm-6">
                  <input class="form-control form-control-sm" type="text" v-model="row2.value">
                </div>
              </div>

            </div>
          </div>
          <div class="mt-2">
            <label class="form-label">Загрузить изображение</label>
            <input class="form-control form-control-sm" type="file" ref="file" v-on:change="handleFileUpload($event)" multiple>
          </div>

          <Carousel :wrap-around="false" :breakpoints="breakpoints" v-if="preview_img.length > 0">
            <Slide v-for="(slide, index) in preview_img" :key="true" class="mt-2">
                <div class="carousel__item">
                  <div class="img" v-bind:style="{ backgroundImage: 'url(' + slide + ')' }"></div>
                  <div class="delete-img" @click="deleteImg(index, product.img[index])"
                       v-bind:style="{ backgroundImage: 'url(\'../../src/assets/icons/delete-img2.png\')' }"></div>
                </div>
            </Slide>
            <template #addons>
              <Navigation />
              <Pagination />
            </template>
          </Carousel>

          <label class="mt-2">Цена</label>
          <input class="form-control form-control-sm px-3 p-2" type="text" v-model="product.price">

          <label class="mt-2">Скидка (указывается старая цена для разницы)</label>
          <input class="form-control form-control-sm px-3 p-2" type="text" v-model="product.discount">


          <div class="form-check form-check-inline mt-2">
            <input class="form-check-input" type="checkbox" name="catalog-active" :checked="product.active" @click="active">
            <label class="form-check-label">Активный</label>
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
import axios from "axios";

import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
// ^\d{1,2}(?:\.\d{1,2})?$|^\.\d{1,2}$

export default {
  name: "ProductModal",
  components:{
    Carousel, Slide, Pagination, Navigation
  },
  props: {
    objectParent: {
      required: true
    }
  },
  data(){
    return {
      catalogs: null,
      groups: null,
      subgroups: null,
      params: null,
      product: null,
      loading: true,
      modalObject: null,
      modal: true,
      input_text: null,
      deleteImgArr: [],
      preview_img: [],
      breakpoints: {
        100: {
          itemsToShow: 1,
          snapAlign: 'start',
        },
        380: {
          itemsToShow: 3,
          snapAlign: 'start',
        },
        992: {
          itemsToShow: 5,
          snapAlign: 'start',
        },
      }
    }
  },
  methods: {
    closeModal(changed = false) {
      this.modalObject.hide();
      this.$emit('updateParent', {
        changed: changed
      })
    },
    active(){
      if (this.group.active === 1) {
        this.group.active = 0
      } else if (this.group.active === 0) {
        this.group.active = 1
      }
    },
    async save() {
      this.product.params = []
      this.params.forEach((function(eachEle) {
        eachEle.params.forEach((function(eachEle2) {
          if (typeof eachEle2.value !== "undefined") {
            this.product.params[this.product.params.length] = {
              param_id: eachEle2.id,
              name: eachEle2.value
            }
          }
        }).bind(this))
      }).bind(this))

      if (this.product.catalog_id === null) {
        this.errorMessage('Необходимо выбрать каталог')
        return
      }
      if (this.product.group_id === null) {
        this.errorMessage('Необходимо выбрать группу')
        return
      }
      if (this.product.name.replace(/\s/g, "") === '') {
        this.errorMessage('Необходимо заполнить название')
        return
      }

      try {
        let id = ''
        await axios.post(`http://back.ey/api/v1/products/${this.product.id}`, {
          token: localStorage.access_token,
          params: {
            name: this.product.name,
            catalog_id: this.product.catalog_id,
            group_id: this.product.group_id,
            subgroup_id: this.product.subgroup_id,
            price: this.product.price,
            discount: this.product.discount,
            active: this.product.active,
            params: this.product.params,
          }
        }).then(response => (
            id = '/' + response.data.product_id
        ))

        let formData = new FormData();
        formData.append("images", this.product.img);
        await axios.post(`http://back.ey/api/v1/products-img${id}`,
            this.product.img
            , {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              params: {
                token: localStorage.access_token,
                delete: this.deleteImgArr
              },
            })
      } catch (exception) {
        this.errorMessage(exception.response.data.msg ?? 'Ошибка при сохранении')
        return;
      }

      this.closeModal(true)
    },
    handleFileUpload(e){
      for (let i = 0; i < this.$refs.file.files.length; i++ ){
        let index = this.product.img.length
        this.product.img[index] = this.$refs.file.files[i];
        this.preview_img[index] = URL.createObjectURL(e.target.files[i]);
      }
    },
    deleteImg(index, object){
      console.log(this.preview_img)
      if (confirm(`Вы действителдьно хотите удалить изображение "` + object.name + '"')) {
        this.product.img.splice(index, 1);
        this.preview_img.splice(index, 1);
        this.deleteImgArr[this.deleteImgArr.length] = {id: object.id}
      }
      console.log(this.preview_img)
    },
    errorMessage(msg = 'Необходимо все поля'){
      document.getElementById('modal-message').innerHTML  = msg
      setTimeout(() => {
        document.getElementById('modal-message').innerHTML  = ''
      }, 2000);
    },
    async getCatalogs() {
      await axios.get('http://back.ey/api/v1/catalogs', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.catalogs = response.data
      ))
    },
    async getGroups() {
      await axios.get('http://back.ey/api/v1/groups/parents', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.groups = response.data
      ))
    },
    async getSubgroups() {
      await axios.get('http://back.ey/api/v1/groups/childs', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.subgroups = response.data
      ))
    },
    async getParams() {
      await axios.get('http://back.ey/api/v1/params-title', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.params = response.data
      ))
    },
    async getProduct(id) {
      await axios.get(`http://back.ey/api/v1/products/${id}`, {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.product = response.data
      ))
      this.params = this.product.params
    },
    async getProductImg(id) {
      await axios.get(`http://back.ey/api/v1/products-img`, {
        params: {
          token: localStorage.access_token,
          product_id: id
        }
      }).then(response => (
          this.product.img = response.data
      ))
      this.product.img.forEach((function(eachEle) {
        this.preview_img[this.preview_img.length] = 'http://back-img.ey' + eachEle.src
      }).bind(this))
    },
  },
  async mounted() {
    this.modalObject = new bootstrap.Modal(document.getElementById('productModal'), {});
    this.modalObject.show()

    this.loading = true
    if (this.objectParent.id === '') {
      this.product = JSON.parse(JSON.stringify(this.objectParent));
      await this.getParams();
    } else {
      await this.getProduct(this.objectParent.id);
      await this.getProductImg(this.objectParent.id);
    }
    await this.getCatalogs();
    await this.getGroups();
    await this.getSubgroups();
    this.loading = false
  }
}
</script>

<style scoped>
span{
  font-size: 18px;
}
.carousel__item {
  height: 120px;
  margin: 20px 0 0 0;
  width: 100px;
  justify-content: center;
  display: flex;
  flex-direction:column;
}
.img{
  height: 100%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 8px;
}
.delete-img{
  position: absolute;
  width: 40px;
  min-height: 40px;
  bottom: 0;
  right: 0;
  background-position: 50% 50%;
  background-size: cover;
}
button{
  box-shadow: none;
}
button:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>