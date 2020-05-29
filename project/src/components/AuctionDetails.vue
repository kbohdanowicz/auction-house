<template>
  <div class="auction-details">
    Name: {{ auction.name }}<br>
    Seller: {{ auction.seller }}<br>
    <div v-if="auction.type === 'Bid'">
      <div v-if="auction.status === 'OnSale'">
        Current price: ${{ auction.price }}<br>
        Time left: {{ auction.timeLeft }} min<br>
        <div v-if="auction.highestBidder === ''">
          No one bid yet!<br>
        </div>
        <div v-else>
          Highest bidder: {{ auction.highestBidder }}<br>
        </div>
        <div v-if="isLoggedAndNotSeller">
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
        <p> Sold for: ${{ auction.price }}</p><br>
        <p> Buyer: {{ auction.highestBidder }}</p>
      </div>
      <div v-else-if="auction.status === 'New'">
        Starting price: ${{ auction.price }}<br>
        Duration: {{ auction.timeLeft }} min<br>
        <button id="btn-start" @click="startAuction()">Start auction</button>
      </div>
      <div v-else-if="auction.status === 'Ignored'">
        No buyer<br>
      </div>
    </div>
    <div v-else-if="auction.type === 'Buy'">
      <div v-if="auction.status === 'OnSale'">
        Price: ${{ auction.price }}<br>
        <div v-if="isLoggedAndNotSeller">
          <button @click="buyItem()">
            Buy now!
          </button><br>
        </div>
      </div>
      <div v-else-if="auction.status === 'Sold'">
        Sold for: {{ auction.price }}<br>
        Buyer: {{ auction.highestBidder }}
      </div>
      <div v-else-if="auction.status === 'New'">
        Price: ${{ auction.price }}<br>
        <button id="btn-start" @click="startAuction()">Start auction</button>
      </div>
    </div>
</div>
</template>

<script>
import axios from "axios";
import router from "../router";
import { mapGetters } from "vuex";

export default {
    name: "AuctionDetails",
    props: ["auction"],
    data () {
        return {
            formData: {
                price: "",
                bidders: [this.$store.getters.currentUser.username],
                highestBidder: ""
            }
        };
    },
    computed: {
        ...mapGetters(["currentUser"]),
        isLoggedAndNotSeller: function () {
            const user = this.$store.getters.currentUser;
            return user.isAuth && this.auction.seller !== user.username;
        }
    },
    methods: {
        startAuction () {
            const body = {
                status: "OnSale"
            };
            axios
                .patch(`/api/auction/id=${this.auction._id}`, body)
                .then(() => {
                    location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        bidItem () {
            if (this.formData.price <= this.auction.price) {
                // show message
                console.log("Your bid is invalid!");
            } else {
                this.formData.highestBidder = this.$store.getters.currentUser.username;
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
            const body = {
                status: "Sold",
                highestBidder: this.$store.getters.currentUser.username
            };
            axios
                .patch(`/api/auction/id=${this.auction._id}`, body)
                .then(() => {
                    // showMessage: SUCCESS
                    // set timeout
                    router.push("/");
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },
    updated: {
    }
    // ,
    // beforeCreate: {
    // if (this.$store.getters.currentUser.isAuth) {
    //    open websocket
    // }
    // }
};
</script>

<style lang="scss" scoped>
</style>
