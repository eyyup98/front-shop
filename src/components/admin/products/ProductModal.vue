<template>

  <div class="modal">
    <div class="loading" v-if="loading === true" style="background-color: white; height: 50px">Загрузка данных...</div>
    <div class="window" v-on:keyup.esc="closeModal" v-else>

      <label>Каталог</label>
      <select v-if="product.id === ''" v-model="product.catalog_id" @change="product.group_id = null; product.subgroup_id = null">
        <option v-for="item in catalogs" :value="item.id">{{item.name}}</option>
      </select>
      <span v-else>{{product.catalog_name}}</span>
      <label>Группа</label>
      <select v-if="product.id === ''" v-model="product.group_id" @change="product.subgroup_id = null">
        <option v-if="product.catalog_id === null" :value="null">Сперва выберите каталог</option>
        <template v-for="item in groups">
          <option v-if="item.catalog_id === product.catalog_id" :value="item.id">{{ item.name}}</option>
        </template>
      </select>
      <span v-else>{{product.group_name}}</span>
      <label v-if="product.subgroup_name || product.id === ''">Подгруппа</label>
      <select v-if="product.id === ''" v-model="product.subgroup_id">
        <template v-for="item in subgroups">
          <option v-if="item.parent_id === product.group_id" :value="item.id">{{ item.name}}</option>
        </template>
      </select>
      <span v-else>{{product.subgroup_name}}</span>

      <label>Название товара</label>
      <input type="text" v-model="product.name">

      <div style="display: flex; flex-direction:column; margin: 0 0 10px 0;" v-for="(row) in params">
        <div v-if="row.catalog_id === product.catalog_id && row.group_id === (product.subgroup_id ?? product.group_id)">
          <label v-if="row.params.length > 0">{{ row.name }}</label>
          <div style=" margin: 5px 0;font-size:18px; display: flex;justify-content:flex-end;" v-for="(row2) in row.params">
  <!--          <div>{{row2}}</div>-->
            <div style="width: 95%;display: flex; flex-wrap:wrap;">
              <label style=" flex: 0 1 50%;">{{ row2.name }}</label>
              <input style=" flex: 0 1 50%;" type="text" v-model="row2.value" @focusout="testtt(row)">
            </div>
          </div>
        </div>
      </div>
      <label>File
        <input type="file" ref="file" v-on:change="handleFileUpload($event)"/>
      </label>

      <Carousel :wrap-around="false" :breakpoints="breakpoints" v-if="preview_img.length > 0">
        <Slide v-for="(slide, index) in preview_img" :key="true">
          <div class="img-slide">
            <div class="img-title">
              <label style="overflow: hidden; max-width: 100px">{{product.img[index].name}}</label>
              <button @click="deleteImg(index)">d</button>
            </div>
            <div class="carousel__item">
              <img v-if="slide" :src="slide" class="img" alt=""/>
            </div>
          </div>
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>

      <label>Цена</label>
      <input type="text" v-model="product.price">
      <label>Скидка (указывается старая цена для разницы)</label>
      <input type="text" v-model="product.discount">

      <label>Активный</label>
      <input type="checkbox" name="catalog-active" :checked="product.active" @click="active">

      <button class="button" @click="closeModal">Отмена</button>
      <button class="button" @click="save">Сохранить</button>
      <span id="modal-message"></span>
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
      test: [],
      subgroups: null,
      params: null,
      product: null,
      loading: true,
      input_text: null,
      deleteArray: [],
      preview_img: [],
      breakpoints: {
        670: {
          itemsToShow: 1,
          snapAlign: 'start',
        },
        980: {
          itemsToShow: 2,
          snapAlign: 'start',
        },
        1024: {
          itemsToShow: 3,
          snapAlign: 'start',
        },
      }
    }
  },
  methods: {
    testtt(tt){
      console.log(tt)
    },
    closeModal() {
      this.$emit('updateParent', {
        changed: false,
      })
    },
    async save() {
      this.product.params = []
      this.params.forEach((function(eachEle) {
        eachEle.params.forEach((function(eachEle2) {
          if (typeof eachEle2.value !== "undefined" && eachEle2.value.replace(/\s/g, "") !== '') {
            this.product.params[this.product.params.length] = {
              param_id: eachEle2.id,
              name: eachEle2.value
            }
          }
        }).bind(this))
      }).bind(this))

      if (this.product.catalog_id === null) {
        this.errorMessage('Необходимо выбрать каталог')
      }
      if (this.product.group_id === null) {
        this.errorMessage('Необходимо выбрать группу')
      }
      if (this.product.name.replace(/\s/g, "") === '') {
        this.errorMessage('Необходимо заполнить название')
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
          },
        })
      } catch (exception) {
        this.errorMessage(exception.response.data.msg ?? 'Ошибка при сохранении')
        return;
      }

      this.$emit('updateParent', {
        changed: true
      })
    },
    handleFileUpload(e){
      let index = this.product.img.length
      this.product.img[index] = this.$refs.file.files[0];
      this.preview_img[index] = URL.createObjectURL(e.target.files[0]);
      // console.log(this.product.img)
      // console.log(this.preview_img[index])
    },
    deleteImg(index){
      this.product.img.splice(index, 1);
      this.preview_img.splice(index, 1);
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
    this.loading = true
    if (this.objectParent.id === '') {
      this.product = JSON.parse(JSON.stringify(this.objectParent));
    } else {
      await this.getProduct(this.objectParent.id);
      await this.getProductImg(this.objectParent.id);
    }
    await this.getCatalogs();
    await this.getGroups();
    await this.getSubgroups();
    await this.getParams();
    this.loading = false
    console.log(this.product)
  }
}
</script>

<style scoped>
span{
  font-size: 18px;
}
.carousel__item {
  max-height: 150px;
  margin: 5px 0 0 0;
  width: 100%;
  border-radius: 8px;
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
  /*width: 150px;*/
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
  /*align-items:flex-start;*/
}
button{
  box-shadow: none;
}
button:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>