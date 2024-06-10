<template>
  <div class="wrapper">
    <div class="wrapper-navbar">
      <div class="header fixed-top">
        <nav class="navbar">
          <div class="container-fluid d-flex flex-nowrap">
            <div>
              <button class="btn cat-btn" id="OffcanvasBtn" @click="openCat = openCat === false; groups = null" data-bs-toggle="offcanvas"
                      data-bs-target="#myOffcanvas" aria-controls="offcanvasWithBothOptions">
                <span v-if="openCat === false">☰</span>
                <span v-else>✕</span>
              </button>
            </div>
            <router-link class="navbar-brand nb-color" to="/"><div class="pvw-title"><span>E-Trade</span></div></router-link>
            <div class="w-75 ms-3 position-relative">
              <input id="searchInput" class="form-control me-2 h-100 none-focus search" type="search" placeholder="Найти в магазине" aria-label="Search"
                     @input="searchMethod" @keyup.enter="enterSearch" v-model="searchValue" @focus="viewSearchCache">
              <button type="button" class="btn-close position-absolute none-focus" aria-label="Close"
                      v-if="searchValue !== ''" @click="searchValue = ''"></button>
              <div class="dropdown" v-if="searchValue !== '' || searchCacheList.length > 0">
                <ul class="dropdown-menu d-inline-block w-100 search-list-block" v-if="searchList.length > 0 || searchCacheList.length > 0">
                  <li class="dropdown-item d-inline-block text-truncate search-list-text" v-for="item in searchList">
                    <img class="me-2" src="@/assets/icons/search.png" width="20" height="20"/>
                    {{ item.name }}
                  </li>
                  <li class="dropdown-item d-inline-block text-truncate d-flex justify-content-between" v-for="(item, index) in searchCacheList">
                    <div>
                      <img class="me-2" src="@/assets/icons/searchReset.png" width="20" height="20"/>
                      {{ item }}
                    </div>
                    <button type="button" class="btn-close" aria-label="Close" @click.native="deleteSearchList(index)"></button>
                  </li>
                </ul>
              </div>
            </div>
            <div class="cart-block">
              <router-link to="/cart">
                <button class="btn other-btn position-relative d-flex flex-column p-0">
                  <div v-if="cartCount !== 0" class="cart-count d-flex align-items-center justify-content-center"><span>{{ cartCount }}</span></div>
                  <img class="d-block m-auto" src="@/assets/icons/cart.png" width="45"/>
                  <!--              <span style="font-size: 14px; line-height: 0">Корзина</span>-->
                </button>
              </router-link>
            </div>
          </div>
        </nav>
      </div>

      <div class="offcanvas offcanvas-start offcanvas-style" data-bs-scroll="false" data-bs-backdrop="static" tabindex="-1" id="myOffcanvas"
           aria-labelledby="staticBackdropLabel">
        <div class="offcanvas-body w-100">
          <div class="d-flex flex-nowrap ">
            <div class="accordion w-100">
              <div class="accordion-item"  v-for="(itemC, index) in catalogs">
                <h2 class="accordion-header" :id="'panelsStayOpen-headingOne'+index" @click="selectGroups(itemC.groups, index)">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#panelsStayOpen-collapseOne'+index" aria-expanded="true" :aria-controls="'panelsStayOpen-collapseOne'+index">
                    {{ itemC.name }}
                  </button>
                </h2>
                <div v-if="loading === false && catalogs[index].groups !== null" :id="'panelsStayOpen-collapseOne'+index"
                     class="accordion-collapse collapse" :aria-labelledby="'panelsStayOpen-headingOne'+indexCatalog">
                  <div class="accordion-body group-list" v-for="item in catalogs[index].groups" @click="selectSearch(item);">
                    <div class="group-text">{{ item.name }}</div>
                  </div>
                </div>
              </div>

              <!--              <div class="list-group list-group-flush w-100">-->
              <!--                <button v-for="(item, index) in catalogs" type="button" class="list-group-item list-group-item-action text-nowrap none-border pe-5"-->
              <!--                        @mouseover="selectGroups(item.groups, index)" name="cat-btn" @click="selectSearch(item)">{{ item.name }}-->
              <!--                </button>-->
              <!--              </div>-->
              <!--              <div v-if="loading === false && groups !== null" class="flex-fill w-100 h-100 ps-5">-->
              <!--                <div class="list-group list-group-flush">-->
              <!--                  <button v-for="item in groups" type="button" @click="selectSearch(item)"-->
              <!--                          class="list-group-item list-group-item-action text-nowrap none-border ps-4 p gr-btn">-->
              <!--                    {{ item.name }}-->
              <!--                  </button>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../../router";
import axios from "axios";
import func from "../../js/functions";
import apiClient from '@/api/axios'

// console.log('hello: ' + path.replace(/^\/api/, ''))

export default {
  name: "NavBarClient",
  data(){
    return {
      searchInput: '',
      openCat: false,
      catalogs: null,
      loading: true,
      groups: null,
      searchValue: '',
      searchList: [],
      searchCacheList: [],
      indexCatalog: 0,
    }
  },
  props:{
    cartCount: {
      required: true
    }
  },
  emits: ["updateParent"],
  methods: {
    selectSearch(object){
      window.localStorage.removeItem('productsList')
      this.$emit('updateParent', {
        search: object
      })
      let hideBtn = document.getElementById('OffcanvasBtn')
      hideBtn.click()
      // this.openCat = this.openCat === false;
    },
    viewSearchCache(){
      if (JSON.parse(window.localStorage.getItem('searchCache')) !== null)
        this.searchCacheList = JSON.parse(window.localStorage.getItem('searchCache'));
    },
    deleteSearchList(index){
      this.searchCacheList.splice(index, 1);
      window.localStorage.setItem('searchCache', JSON.stringify(this.searchCacheList))
      document.getElementById('searchInput').focus()
    },
    enterSearch(){
      let searchCache = JSON.parse(window.localStorage.getItem('searchCache'));
      if (searchCache == null)
        searchCache = []
      searchCache.unshift(this.searchValue)
      window.localStorage.setItem('searchCache', JSON.stringify(searchCache))
    },
    selectGroups(groups, index){
      // console.log(this.catalogs[index])
      this.indexCatalog = index
      this.groups = groups
      // let activeBtn = window.document.getElementsByName('cat-btn')

      // activeBtn.forEach( (eachEle) => {
      //   eachEle.className = eachEle.className.replace(" active","")
      // })
      //
      // activeBtn[index].className = activeBtn[index].className + ' active'
    },
    async searchMethod() {
      if (this.searchValue !== '') {
        this.searchCacheList = []
        await apiClient.get('/v1/client-products/search', {
          params: {
            token: localStorage.access_token,
            search: this.searchValue
          }
        }).then(response => (
            this.searchList = response.data
        ))
      } else {
        this.searchList = []
        this.viewSearchCache()
      }
    },
    async getData() {
      this.loading = true
      const catalogsCache = window.localStorage.getItem('catalogList')
      if (catalogsCache === null) {
        try {
          await apiClient.get('/v1/client-catalogs', {})
              .then(response => (
                  this.catalogs = response.data
              ))
        } catch (exception) {
          func.toastElList(exception.response.data.msg);
          return;
        }
        window.localStorage.setItem('catalogList', JSON.stringify(this.catalogs))
      } else {
        this.catalogs = JSON.parse(catalogsCache)
      }

      this.loading = false
    },
  },
  async mounted() {
    await this.getData()
  }
}
</script>

<style scoped>
@import '../../assets/client/nav-bar-1.css';
@import '../../assets/client/nav-bar-1100.css';
@import '../../assets/client/nav-bar-800.css';
</style>
