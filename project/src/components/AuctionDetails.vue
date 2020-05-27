<template>
  <div class="auction-details">
    <div v-if="auction !== null">
    Name: {{ auction.name }}<br>
    Description: {{ auction.description }}<br>
    Seller: {{ auction.seller }}<br>
    <div v-if="auction.status === 'OnSale'">
      <div v-if="auction.type === 'Bid'">
        Time left:<br>
        Highest bid: ${{ auction.price }}<br>
        Bid now!<br>
      </div>
      <div v-else>
        Price: ${{ auction.price }}<br>
        Buy now!<br>
      </div>
    </div>
    <div v-else-if="auction.status === 'Sold'">
        Sold for: {{ auction.price }}
    </div>
    <div v-else-if="auction.status === 'Ignored'">

    </div>
    </div>
    <div v-else>
    </div>
  </div>
</template>

<script>

export default {
    name: "AuctionDetails",
    props: ["auction"],
    data () {
        return {
        };
    }
};
</script>

<style lang="scss" scoped>
</style>
