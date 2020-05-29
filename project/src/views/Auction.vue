<template>
  <div class="auction">
    <div v-if="!isEdit">
      <AuctionDetails v-bind:auction="auction"/>
    </div>
    <div ><!-- v-if="isAuthenticated" -->
        <button id="btn-edit" class="button" @click="isEdit = !isEdit">
            Edit
        </button>
    </div>
    <div v-if="isEdit">
      <AuctionEdit v-bind:auction="auction"/>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AuctionDetails from "@/components/AuctionDetails";
import AuctionEdit from "@/components/AuctionEdit";

export default {
    name: "Auction",
    components: {
        AuctionDetails,
        AuctionEdit
    },
    data () {
        return {
            isEdit: false,
            auction: null
        };
    },
    methods: {

    },
    beforeCreate () {
        const id = window.location.href.split("id=")[1];
        console.log("id = " + id);
        axios
            .get(`/api/auction/id=${id}`)
            .then((resp) => {
                this.auction = resp.data;
            });
    }
};
</script>

<style lang="scss" scoped>
</style>
