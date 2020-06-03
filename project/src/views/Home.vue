<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"><br> -->
    <div v-if="currentUser.isAuth">
      Welcome {{currentUser.username}}
    </div>
    <h2>Available auctions</h2>
    <AuctionList :apiString="apiString"/>
  </div>
</template>

<script>
import AuctionList from "@/components/AuctionList";
import { mapGetters } from "vuex";

export default {
    name: "Home",
    components: {
        AuctionList
    },
    data () {
        return {
            apiString: "/api/auctions/page/"
        };
    },
    computed: {
        ...mapGetters(["currentUser"])
    }
};
</script>
