<template>
  <div class="auction-details">
    Name: {{ auction.name }}<br>
    Description: {{ auction.description }}<br>
    Seller: {{ auction.seller }}<br>
    <div v-if="auction.type === 'Bid'">
      <div v-if="auction.status === 'OnSale'">
        Time left:<br>
        Current price: ${{ auction.price }}<br>
        <div v-if="currentUser.isAuth">
          <button @click="bidItem()">
            Bid now!
          </button>
          <input v-model="formData.price" id="price-input"
           class="input" type="number"
           min="0.01" step="0.01" placeholder="Your bid"
           size="9" required="">
         </div>
      </div>
      <div v-else-if="auction.status === 'Sold'">
        Sold for: {{ auction.price }}
      </div>
    </div>
    <div v-else-if="auction.type === 'Buy'">
      <div v-if="auction.status === 'OnSale'">
        Price: ${{ auction.price }}<br>
        <button v-if="currentUser.isAuth" @click="buyItem()">
          Buy now!
        </button><br>
      </div>
      <div v-else-if="auction.status === 'Sold'">
        Sold for: {{ auction.price }}
      </div>
    </div>
    <div v-else-if="auction.status === 'Ignored'">
      Not sold<br>
    </div>
    <div v-else>
    </div>
</div>
</template>

<script>
import axios from "axios";
// import router from "../router";
import { mapGetters } from "vuex";

export default {
    name: "AuctionDetails",
    props: ["auction"],
    data () {
        return {
            formData: {
                price: "",
                bidders: [this.$store.getters.currentUser.username]
            },
            auctionId: null
        };
    },
    computed: {
        ...mapGetters(["currentUser"])
    },
    methods: {
        bidItem () {
            if (this.formData.price === "") {
                console.log("Your bid is empty!");
                // show message
            } else if (this.formData.price <= this.auction.price) {
                // show message
                console.log("Your bid is invalid!");
            } else {
                axios
                    .patch(`/api/auction/id=${this.auction._id}`, this.formData)
                    .then(() => {
                        // showMessage: SUCCESS
                        // websocket emit dom update current price
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
        buyItem () {

        }
    }
};
</script>

<style lang="scss" scoped>
</style>
