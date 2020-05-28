<template>
  <div class="my-history">
    <AuctionList v-bind:auctions="auctions"/>
  </div>
</template>

<script>
import api from "../modules/api";
import AuctionList from "@/components/AuctionList";

export default {
    name: "MyHistory",
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
            .get("/my-history")
            .then((resp) => {
                this.auctions = resp.data;
            });
    }
};
</script>
