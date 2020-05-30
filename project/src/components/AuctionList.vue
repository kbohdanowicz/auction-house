<template>
  <div>
    <ul>
      <li class="auction-list" v-for="auction in auctions" :key="auction._id">
          <Auction :auction="auction" :currUser="currUser"/>
        <!--
        <div v-if="auction.type === 'Bid'">
          <h3>Auction</h3>
        </div>
        <div v-if="auction.type === 'Buy'">
          <h3>Product</h3>
        </div>
        Name: {{ auction.name }}
        <button @click="showAuctionDetails(auction)">Details</button><br>
        <div v-if="auction.type === 'Bid'">
          <div v-if="auction.status === 'OnSale'">
            Current price: ${{ auction.price }}<br>
            <div v-if="auction.duration != null && isAnyTimeLeft">
              Time left: {{ timeLeft }}
            </div>
          </div>
          <div v-if="auction.status === 'New'">
            Starting price: ${{ auction.price }}<br>
          </div>
        </div>
        <div v-if="auction.type === 'Buy'">
          Price: ${{ auction.price }}<br>
        </div>
        -->
      </li>
    </ul>
  </div>
</template>

<script>
import Auction from "@/components/Auction";

export default {
    name: "AuctionList",
    components: {
        Auction
    },
    props: ["auctions"],
    data () {
        return {
            currUser: this.$store.getters.currentUser
        };
    }
};
</script>

<style lang="scss" scoped>
</style>
