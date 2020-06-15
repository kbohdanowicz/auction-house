<template>
  <div class="auction-form">
    <!--<h2 class="header-text">Create auction</h2>-->
    <div class="blank"></div>
    <form @submit.prevent="createAuction()">
      <label for="name-input">Name: </label>
      <input v-model="formData.name" id="name-input" class="input" type="text"
       minLength="3" required="">
      <label for="price-input">Price ($): </label>
      <input v-model="formData.price" id="price-input"
       class="input" type="number"
       min="1" max="999999999" maxlength="9" step="1"
       oninput="this.value = this.value.slice(0, this.maxLength)"
       size="9" required="">
      <div class="select-type">
        <label for="type-input">Type: </label>
        <select v-model="formData.type" id="type-input">
          <option value="Bid">Bid</option>
          <option value="Buy">Buy now</option>
        </select>
      </div>
      <div v-if="formData.type === 'Bid'">
        <label for="duration-input">Duration: </label>
        <select v-model="formData.duration" id="type-input">
          <option v-for="option in options" :key="option.text"
          v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <label for="jack">Start auction?</label>
      <input v-model="isStartAuction" type="checkbox">
      <button type="submit">Create</button>
    </form>
    <div class="blank">Blank</div>
    <div id="footer"></div>
  </div>
</template>

<script>
import axios from "axios";
import io from "@/../node_modules/socket.io-client";
import router from "../router";

export default {
    name: "AuctionForm",
    data () {
        return {
            socket: io(),
            options: [
                { text: "10 Seconds", value: 1000 * 10 },
                { text: "1 Hour", value: this.calculateData(1) },
                { text: "3 Hours", value: this.calculateData(3) },
                { text: "6 Hours", value: this.calculateData(6) },
                { text: "12 Hours", value: this.calculateData(12) },
                { text: "1 Day", value: this.calculateData(24) },
                { text: "3 Days", value: this.calculateData(24 * 3) },
                { text: "1 Week", value: this.calculateData(24 * 7) }
            ],
            isStartAuction: false,
            formData: {
                name: null,
                price: null,
                type: "Bid",
                status: "New",
                duration: this.calculateData(1)
            }
        };
    },
    methods: {
        calculateData: function (multiplier) {
            const hour = 1000 * 60 * 60;
            const calculatedValue = hour * multiplier;
            return calculatedValue;
        },
        createAuction () {
            axios
                .post("/api/auction", this.formData)
                .then((res) => {
                    if (this.isStartAuction) {
                        this.startAuction(res.data._id);
                    }
                    router.push({
                        name: "MyAuctions",
                        params: { page: 1 }
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        startAuction (_id) {
            axios
                .patch("/api/start", { id: _id })
                .then(() => {
                    this.socket.emit("start-auction", {
                        id: _id,
                        username: this.$store.getters.currentUser.username
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
form {
    display: table;
    margin: 0 auto;
    height: 100%;
    width: 80%;
    max-width: 300px;
}
input, select{
    font-size: 17px;
    border: 2px solid royalblue;
    border-radius: 4px;
    width: 100%;
    padding: 12px 14px;
    margin: 12px 0;
    box-sizing: border-box;
}
input[type=checkbox] {
    width: 20%;
}
button {
    color: white;
    background-color: #4CAF50;
    border-radius: 8px;
    padding: 2px 11px;
    font-size: 20px;
    cursor: pointer;
    display: table;
    margin: 0 auto;
}
</style>
