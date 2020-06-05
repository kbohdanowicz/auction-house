<template>
  <div class="auction-list">
    <div v-if="auctions !== null">
      <button id="btn-prev-page" @click="goToPreviousPage()">
        &lt;
      </button>
      <button id="btn-next-page" @click="goToNextPage()">
        &gt;
      </button>
    </div>
    <ul>
      <li class="auction-list" v-for="auction in auctions" :key="auction._id">
        <Auction :auction="auction" :currUser="currUser"/>
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
}
#btn-prev-page {
    position: fixed;
    margin: 14px 255px;
}
#btn-next-page {
    position: fixed;
    margin: 14px 290px;
}
</style>
