<template>
  <div class="auction-edit">
    <div ><!-- v-if="isAuthenticated" -->
        Auction Edit
    </div>
  </div>
</template>

<script>

export default {
    name: "AuctionEdit",
    props: ["auction"],
    methods: {
        // refresh view data ($emit)
    }
};
</script>

<style lang="scss" scoped>
</style>
