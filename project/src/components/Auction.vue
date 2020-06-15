<template>
  <div v-if="auction !== null" id="auction">
    <div v-if="!isEditMode">
      <AuctionDetails
       :auction="auction" :currUser="currUser"
       :timeLeft="timeLeft" :socket="socket"
       :mobileView="mobileView"/>
    </div>
    <div v-if="isAuthAndIsOwnerAndIsNotStarted">
      <button id="btn-edit" @click="goToEdit()">
        {{ editButtonText }}
      </button>
    </div>
    <button v-if="isAuthAndIsNotOwnerAndOnSale" @click="goToConversation()">
      Contact seller
    </button>
  </div>
</template>

<script>
import axios from "axios";
import AuctionDetails from "@/components/AuctionDetails";
import { mapGetters } from "vuex";
import io from "@/../node_modules/socket.io-client";
import router from "../router";

export default {
    name: "Auction",
    components: {
        AuctionDetails
    },
    props: ["auction", "currUser", "mobileView"],
    data () {
        return {
            socket: io(),
            isEditMode: false,
            editButtonText: "Edit",
            timeLeft: null,
            addressBar: window.location.href
        };
    },
    computed: {
        ...mapGetters(["currentUser"]),
        isAuthAndIsOwnerAndIsNotStarted () {
            return this.currUser.isAuth &&
            this.auction.seller === this.currUser.username &&
            this.auction.status === "New";
        },
        isAuthAndIsNotOwnerAndOnSale () {
            return this.currUser.isAuth &&
            this.auction.seller !== this.currUser.username &&
            this.auction.status === "OnSale";
        }
    },
    methods: {
        goToEdit () {
            router.push({
                name: "AuctionEdit",
                params: { auction: this.auction }
            });
        },
        goToConversation () {
            const body = {
                otherUser: this.auction.seller
            };
            axios
                .post("/api/conversation/exists", body)
                .then((res) => {
                    if (res.data === null) {
                        this.createConversation();
                    } else {
                        router.push({
                            name: "Conversation",
                            params: { conversation: res.data, mobileView: this.mobileView }
                        });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        createConversation: function () {
            const body = {
                otherUser: this.auction.seller
            };
            axios
                .post("/api/conversation", body)
                .then((res) => {
                    if (res.data !== null) {
                        router.push({
                            name: "Conversation",
                            params: { conversation: res.data, mobileView: this.mobileView }
                        });
                    } else {
                        console.log("Failed to create conversation");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        leaveSocket () {
            if (this.currUser.isAuth &&
                this.auction.type === "Bid") {
                this.socket.emit("leave-auction", {
                    id: this.auction._id,
                    username: this.currUser.username
                });
            }
        }
    },
    created () {
        if (this.auction.status === "OnSale" &&
            this.auction.type === "Bid" &&
            this.auction.endTime !== null &&
            this.auction.endTime >= new Date().getTime()) {
            this.timer = setInterval(() => {
                const now = new Date().getTime();
                const to = this.auction.endTime;

                const tempTime = to - now;

                const days = Math.floor((tempTime % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
                const hours = Math.floor((tempTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((tempTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((tempTime % (1000 * 60)) / (1000));

                let daysString = days.toString() + "d ";
                let hoursString = hours.toString();
                let minutesString = minutes.toString();
                let secondsString = seconds.toString();

                if (daysString === "0d ") {
                    daysString = "";
                }
                if (hoursString.length === 1) {
                    hoursString = `0${hoursString}`;
                }
                if (minutesString.length === 1) {
                    minutesString = `0${minutesString}`;
                }
                if (secondsString.length === 1) {
                    secondsString = `0${secondsString}`;
                }
                this.timeLeft = `${daysString}${hoursString}:${minutesString}:${secondsString}`;

                if (this.timeLeft === "00:00:00") {
                    console.log("Finished interval");
                    clearInterval(this.timer);
                    setTimeout(() => {
                        this.$emit("refresh-auctions");
                    }, 1000);
                }
            });
        }

        if (this.currUser.isAuth &&
            this.auction.status === "OnSale") {
            this.socket.emit("join-auction", {
                id: this.auction._id,
                username: this.currentUser.username
            });
        }

        this.socket.on("new-bid", (data) => {
            console.log(`New bid from ${data.highestBidder} has arrived!`);
            this.auction.price = data.price;
            this.auction.highestBidder = data.highestBidder;
        });

        this.socket.on("new-buy", (data) => {
            console.log(`A product has been bought by ${data.highestBidder}!`);
            this.auction.status = "Sold";
            this.auction.highestBidder = data.highestBidder;
        });

        window.onbeforeunload = () => {
            this.socket.emit("leave-auction", {
                id: this.auction._id,
                username: this.currUser.username
            });
        };
    },
    beforeDestroy () {
        this.leaveSocket();
    }
};
</script>

<style lang="scss">
button {
    color: white;
    background-color: royalblue;
    border-radius: 8px;
    padding: 2px 8px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 5px;
}
#btn-edit {
    background-color: salmon;
}
input, select{
    border: 2px solid royalblue;
    border-radius: 4px;
    padding: 5px 14px;
    margin: 8px 0;
    box-sizing: border-box;
}
input[type=checkbox] {
    width: 20%;
}
</style>
