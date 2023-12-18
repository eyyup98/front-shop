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
          <select class="form-control form-control-sm" v-model="cat_ind" @change="group_ind = null" :disabled="objectParent.id !== ''">
            <option v-if="objectParent.id === ''" v-for="(item, index) in catalogs" :value="index">{{item.name}}</option>
            <option v-else :value="null">{{ product.catalog_name }}</option>
          </select>

          <label class="mt-2">Группа</label>
          <select class="form-control form-control-sm" v-model="group_ind" :disabled="objectParent.id !== ''">
            <option v-if="cat_ind === null && objectParent.id === ''" :value="null">Сперва выберите каталог</option>
            <option v-else-if="cat_ind !== null" v-for="(item, index) in catalogs[cat_ind].groups" :value="index">{{item.name}}</option>
            <option v-else :value="null">{{ product.group_name }}</option>
          </select>

          <label class="mt-2">Название товара</label>
          <input class="form-control form-control-sm px-3 p-2" type="text" v-model="product.name">

          <label class="mt-2">Параметры</label>
          <div class="d-flex justify-content-around mx-5 mb-1" v-if="cat_ind !== null && group_ind !== null && objectParent.id === ''"
               v-for="param in catalogs[cat_ind].groups[group_ind].params">
            <label class="w-50">{{ param.name }}</label>
            <input class="form-control form-control-sm w-50" type="text" v-model="param.product_param_name">
          </div>
          <div class="d-flex justify-content-around mx-5 mb-1" v-if="objectParent.id !== ''" v-for="param in product.params">
            <label class="w-50">{{ param.name }}</label>
            <input class="form-control form-control-sm w-50" type="text" v-model="param.product_param_name">
          </div>

          <div class="mt-2">
            <label class="form-label">Загрузить изображение</label>
            <input class="form-control form-control-sm" type="file" ref="file" v-on:change="handleFileUpload($event)" multiple>
          </div>

          <Carousel :wrap-around="false" :breakpoints="breakpoints" v-if="preview_img.length > 0">
            <Slide v-for="(slide, index) in preview_img" :key="true" class="mt-2">
                <div class="carousel__item">
                  <div class="img" v-bind:style="{ backgroundImage: 'url(' + slide + ')' }"></div>
                  <div class="delete-img shadow-icon" @click="deleteImg(index, product.img[index])"
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
import func from "../../../js/functions"

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
      product: null,
      loading: true,
      modalObject: null,
      deleteImgArr: [],
      preview_img: [],
      cat_ind: null,
      group_ind: null,
      endData: null,
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
    active() {
      if (this.product.active === 1) {
        this.product.active = 0
      } else if (this.product.active === 0) {
        this.product.active = 1
      }
    },
    sendParams() {
      try {
        this.endData = {
          catalog_id: this.product.catalog_id ?? this.catalogs[this.cat_ind].catalog_id,
          group_id: this.product.group_id ?? this.catalogs[this.cat_ind].groups[this.group_ind].group_id,
          name: this.product.name,
          price: this.product.price,
          discount: this.product.discount,
          active: this.product.active,
          params: this.product.params ?? this.catalogs[this.cat_ind].groups[this.group_ind].params
        }
      } catch (exception) {}
    },
    async save() {
      if (this.cat_ind === null && this.objectParent.id === '') {
        func.toastElList('Необходимо выбрать каталог');
        return
      }
      if (this.group_ind === null && this.objectParent.id === '') {
        func.toastElList('Необходимо выбрать группу');
        return
      }
      if (this.product.name.replace(/\s/g, "") === '') {
        func.toastElList('Необходимо заполнить название');
        return
      }

      this.sendParams();

      try {
        let id = ''
        await axios.post(`http://back.ey/api/v1/products/${this.product.id}`, {
          token: localStorage.access_token,
          product: this.endData
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
        func.toastElList(exception.response.data.msg ?? 'Ошибка при сохранении');
        return;
      }

      this.closeModal(true)
    },
    handleFileUpload(e) {
      for (let i = 0; i < this.$refs.file.files.length; i++) {
        let index = this.product.img.length
        this.product.img[index] = this.$refs.file.files[i];
        this.preview_img[index] = URL.createObjectURL(e.target.files[i]);
      }
    },
    deleteImg(index, object) {
      if (confirm(`Вы действителдьно хотите удалить изображение "` + object.name + '"')) {
        this.product.img.splice(index, 1);
        this.preview_img.splice(index, 1);
        this.deleteImgArr[this.deleteImgArr.length] = {id: object.id}
      }
    },
    async getCatalogs() {
      await axios.get('http://back.ey/api/v1/catalogs/for-params', {
        params: {
          token: localStorage.access_token
        }
      }).then(response => (
          this.catalogs = response.data
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
      this.product.img.forEach((function (eachEle) {
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
    } else {
      await this.getProduct(this.objectParent.id);
    }
    await this.getCatalogs();
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