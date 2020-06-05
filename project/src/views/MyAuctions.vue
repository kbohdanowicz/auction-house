<template>
  <div class="my-auctions">
    <h2 class="list-type-message">My offers</h2>
    <AuctionList :apiString="apiString"/>
    <div id="btn-create-auction" v-if="currentUser.isAuth">
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
    data () {
        return {
            apiString: "/api/my-auctions/page/"
        };
    },
    computed: {
        ...mapGetters(["currentUser"])
    },
    methods: {
        goToAuctionForm () {
            router.push("/auction");
        }
    }
};
</script>
<style lang="scss" scoped>
#btn-create-auction {
    position: fixed;
    top: 50px;
    left: 150px;
}
</style>
