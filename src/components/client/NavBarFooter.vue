<template>
  <div class="wrapper">
    <div class="wrapper-navbar">
      <div class="footer fixed-bottom">
        <nav class="navbar">
          <div class="container-fluid d-flex flex-nowrap flex-footer">
            <div class="view-cat-footer">
              <button class="btn other-btn position-relative d-flex flex-column p-0" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft"
                      aria-controls="offcanvasLeft" @click="toggleOpenCat" id="OffcanvasBtn2">
                <img v-if="!openCat" class="d-block m-auto" src="@/assets/icons/list.png" width="50"/>
                <img v-else class="d-block m-auto" src="@/assets/icons/cross.png" width="45"/>
              </button>
            </div>
            <div class="cart-block view-cat-footer">
              <button class="btn other-btn position-relative d-flex flex-column p-0" @click="selectHome">
                <img class="d-block m-auto" src="@/assets/icons/home.png" width="50"/>
              </button>
            </div>
            <div class="cart-block view-cat-footer">
              <router-link to="/cart">
                <button class="btn other-btn position-relative d-flex flex-column p-0">
                  <div v-if="cartCount !== 0" class="cart-count d-flex align-items-center justify-content-center"><span>{{ cartCount }}</span></div>
                  <img class="d-block m-auto" src="@/assets/icons/cart.png" width="45"/>
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
import func from "../../js/functions";
import apiClient from '@/api/axios'

export default {
  name: "NavBarClient",
  data(){
    return {
      openCat: false,
      catalogs: null,
      loading: true,
      groups: null,
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
