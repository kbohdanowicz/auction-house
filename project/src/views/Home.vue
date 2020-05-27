<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <ul>
      <li class="auction-item" v-for="auction in auctions" :key="auction._id">
        Name: {{ auction.name }}
        <button @click="showAuctionDetails(auction)">Details</button><br>
        Seller: {{ auction.seller }}<br>
        <div v-if="auction.type === 'Buy'">
          Price: ${{ auction.price }}<br>
          Buy now!<br>
        </div>
        <div v-else>
          Highest bid: ${{ auction.price }}<br>
          Bid now!<br>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
// import AuctionItem from "@/components/AuctionItem";
import api from "../modules/api";

export default {
    name: "Home",
    data () {
        return {
            auctions: null
        };
    },
    created () { // or beforecreated
        api()
            .get("/api/auctions")
            .then((resp) => {
                this.auctions = resp.data;
            });
    },
    methods: {
        showAuctionDetails (auction) {
            window.location.href = `/auction/id=${auction._id}`;
        }
    }
};
</script>
