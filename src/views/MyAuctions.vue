<template>
  <div class="my-auctions">
    <h2 class="header-text">My offers</h2>
    <AuctionList :apiString="apiString"/>
    <div class="btn-create-auction-mobile" v-if="isAuthAndMobile">
      <button @click="goToAuctionForm()">New auction</button>
    </div>
    <div class="btn-create-auction-desktop" v-if="isAuthAndDesktop">
      <button @click="goToAuctionForm()">New auction</button>
    </div>
  </div>
</template>

<script>
import router from "../router";
import AuctionList from "@/components/AuctionList";
import { mapGetters } from "vuex";

export default {
    name: "MyAuctions",
    components: {
        AuctionList
    },
    data () {
        return {
            apiString: "/api/my-auctions/page/"
        };
    },
    computed: {
        ...mapGetters(["currentUser"]),
        isAuthAndMobile () {
            return this.currentUser.isAuth && this.$store.getters.isMobileView;
        },
        isAuthAndDesktop () {
            return this.currentUser.isAuth && !this.$store.getters.isMobileView;
        }
    },
    methods: {
        goToAuctionForm () {
            router.push({ name: "Auction" });
        }
    }
};
</script>
<style lang="scss" scoped>
.btn-create-auction-desktop {
    position: fixed;
    display: table;
    bottom: 8px;
    left: 63vw;
}
.btn-create-auction-mobile {
    position: fixed;
    bottom: 8px;
    left: 63vw;
}
button {
    color: white;
    background-color: green;
    border-radius: 8px;
    padding: 3px 3px;
    font-size: 16px;
    cursor: pointer;
}
</style>
