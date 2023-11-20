<template class="template">
  <NavBar></NavBar><div class="container">

  <h1 class="h1 m">Параметры товаров</h1>
  <span id="param-message"></span>
</div>
</template>

<script>
import NavBar from "../NavBar.vue";
import axios from "axios";

export default {
  name: "Params",
  components: {
    NavBar
  },
  data() {
    return {
      loading: true,
    }
  },
  methods: {
    async getData() {
    },
  },
  async mounted() {
    await this.getData()
  }
}
</script>

<style scoped>
</style>