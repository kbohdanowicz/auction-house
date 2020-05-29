<template>
  <div id="app">
    <Navbar/>
    <div class="content-page">
      <router-view/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "@/components/Navbar";

export default {
    data () {
        return {
            currentUser: null
        };
    },
    components: {
        Navbar
    },
    mounted () {
        // this.fetchUser();
    },
    methods: {
        async fetchUser () {
            return axios
                .get("api/current-user")
                .then((res) => {
                    this.currentUser = res.data.currentUser;
                })
                .catch(() => {
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.content-page {
  height: 100%;
  width: 100%;
  position: fixed;
}
</style>
