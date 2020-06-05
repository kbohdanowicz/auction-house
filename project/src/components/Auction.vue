<template>
  <div v-if="auction !== null" class="auction">
    <div v-if="auction.type === 'Bid'">
      <h3>Auction</h3>
    </div>
    <div v-if="auction.type === 'Buy'">
      <h3>Product</h3>
    </div>
    <div v-if="!isEditMode">
      <AuctionDetails
       :auction="auction" :currUser="currUser"
       :timeLeft="timeLeft" :socket="socket"/>
    </div>
    <div v-if="isAuthAndIsOwnerAndIsNotStarted">
      <button id="btn-edit" @click="showEdit()">
        {{ editButtonText }}
      </button>
    </div>
    <div v-if="isEditMode">
      <AuctionEdit :auction="auction" :currUser="currUser"/>
    </div>
    <button v-if="isAuthAndIsNotOwnerAndOnSale" @click="goToConversation()">
      Contact seller
    </button>
  </div>
</template>

<script>
import axios from "axios";
import AuctionDetails from "@/components/AuctionDetails";
import AuctionEdit from "@/components/AuctionEdit";
import { mapGetters } from "vuex";
import io from "@/../node_modules/socket.io-client";
import router from "../router";

export default {
    name: "Auction",
    components: {
        AuctionDetails,
        AuctionEdit
    },
    props: ["auction", "currUser"],
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
    methods: { // TODO CMON
        showEdit () {
            this.isEditMode = !this.isEditMode;
            if (this.isEditMode) {
                this.editButtonText = "Cancel changes";
            } else {
                this.editButtonText = "Edit";
            }
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
                            params: { conversation: res.data }
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
                            params: { conversation: res.data }
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
                console.log("Left auction!");
            }
        }
    },
    created () {
        if (this.auction.status === "OnSale" &&
            this.auction.type === "Bid" &&
            this.auction.duration !== null &&
            new Date(this.auction.duration).getTime() >= new Date().getTime()) {
            this.timer = setInterval(() => {
                const now = new Date().getTime();
                const to = new Date(this.auction.duration);

                const tempTime = to - now;

                const hours = Math.floor((tempTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((tempTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((tempTime % (1000 * 60)) / (1000));

                let hoursString = hours.toString();
                let minutesString = minutes.toString();
                let secondsString = seconds.toString();

                if (hoursString.length === 1) {
                    hoursString = `0${hoursString}`;
                }
                if (minutesString.length === 1) {
                    minutesString = `0${minutesString}`;
                }
                if (secondsString.length === 1) {
                    secondsString = `0${secondsString}`;
                }
                this.timeLeft = `${hoursString}:${minutesString}:${secondsString}`;

                if (tempTime <= 0) {
                    clearInterval(this.timer);
                    location.reload();
                }
            });
        }

        if (this.currUser.isAuth &&
            this.auction.status === "OnSale") {
            console.log("Joined an auction!");
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
            console.log("Left auction!");
        };
    },
    beforeDestroy () {
        this.leaveSocket();
    }
};
</script>

<style lang="scss" scoped>
</style>
