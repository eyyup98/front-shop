<template class="template">
  <NavBar></NavBar>


  <div class="container">
    <h1 class="h1 m">Groups</h1>
  </div>
</template>

<script>
import NavBar from "../NavBar.vue";
import axios from "axios";
import router from "../../../router";

export default {
  name: "Groups",
  components: {
    NavBar,
  },
  data(){
    return {
    }
  },
  methods: {
  },
  mounted() {
  }
}
</script>

<style scoped>
.template {
  /*border: 10px solid red;*/
}
.h1 {
  text-align: center;
}
.container {
  padding: 10px;
  background-color: rgba(119, 255, 133, 0.3);
  display: flex;
  flex-direction:column;
  margin: 5% auto 0;
}
</style>