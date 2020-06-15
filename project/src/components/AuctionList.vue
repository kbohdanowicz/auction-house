<template>
  <div class="auction-list">
    <ul v-if="auctions !== null">
      <li v-if="auctions.length <= 0" class="no-content-message">
        <h2>No auctions :(</h2>
      </li>
      <li v-for="auction in auctions" :key="auction._id">
        <Auction :auction="auction" :currUser="currUser"
        :mobileView="mobileView"
        @refresh-auctions="refreshAuctions()"/>
      </li>
      <li class="blank">Blank</li>
    </ul>
    <div id="footer">
      <button v-if="auctions !== null" id="btn-prev-page" @click="goToPreviousPage()">
        &lt;
      </button>
      <button v-if="auctions !== null" id="btn-next-page" @click="goToNextPage()">
        &gt;
      </button>
    </div>
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
    props: ["apiString", "mobileView"],
    data () {
        return {
            currUser: this.$store.getters.currentUser,
            auctions: null,
            currentPage: 0,
            nextPage: false,
            previousPage: false
        };
    },
    methods: {
        updateButtonVisibility () {
            if (this.nextPage) {
                document.getElementById("btn-next-page").style.visibility = "visible";
            } else {
                document.getElementById("btn-next-page").style.visibility = "hidden";
            }
            if (this.previousPage) {
                document.getElementById("btn-prev-page").style.visibility = "visible";
            } else {
                document.getElementById("btn-prev-page").style.visibility = "hidden";
            }
        },
        goToNextPage () {
            this.currentPage++;
            this.changePage(this.currentPage);
            window.scrollTo(0, 0);
        },
        goToPreviousPage () {
            this.currentPage--;
            this.changePage(this.currentPage);
            window.scrollTo(0, 0);
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
                        window.history.pushState({ path: newURL }, "", newURL);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        refreshAuctions () {
            console.log("Refreshing auctions");
            axios
                .get(this.apiString + this.currentPage)
                .then((resp) => {
                    console.log("Inside");
                    this.auctions = resp.data.auctions;
                    this.nextPage = resp.data.nextPage;
                    this.previousPage = resp.data.previousPage;
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
    },
    updated () {
        this.updateButtonVisibility();
    }
};
</script>

<style lang="scss" scoped>
.auction-list {
    margin-top: 45px;
    padding-top: 1px;
    width: 100vw;
    ul {
        list-style-type: none;
        display: table;
        margin: 0 auto;
        margin-top: 35px;
        padding-top: 1px;
    }
}

#btn-next-page {
}
button {
    color: black;
    background-color: white;
    border-radius: 6px;
    padding: 2px 8px;
    margin: 0 0 0 6px;
    font-size: 16px;
    cursor: pointer;
}
</style>
