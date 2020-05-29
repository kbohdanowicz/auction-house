<template>
  <div v-if="auction !== null" class="auction">
    <div v-if="!isEdit">
      <AuctionDetails v-bind:auction="auction"/>
    </div>
    <div v-if="currentUser.isAuth">
        <!--
        <div v-if="auction.seller === currentUser.username"> change to ""?
        <button id="btn-edit" class="button" @click="isEdit = !isEdit">
            Edit
        </button>
        </div>
        -->
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
import { mapGetters } from "vuex";

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
    computed: {
        ...mapGetters(["currentUser"])
    },
    beforeCreate () {
        const id = window.location.href.split("id=")[1];
        axios
            .get(`/api/auction/id=${id}`)
            .then((resp) => {
                this.auction = resp.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
</script>

<style lang="scss" scoped>
</style>
