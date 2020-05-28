<template>
  <div>
    <ul>
      <li class="auction-list" v-for="auction in auctions" :key="auction._id">
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
