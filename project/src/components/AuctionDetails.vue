<template>
  <div class="auction-details" :class="{'mobile-view':mobileView}">
    <div v-if="auction.type === 'Bid'">
      <h3>Auction</h3>
    </div>
    <div v-if="auction.type === 'Buy'">
      <h3>Product</h3>
    </div>
    Name: {{ auction.name }}<br>
    Seller: {{ auction.seller }}<br>
    <div v-if="auction.type === 'Bid'">
      <div v-if="auction.status === 'OnSale'">
        Current price: ${{ auction.price }}<br>
        <div v-if="isAnyTimeLeft">
          Time left: {{ timeLeft }}
        </div>
        <div v-if="auction.highestBidder === ''">
          No one bid yet!<br>
        </div>
        <div v-else>
          Highest bidder: {{ auction.highestBidder }}<br>
        </div>
        <div v-if="isLoggedAndNotSeller">
          <button id="btn-bid" @click="bidItem()">
            Bid now!
          </button>
          <input v-model="formData.price"
           class="input" type="number"
           min="1" max="999999999" maxlength="9" step="1"
           oninput="this.value = this.value.slice(0, this.maxLength)"
           size="9">
         </div>
      </div>
      <div v-else-if="auction.status === 'Sold'">
        Sold for: ${{ auction.price }}<br>
        Buyer: {{ auction.highestBidder }}
      </div>
      <div v-else-if="auction.status === 'New'">
        Starting price: ${{ auction.price }}<br>
        Duration: {{ getDurationText }}<br>
        <button class="btn-start" @click="startAuction()">Start auction</button>
      </div>
      <div v-else-if="auction.status === 'Ignored'">
        No buyer<br>
      </div>
    </div>
    <div v-else-if="auction.type === 'Buy'">
      <div v-if="auction.status === 'OnSale'">
        Price: <a class="dollar-sign">$</a>{{ auction.price }}<br>
        <div v-if="isLoggedAndNotSeller">
          <button id="btn-buy" @click="buyItem()">
            Buy now!
          </button><br>
        </div>
      </div>
      <div v-else-if="auction.status === 'Sold'">
        Sold for: ${{ auction.price }}<br>
        Buyer: {{ auction.highestBidder }}
      </div>
      <div v-else-if="auction.status === 'New'">
        Price: ${{ auction.price }}<br>
        <button class="btn-start" @click="startAuction()">Start auction</button>
      </div>
    </div>
    <div id="error-message" v-if="errorMessage.isVisible">
        {{ errorMessage.content }}
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import router from "../router";

export default {
    name: "AuctionDetails",
    props: ["auction", "currUser", "timeLeft", "socket", "mobileView"],
    data () {
        return {
            errorMessage: {
                isVisible: false,
                content: "Your bid is invalid"
            },
            formData: {
                id: this.auction._id,
                price: "",
                bidders: [this.currUser.username],
                highestBidder: ""
            }
        };
    },
    computed: {
        ...mapGetters(["currentUser"]),
        isLoggedAndNotSeller () {
            const user = this.currUser;
            return user.isAuth && this.auction.seller !== user.username;
        },
        isAnyTimeLeft () {
            if (new Date(this.auction.duration).getTime() >= new Date().getTime()) {
                return true;
            }
            return false;
        },
        getDurationText () {
            switch (this.auction.duration) {
            case 1000 * 10:
                return "10 Seconds";
            case 1000 * 60 * 60:
                return "1 Hour";
            case 1000 * 60 * 60 * 3:
                return "3 Hours";
            case 1000 * 60 * 60 * 6:
                return "6 Hours";
            case 1000 * 60 * 60 * 12:
                return "12 Hours";
            case 1000 * 60 * 60 * 24:
                return "1 Day";
            case 1000 * 60 * 60 * 24 * 3:
                return "3 Hours";
            case 1000 * 60 * 60 * 24 * 7:
                return "1 Week";
            default:
                return "DEFAULT VALUE";// watch out
            }
        }
    },
    methods: {
        startAuction () {
            axios
                .patch("/api/start", { id: this.auction._id })
                .then(() => {
                    this.socket.emit("start-auction", {
                        id: this.auction._id,
                        username: this.currentUser.username
                    });
                    router.push({
                        name: "Home",
                        params: { page: 1 }
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        bidItem () {
            if (this.formData.price <= this.auction.price) {
                this.errorMessage.isVisible = true;
                setTimeout(() => {
                    this.errorMessage.isVisible = false;
                }, 3000);
            } else {
                this.socket.emit("new-bid", {
                    id: this.auction._id,
                    highestBidder: this.currUser.username,
                    price: this.formData.price
                });
            }
        },
        buyItem () {
            this.socket.emit("new-buy", {
                id: this.auction._id,
                status: "Sold",
                highestBidder: this.currUser.username
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.auction-details {
    word-break: break-all;
    width: 300px;
    #error-message {
        color: red;
    }
}
input {
    margin-left: 10px;
}
.mobile-view {
}
.btn-start {
    background-color: royalblue;
}
#btn-bid {
    background-color: salmon;
}
#btn-buy {
    background-color: salmon;
}
button {
    color: white;
    border-radius: 8px;
    padding: 2px 8px;
    font-size: 16px;
    cursor: pointer;
}
</style>
