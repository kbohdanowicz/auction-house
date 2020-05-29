<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png"><br>
    <div v-if="currentUser.isAuth">
      <p>Welcome {{ currentUser.username }}</p>
      <button @click="goToAuctionForm()">Create auction</button>
    </div>
    <AuctionList v-bind:auctions="auctions"/>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import AuctionList from "@/components/AuctionList";
import { mapGetters } from "vuex";

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
    computed: {
        ...mapGetters(["currentUser"])
    },
    methods: {
        goToAuctionForm () {
            router.push("/auction");
        }
    },
    created () {
        axios
            .get("/api/auctions")
            .then((resp) => {
                this.auctions = resp.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
</script>
