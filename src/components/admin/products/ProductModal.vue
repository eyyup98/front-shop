<template>

  <div id="myModal" class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" @click="eventHide">
    <div class="modal-dialog modal-lg">
      <div class="modal-content card bg-light mb-3">
        <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
        <div class="card bg-light p-mod" v-else>
          <label>Каталог</label>
          <select class="form-control form-control-sm" v-if="product.id === ''" v-model="product.catalog_id" @change="product.group_id = null; product.subgroup_id = null">
            <option v-for="item in catalogs" :value="item.id">{{item.name}}</option>
          </select>
          <span class="ml-3" v-else>{{product.catalog_name}}</span>
          <label class="mt-2">Группа</label>
          <select class="form-control form-control-sm" v-if="product.id === ''" v-model="product.group_id" @change="product.subgroup_id = null">
            <option v-if="product.catalog_id === null" :value="null">Сперва выберите каталог</option>
            <template v-for="item in groups">
              <option v-if="item.catalog_id === product.catalog_id" :value="item.id">{{ item.name}}</option>
            </template>
          </select>
          <span class="ml-3" v-else>{{product.group_name}}</span>
          <label class="mt-2" v-if="product.subgroup_name || product.id === ''">Подгруппа</label>
          <select class="form-control form-control-sm" v-if="product.id === ''" v-model="product.subgroup_id">
            <template v-for="item in subgroups">
              <option v-if="item.parent_id === product.group_id" :value="item.id">{{ item.name}}</option>
            </template>
          </select>
          <span class="ml-3" v-else>{{product.subgroup_name}}</span>

          <label class="mt-2">Название товара</label>
          <input class="form-control form-control-sm px-3  p-2" type="text" v-model="product.name">

          <div style="display: flex; flex-direction:column; margin: 0 0 10px 0;" v-for="(row) in params">
            <div v-if="row.catalog_id === product.catalog_id && (row.group_id === product.group_id || row.group_id === product.subgroup_id)">

              <label class="mt-2" v-if="row.params.length > 0">Параметры</label>
              <br><label class="ml-5 my-0" v-if="row.params.length > 0">{{ row.name }}</label>
              <div class="form-group row d-flex justify-content-center ml-5 pl-5 my-0" v-for="(row2) in row.params">
                <label class="col-sm-6 col-form-label col-form-label-sm">{{ row2.name }}</label>
                <div class="col-sm-6">
                  <input class="form-control form-control-sm" type="text" v-model="row2.value">
                </div>
              </div>

            </div>
          </div>
          <div class="form-group mt-0">
            <label>Загрузить изображение</label>
            <input type="file" class="form-control-file"  ref="file" v-on:change="handleFileUpload($event)">
          </div>

          <Carousel :wrap-around="false" :breakpoints="breakpoints" v-if="preview_img.length > 0">
            <Slide v-for="(slide, index) in preview_img" :key="true">
              <div class="d-flex flex-column align-content-between flex-wrap">
                <div class="d-flex justify-content-center">
<!--                    <label style="overflow: hidden; font-size: 10px">{{product.img[index].name}}</label>-->
                  <button class="btn btn-dark" style="height: 30px" @click="deleteImg(index, product.img[index])">d</button>
                </div>
                <div class="carousel__item">
                  <div class="img" v-bind:style="{ backgroundImage: 'url(' + slide + ')' }"></div>
                </div>
              </div>
            </Slide>
            <template #addons>
              <Navigation />
              <Pagination />
            </template>
          </Carousel>

          <label class="">Цена</label>
          <input class="form-control form-control-sm px-3  p-2" type="text" v-model="product.price">

          <label class="mt-2">Скидка (указывается старая цена для разницы)</label>
          <input class="form-control form-control-sm px-3  p-2" type="text" v-model="product.discount">


          <div class="form-check form-check-inline mt-2">
            <input class="form-check-input" type="checkbox" name="catalog-active" :checked="product.active" @click="active">
            <label class="form-check-label">Активный</label>
          </div>

          <div class="d-flex justify-content-center mt-3">
            <button class="btn btn-secondary btn-sm w-25 " @click="closeModal">Отмена</button>
            <button class="btn btn-primary btn-sm w-25 ml-5" @click="save">Сохранить</button>
          </div>
          <span id="modal-message"></span>
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
  watch: {
    modal: function () {
      this.closeModal()
    }
  },
  methods: {
    eventHide(){
      $('#myModal').on('hide.bs.modal',( function (e) {
        this.modal = false
      }).bind(this))
    },
    closeModal(changed = false) {
      $('#myModal').modal('hide')
      this.$emit('updateParent', {
        changed: changed
      })
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
      let index = this.product.img.length
      this.product.img[index] = this.$refs.file.files[0];
      this.preview_img[index] = URL.createObjectURL(e.target.files[0]);
    },
    deleteImg(index, object){
      if (confirm(`Вы действителдьно хотите удалить изображение "` + object.name + '"')) {
        this.product.img.splice(index, 1);
        this.preview_img.splice(index, 1);
        this.deleteImgArr[this.deleteImgArr.length] = {id: object.id}
        console.log(this.deleteImgArr)
      }
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
      console.log('this.params')
      console.log(this.params)
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
    $('#myModal').modal('show')
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
    // console.log('this.product')
    // console.log(this.product)
  }
}
</script>

<style scoped>
span{
  font-size: 18px;
}
.carousel__item {
  height: 120px;
  margin: 5px 0 0 0;
  width: 100px;
  justify-content: center;
  display: flex;
  flex-direction:column;
}

.carousel__slide {
  padding: 10px;
}
/*.carousel__prev,*/
/*.carousel__next {*/
/*  background-color: #2c3e50;*/
/*  box-sizing: content-box;*/
/*}*/
.img{
  /*width: 100%;*/
  height: 100%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  /*background-size: auto 100%;*/
  background-size: cover;
  border-radius: 8px;
}
.img-title{
  display: flex; justify-content: space-between;
}
.img-slide{
  display: flex;
  flex-direction:column;
  font-size: 16px;
  margin: 0 auto;
  width: 100%;
  min-width: 100px;
  max-width: 150px;
  /*align-items:flex-start;*/
}
button{
  box-shadow: none;
}
button:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>