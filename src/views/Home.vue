<template>
  <div class="home">
    <h2 class="header-text">Available auctions</h2>
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

<style lang="scss" scoped>
</style>
