<template>
  <div class="auction-details">
    <div v-if="auction.type === 'Bid'">
      <h3>Auction</h3>
    </div>
    <div v-if="auction.type === 'Buy'">
      <h3>Product</h3>
    </div>
    <strong>Name:</strong> {{ auction.name }}<br>
    <strong>Seller:</strong> {{ auction.seller }}<br>
    <div v-if="auction.type === 'Bid'">
      <div v-if="auction.status === 'OnSale'">
        <strong>Current price:</strong> ${{ auction.price }}<br>
        <div v-if="isAnyTimeLeft">
          <strong>Time left:</strong> {{ timeLeft }}
        </div>
        <div v-if="auction.highestBidder === ''">
          <strong class="green-text">No one bid yet!</strong><br>
        </div>
        <div v-else>
          <strong>Highest bidder:</strong>
          <span>
            {{ auction.highestBidder }}<br>
          </span>
        </div>
        <div v-if="isLoggedAndNotSeller">
          <button id="btn-bid" @click="bidItem()">
            Bid now!
          </button>
          ($)
          <input v-model="formData.price"
           class="input" type="number"
           min="1" max="999999999" maxlength="9" step="1"
           oninput="this.value = this.value.slice(0, this.maxLength)"
           size="9">
         </div>
      </div>
      <div v-else-if="auction.status === 'Sold'">
        <strong>Sold for:</strong> ${{ auction.price }}<br>
        <strong>Buyer:</strong> {{ auction.highestBidder }}
      </div>
      <div v-else-if="auction.status === 'New'">
        <strong>Starting price:</strong> ${{ auction.price }}<br>
        <strong>Duration:</strong> {{ getDurationText }}<br>
        <button class="btn-start" @click="startAuction()">Start auction</button>
      </div>
      <div v-else-if="auction.status === 'Ignored'">
        <strong>No buyer</strong><br>
      </div>
    </div>
    <div v-else-if="auction.type === 'Buy'">
      <div v-if="auction.status === 'OnSale'">
        <strong>Price:</strong> <a class="dollar-sign">$</a>{{ auction.price }}<br>
        <div v-if="isLoggedAndNotSeller">
          <button id="btn-buy" @click="buyItem()">
            Buy now!
          </button><br>
        </div>
      </div>
      <div v-else-if="auction.status === 'Sold'">
        <strong>Sold for:</strong> ${{ auction.price }}<br>
        <strong>Buyer:</strong> {{ auction.highestBidder }}
      </div>
      <div v-else-if="auction.status === 'New'">
        <strong>Price:</strong> ${{ auction.price }}<br>
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
    props: ["auction", "currUser", "timeLeft", "socket"],
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
            if (this.auction.endTime >= new Date().getTime()) {
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
                return "DEFAULT VALUE";
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
                this.errorMessage.isVisible = false;
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
    width: 250px;
    #error-message {
        color: red;
        margin-bottom: 5px;
    }
}
.green-text {
    color: green;
}
input {
    margin-left: 10px;
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
