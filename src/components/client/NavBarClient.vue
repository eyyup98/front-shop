<template>
  <div class="header" v-bind:style="{ backgroundImage: 'url(\'../../src/assets/fon.jpg\')' }">
    <nav class="navbar w-100">
      <div class="container-fluid d-flex flex-nowrap">
        <router-link class="navbar-brand" to="/">Wildberries</router-link>
        <div>
          <button class="btn cat-btn p-0 " style="font-size:30px" @click="openCat = openCat === false; groups = null" data-bs-toggle="offcanvas"
                  data-bs-target="#myOffcanvas" aria-controls="offcanvasWithBothOptions">
            <span v-if="openCat === false">☰</span>
            <span v-else>✕</span>
          </button>
        </div>
        <div class="w-75 mx-3 position-relative">
          <input id="searchInput" class="form-control me-2 h-100 none-focus" type="search" placeholder="Найти в магазине" aria-label="Search"
                 @input="searchMethod" @keyup.enter="enterSearch" v-model="searchValue" @focus="viewSearchCache">
          <button type="button" class="btn-close position-absolute end-0 top-0 h-75 none-focus" aria-label="Close"
                  v-if="searchValue !== ''" @click="searchValue = ''"></button>
          <div class="dropdown bottom-0 start-0 w-100" v-if="searchValue !== '' || searchCacheList.length > 0">
            <ul class="dropdown-menu d-inline-block w-100" v-if="searchList.length > 0 || searchCacheList.length > 0">
              <li class="dropdown-item d-inline-block text-truncate" v-for="item in searchList">
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
        <div>
          <router-link to="/cart">
            <button class="btn other-btn position-relative d-flex flex-column h-100 pt-0 px-1">
              <div v-if="cartCount !== 0" class="cart-count d-flex align-items-center justify-content-center"><span>{{ cartCount }}</span></div>
              <img class="d-block m-auto pb-1" src="@/assets/icons/cart.png" width="30"/>
              <span style="font-size: 14px; line-height: 0">Корзина</span>
            </button>
          </router-link>
        </div>
      </div>
    </nav>
  </div>

  <div class="offcanvas offcanvas-start mt-5 w-auto" data-bs-scroll="false" data-bs-backdrop="static" tabindex="-1" id="myOffcanvas"
       aria-labelledby="staticBackdropLabel">
    <div class="offcanvas-header mb-0 pb-3 mt-4">
      <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel"></h5>
      <a id="closeOffcanvas" class="btn-close me-0" data-bs-dismiss="offcanvas" aria-label="Закрыть"
         @click="openCat = openCat === false; groups = null">
      </a>
    </div>

    <div class="offcanvas-body w-100 mt-0 pt-0 pe-5">
      <div class=" d-flex flex-nowrap pe-3">
        <div class="list-group list-group-flush w-100">
          <button v-for="(item, index) in catalogs" type="button" class="list-group-item list-group-item-action text-nowrap none-border pe-5"
                  @mouseover="selectGroups(item.groups, index)" name="cat-btn" @click="selectSearch(item)">{{ item.name }}
          </button>
        </div>
        <div v-if="loading === false && groups !== null" class="flex-fill w-100 h-100 ps-5">
          <div class="list-group list-group-flush">
            <button v-for="item in groups" type="button" @click="selectSearch(item)"
                    class="list-group-item list-group-item-action text-nowrap none-border ps-4 p gr-btn">
              {{ item.name }}
            </button>
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
      let hideBtn = document.getElementById('closeOffcanvas')
      hideBtn.click()
      window.localStorage.removeItem('productsList')
      this.$emit('updateParent', {
        search: object
      })
    },
    viewSearchCache(){
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
      this.groups = groups
      let activeBtn = window.document.getElementsByName('cat-btn')

      activeBtn.forEach( (eachEle) => {
        eachEle.className = eachEle.className.replace(" active","")
      })

      activeBtn[index].className = activeBtn[index].className + ' active'
    },
    async searchMethod() {
      if (this.searchValue !== '') {
        this.searchCacheList = []
        await axios.get('http://back.ey/api/v1/client-products/search', {
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
          await axios.get('http://back.ey/api/v1/client-catalogs', {})
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
/*_____________________________________________________*/
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  transition: 0.5s;
  color: #fff;
  z-index: 999999 !important;
  width: 100%;
  margin: 0 auto 1%;
  border-radius: 0 0 10% 10%;
}

/*_____________________________________________________*/
.cat-btn{
  border: 1px solid #939393;
  color: white;
}
.cat-btn:hover{
  border: 1px solid #ffffff;
}
.other-btn{
  color: #d4d4d4;
  /*border: 1px solid #939393;*/
}
.other-btn:hover {
  border-radius: 10px;
  border: 1px solid #939393;
  color: white;
}
.none-focus:focus {
  box-shadow: 0 1px 1px rgb(255, 255, 255) inset, 0 0 8px rgba(255, 255, 255, 1);
  outline: 0 none;
}
.none-border{
  border-color: rgba(0, 0, 0, 0);
}
.none-border:hover{
  background-color: #f1f1f1;
}
/* Не удалять. Используется динамически */
.active, .gr-btn:hover {
  background-color: #f1f1f1;
  color: black;
  border-color: #f1f1f1;
  border-radius: 10px;
}
.active::after {
  content: '❯';
  position: absolute;
  right: 5%;
  top: 20%;
  display: block;
}
/*_______________________________________*/
.cart-count{
  width: 20px;
  height: 20px;
  background-color: red;
  position: absolute;
  font-size: 14px;
  border-radius: 50%;
  right: 20%;
  color: white;
  top: 0;
  border: #ff4949 solid 1px;
}
</style>
