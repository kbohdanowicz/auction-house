<template>
  <div class="my-auctions">
    <h2>My offers</h2>
    <br>
    <div v-if="currentUser.isAuth">
      <button @click="goToAuctionForm()">Create auction</button>
    </div>
    <AuctionList v-bind:auctions="auctions"/>
  </div>
</template>

<script>
import router from "../router";
import axios from "axios";
import AuctionList from "@/components/AuctionList";
import { mapGetters } from "vuex";

export default {
    name: "MyAuctions",
    components: {
        AuctionList
    },
    data () {
        return {
            auctions: null
        };
    },
    computed: {
        ...mapGetters(["currentUser"])
    },
    methods: {
        goToAuctionForm () {
            router.push("/auction");
        }
    },
    created () { // or beforecreated
        axios
            .get("/api/my-auctions")
            .then((resp) => {
                this.auctions = resp.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
</script>
