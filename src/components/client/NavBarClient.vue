<template>
  <div class="wrapper">
    <div class="wrapper-navbar">
      <div class="header fixed-top">
        <nav class="navbar">
          <div class="container-fluid d-flex flex-nowrap">
            <div>
              <button class="btn btn other-btn position-relative d-flex flex-column p-0 view-cat-header" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft"
                      aria-controls="offcanvasLeft" @click="toggleOpenCat" id="OffcanvasBtn">
                <img v-if="!openCat" class="d-block m-auto" src="@/assets/icons/list.png" width="45"/>
                <img v-else class="d-block m-auto" src="@/assets/icons/cross.png" width="45"/>
              </button>

              <div class="offcanvas offcanvas-start offcanvas-style" tabindex="-1" data-bs-scroll="false" id="offcanvasLeft"
                   aria-labelledby="offcanvasLeftLabel" ref="offcanvasElement" data-bs-backdrop="false">
                <div class="accordion w-100">
                  <div class="accordion-item" v-for="(itemC, index) in catalogs" :key="index">
                    <h2 class="accordion-header" :id="'panelsStayOpen-headingOne'+index" @click="selectGroups(itemC.groups, index)">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#panelsStayOpen-collapseOne'+index" aria-expanded="true" :aria-controls="'panelsStayOpen-collapseOne'+index">
                        {{ itemC.name }}
                      </button>
                    </h2>
                    <div v-if="!loading && catalogs[index].groups !== null" :id="'panelsStayOpen-collapseOne'+index"
                         class="accordion-collapse collapse" :aria-labelledby="'panelsStayOpen-headingOne'+index">
                      <div class="accordion-body group-list" v-for="(item, subIndex) in catalogs[index].groups" :key="subIndex" @click="selectSearch(item)">
                        <div class="group-text">{{ item.name }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <router-link class="navbar-brand nb-color" to="/"><div class="pvw-title"><span>E-Trade</span></div></router-link>
            <div class="search-h position-relative card-pr-name">
              <input id="searchInput" class="form-control none-focus search" type="search" placeholder="Найти в магазине" aria-label="Search"
                     @input="searchMethod" @keyup.enter="enterSearch" v-model="searchValue" @focus="viewSearchCache">
              <button type="button" class="btn-close position-absolute none-focus" aria-label="Close"
                      v-if="searchValue !== ''" @click="searchValue = ''"></button>
              <div class="dropdown" v-if="searchValue !== '' || searchCacheList.length > 0">
                <ul class="dropdown-menu d-inline-block w-100 search-list-block" v-if="searchList.length > 0 || searchCacheList.length > 0">
                  <li class="dropdown-item d-inline-block text-truncate search-list-text" v-for="item in searchList">
                    <img class="me-1" src="@/assets/icons/search.png" width="15" height="15"/>
                    <span class="card-pr-name">{{ item.name }}</span>
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
            <div class="cart-block view-cat-header">
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

      <div class="footer fixed-bottom">
        <nav class="navbar nav-footer">
          <div class="container-fluid d-flex flex-nowrap flex-footer">
            <div class="view-cat-footer">
              <button class="btn other-btn position-relative d-flex flex-column p-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft"
                      aria-controls="offcanvasLeft" @click="toggleOpenCat" id="OffcanvasBtn2">
                <img v-if="!openCat" class="d-block m-auto" src="@/assets/icons/list.png" width="35"/>
                <img v-else class="d-block m-auto" src="@/assets/icons/cross.png" width="35"/>
              </button>
            </div>
            <div class="cart-block view-cat-footer">
              <button class="btn other-btn position-relative d-flex flex-column p-0" @click="selectHome">
                <img class="d-block m-auto" src="@/assets/icons/home.png" width="40"/>
              </button>
            </div>
            <div class="cart-block view-cat-footer">
              <router-link to="/cart">
                <button class="btn other-btn position-relative d-flex flex-column p-0">
                  <div v-if="cartCount !== 0" class="cart-count d-flex align-items-center justify-content-center"><span>{{ cartCount }}</span></div>
                  <img class="d-block m-auto" src="@/assets/icons/cart.png" width="35"/>
                </button>
              </router-link>
            </div>
          </div>
        </nav>
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
    selectHome(){
      window.localStorage.removeItem('productsList')
      this.$emit('updateParent', {
        search: {
          catalog_id: null,
          group_id: null,
        }
      })
    },
    toggleOpenCat() {
      this.openCat = !this.openCat;
      this.groups = null;
    },
    selectSearch(object){
      window.localStorage.removeItem('productsList')
      this.$emit('updateParent', {
        search: object
      })
      const width = window.innerWidth;
      console.log(width)
      if (width <= 800) {
        let hideBtn2 = document.getElementById('OffcanvasBtn2')
        hideBtn2.click()
      } else {
        let hideBtn = document.getElementById('OffcanvasBtn')
        hideBtn.click()
      }
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
@import '../../assets/client/font-size.css';
</style>
