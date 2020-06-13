<template>
  <div class="my-history">
    <h2 class="header-text">History</h2>
    <AuctionList :apiString="apiString" :mobileView="mobileView"/>
  </div>
</template>

<script>
import AuctionList from "@/components/AuctionList";

export default {
    name: "MyHistory",
    components: {
        AuctionList
    },
    props: ["mobileView"],
    data () {
        return {
            apiString: "/api/my-history/page/"
        };
    }
};
</script>
