<template>
  <div class="my-bids">
    <h2 class="header-text">Bids</h2>
    <AuctionList :apiString="apiString" :mobileView="mobileView"/>
  </div>
</template>

<script>
import AuctionList from "@/components/AuctionList";

export default {
    name: "MyBids",
    components: {
        AuctionList
    },
    props: ["mobileView"],
    data () {
        return {
            apiString: "/api/my-bids/page/"
        };
    }
};
</script>
