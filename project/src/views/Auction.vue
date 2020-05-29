<template>
  <div v-if="auction !== null" class="auction">
    <div v-if="auction.type === 'Bid'">
      <h3>Auction</h3>
    </div>
    <div v-if="auction.type === 'Buy'">
      <h3>Product</h3>
    </div>
    <div v-if="!isEdit">
      <AuctionDetails v-bind:auction="auction"/>
    </div>
    <div v-if="isAuthAndIsOwnerAndIsNotStarted">
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
        ...mapGetters(["currentUser"]),
        isAuthAndIsOwnerAndIsNotStarted: function () {
            const user = this.$store.getters.currentUser;
            return user.isAuth &&
            this.auction.seller === user.username &&
            this.auction.status === "New";
        }
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
