<template>
  <div>
        <div v-if="auctions !== null">
      <button v-if="previousPage" @click="goToPreviousPage()">
          &lt;
      </button>
       <!--
      <ul>
        <li class="auction-list">
        </li>
      </ul>
      -->
      <button v-if="nextPage" @click="goToNextPage()">
          &gt;
      </button>
    </div>
    <ul>
      <li class="auction-list"
        v-for="auction in auctions"
        :key="auction._id"
      >
        <Auction
          :auction="auction"
          :currUser="currUser"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import Auction from "@/components/Auction";

export default {
    name: "AuctionList",
    components: {
        Auction
    },
    props: ["apiString"],
    data () {
        return {
            currUser: this.$store.getters.currentUser,
            auctions: null,
            currentPage: 0,
            nextPage: null,
            previousPage: null
        };
    },
    watch: {
        currentPage (newVal, oldVal) {
            // console.log("before: " + this.$route.params.page);
            this.$route.params.page = `/page/${newVal}`;
            console.log(newVal);
            // console.log("after: " + this.$route.params.page);
        }
    },
    methods: {
        goToNextPage () {
            this.currentPage++;
            this.changePage(this.currentPage);
        },
        goToPreviousPage () {
            this.currentPage--;
            this.changePage(this.currentPage);
        },
        changePage (page) {
            axios
                .get(this.apiString + this.currentPage)
                .then((resp) => {
                    this.auctions = resp.data.auctions;
                    this.nextPage = resp.data.nextPage;
                    this.previousPage = resp.data.previousPage;
                    if (history.pushState) {
                        var newURL = window.location.protocol + "//" +
                        window.location.host + "/page/" + this.currentPage;
                        // console.log(newURL);
                        window.history.pushState({ path: newURL }, "", newURL);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },
    created () {
        this.currentPage = parseInt(this.$route.params.page);
        axios
            .get(this.apiString + this.currentPage)
            .then((resp) => {
                this.auctions = resp.data.auctions;
                this.nextPage = resp.data.nextPage;
                this.previousPage = resp.data.previousPage;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
</script>

<style lang="scss" scoped>
</style>
