<template>
  <div class="my-bids">
    <h2 class="header-text">Bids</h2>
    <AuctionList :apiString="apiString"/>
  </div>
</template>

<script>
import AuctionList from "@/components/AuctionList";

export default {
    name: "MyBids",
    components: {
        AuctionList
    },
    data () {
        return {
            apiString: "/api/my-bids/page/"
        };
    }
};
</script>
