<template>
  <div class="home" v-if="isLoggedIn">
    <img alt="Vue logo" src="../assets/logo.png"><br>
    <p>Welcome {{ username }}</p>
    <!-- v-if="isAuthorised" -->
    <button @click="goToAuctionForm()">Create auction</button>
    <AuctionList v-bind:auctions="auctions"/>
  </div>
</template>
<script>
import axios from "axios";
import router from "../router";
import AuctionList from "@/components/AuctionList";

export default {
    name: "Home",
    components: {
        AuctionList
    },
    data () {
        return {
            auctions: null,
            username: "",
            isLoggedIn: false
        };
    },
    created () { // or beforecreated
        axios
            .get("/api/auctions")
            .then((resp) => {
                this.auctions = resp.data;
            });
    },
    methods: {
        goToAuctionForm () {
            router.push("/api/auction");
        },
        getUserData () {
            axios
                .get("/api/current-user")
                .then((res) => {
                    this.$set(this, "username", res.data.currentUser.username);
                    this.isLoggedIn = res.data.isLoggedIn;
                })
                .catch((err) => {
                    console.log(err);
                    router.push("/login");
                });
        }
    },
    mounted () {
        this.getUserData();
    }
};
</script>
