<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png"><br>
    <!-- v-if="isAuthorised" -->
    <button @click="goToAuctionForm()">Create auction</button>
    <AuctionList v-bind:auctions="auctions"/>
  </div>
</template>
<script>
import api from "../modules/api";
import router from "../router";
import AuctionList from "@/components/AuctionList";

export default {
    name: "Home",
    components: {
        AuctionList
    },
    data () {
        return {
            auctions: null
        };
    },
    created () { // or beforecreated
        api()
            .get("/auctions")
            .then((resp) => {
                this.auctions = resp.data;
            });
    },
    methods: {
        goToAuctionForm () {
            router.push("/auction");
        }
    }
};
</script>
