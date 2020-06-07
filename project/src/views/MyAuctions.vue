<template>
  <div class="my-auctions">
    <h2 class="header-text">My offers</h2>
    <AuctionList :apiString="apiString"/>
    <div class="btn-create-auction-mobile" v-if="isAuthAndMobile">
      <button @click="goToAuctionForm()">Create auction</button>
    </div>
    <div class="btn-create-auction-desktop" v-if="isAuthAndDesktop">
      <button @click="goToAuctionForm()">Create auction</button>
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
    props: ["mobileView"],
    data () {
        return {
            apiString: "/api/my-auctions/page/"
        };
    },
    computed: {
        ...mapGetters(["currentUser"]),
        isAuthAndMobile () {
            console.log(this.mobileView);
            return this.currentUser.isAuth && this.mobileView;
        },
        isAuthAndDesktop () {
            return this.currentUser.isAuth && !this.mobileView;
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
    bottom: 13px;
    left: 20vw;
}
.btn-create-auction-mobile {
    position: fixed;
    bottom: 13px;
    left: 5vw;
}
</style>
