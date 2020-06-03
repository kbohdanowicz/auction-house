<template>
  <div class="my-auctions">
    <h2>My offers</h2>
    <br>
    <div v-if="currentUser.isAuth">
      <button @click="goToAuctionForm()">Create auction</button>
    </div>
    <AuctionList :apiString="apiString"/>
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
            apiString: "/api/my-auctions"
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
