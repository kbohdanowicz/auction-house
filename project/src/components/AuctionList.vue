<template>
  <div>
    <ul>
      <li class="auction-list" v-for="auction in auctions" :key="auction._id">
        <div v-if="auction.type === 'Bid'">
          <h3>Auction</h3>
        </div>
        <div v-if="auction.type === 'Buy'">
          <h3>Product</h3>
        </div>
        Name: {{ auction.name }}
        <button @click="showAuctionDetails(auction)">Details</button><br>
          Seller: {{ auction.seller }}<br>
        <div v-if="auction.type === 'Bid'">
          <div v-if="auction.status === 'OnSale'">
            Current price: ${{ auction.price }}<br>
            Time left: {{ auction.timeLeft }} min<br>
          </div>
          <div v-if="auction.status === 'New'">
            Starting price: ${{ auction.price }}<br>
            Duration: {{ auction.timeLeft }} min<br>
          </div>
        </div>
        <div v-if="auction.type === 'Buy'">
          Price: ${{ auction.price }}<br>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import router from "../router";

export default {
    name: "AuctionList",
    props: ["auctions"],
    data () {
        return {
        };
    },
    computed: {
    },
    methods: {
        showAuctionDetails (auction) {
            router.push(`/auction/id=${auction._id}`);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
