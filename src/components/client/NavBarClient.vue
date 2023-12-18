<template>
  <div v-bind:style="{ backgroundImage: 'url(\'../../src/assets/fon.jpg\')' }" class="position-absolute w-100" style="z-index: 999999 !important">
    <nav class="navbar">
      <div class="container-fluid d-flex flex-nowrap">
        <a class="navbar-brand">Wildberries</a>
        <div>
          <button class="btn cat-btn p-0 " style="font-size:30px" @click="openCat = openCat === false; groups = null" data-bs-toggle="offcanvas"
                  data-bs-target="#myOffcanvas" aria-controls="offcanvasWithBothOptions">
            <span v-if="openCat === false">☰</span>
            <span v-else>✕</span>
          </button>
        </div>
        <div class="w-75 mx-3 position-relative">
          <input class="form-control me-2 h-100 none-focus" type="search" placeholder="Найти в магазине" aria-label="Search"
                 v-model="searchInput">
          <button type="button" class="btn-close position-absolute end-0 top-0 h-75 none-focus" aria-label="Close"
                  v-if="searchInput !== ''" @click="searchInput = ''"></button>
        </div>
        <div>
          <ul class="navbar-nav mb-2 mb-lg-0">
            <li>
              <button class="btn other-btn m-auto my-0 pt-1 pb-0">
                <img class="d-block m-auto" src="@/assets/icons/cart.png" width="25"/>
                <span style="font-size: 14px">Корзина</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div class="offcanvas offcanvas-start pt-5 w-auto min-w" data-bs-scroll="true" data-bs-backdrop="static" tabindex="-1" id="myOffcanvas"
       aria-labelledby="staticBackdropLabel">
    <div class="offcanvas-header pt-4">
      <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Каталог</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Закрыть"
              @click="openCat = openCat === false; groups = null"></button>
    </div>
    <div class="offcanvas-body w-100 d-flex flex-nowrap">
      <div class="list-group list-group-flush w-100 min-w">
        <button v-for="item in catalogs" type="button" class="list-group-item list-group-item-action w-100"
                @mouseover="selectGroups(item.groups)">{{ item.name }}</button>
      </div>
      <div v-if="loading === false && groups !== null" class="flex-fill w-100 h-100 min-w ps-2">
        <div class="list-group list-group-flush w-100">
          <button v-for="item in groups" type="button" class="list-group-item list-group-item-action w-100">{{ item.name }}</button>
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
      }
    },
    methods: {
      selectGroups(groups){
        this.groups = groups
        console.log(groups)
      },
      async getData() {
        this.loading = true
        try {
          await axios.get('http://back.ey/api/v1/catalogs/for-groups', {
            params: {
              token: localStorage.access_token
            }
          }).then(response => (
              this.catalogs = response.data
          ))
        } catch (exception) {
          func.toastElList(exception.response.data.msg);
          return;
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
/*.dropdown:hover>.dropdown-menu {*/
/*  display: block;*/
/*  position: absolute;*/
/*  right: 0;*/
/*}*/
.cat-btn{
  border: 1px solid #939393;
  color: white;
}
.cat-btn:hover{
  border: 1px solid #ffffff;
}
.other-btn:hover{
  border: 1px solid #939393;
}
.none-focus:focus {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0) inset, 0 0 8px rgba(0, 0, 0, 0);
  outline: 0 none;
}
.min-w{
  min-width: 30vw;
}
</style>
