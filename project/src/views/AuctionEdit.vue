<template>
  <div class="auction-edit">
    <div class="blank"></div>
    <form @submit.prevent="updateAuction()">
      <label for="name-input">Name: </label>
      <input v-model="formData.name" id="name-input" class="input" type="text"
       minLength="3" maxLength="50" required="">
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
        <select v-model="formData.duration" id="duration-input">
          <option v-for="option in options" :key="option.text"
          v-bind:value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <button id="btn-save" type="submit">Save</button>
    </form>
    <div id="other-buttons">
      <button id="btn-cancel" @click="goToMyAuctions()">Cancel</button>
      <!--<button id="btn-delete" @click="deleteAuction()">Remove</button>-->
    </div>
    <div class="blank">Blank</div>
    <div id="footer"></div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
    name: "AuctionEdit",
    props: ["currUser"],
    data () {
        return {
            auction: null,
            options: null,
            formData: null
        };
    },
    methods: {
        getDuration () {
            if (this.auction.type === "Buy") {
                return this.calculateData(1);
            } else {
                return this.auction.duration;
            }
        },
        calculateData: function (multiplier) {
            const hour = 1000 * 60 * 60;
            const calculatedValue = hour * multiplier;
            return calculatedValue;
        },
        updateAuction () {
            if (this.formData.type === "Buy") {
                this.formData.duration = null;
            }
            axios
                .patch("/api/auction", this.formData)
                .then(() => {
                    router.push({
                        name: "MyAuctions",
                        params: { page: 1 }
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        goToMyAuctions () {
            router.push({
                name: "MyAuctions",
                params: { page: 1 }
            });
        }
        //,
        // deleteAuction () {
        //     const body = {
        //         id: this.auction._id
        //     };
        //     axios
        //         .delete("/api/auction", body)
        //         .then(() => {
        //             router.push({
        //                 name: "MyAuctions",
        //                 params: { page: 1 }
        //             });
        //         })
        //         .catch((err) => {
        //             console.log(err);
        //         });
        // }
    },
    created () {
        if (this.$route.params.auction === undefined) {
            router.push({
                name: "MyAuctions",
                params: { page: 1 }
            });
            return;
        }
        this.auction = this.$route.params.auction;

        this.options = [
            { text: "10 Seconds", value: 1000 * 10 },
            { text: "1 Hour", value: this.calculateData(1) },
            { text: "3 Hours", value: this.calculateData(3) },
            { text: "6 Hours", value: this.calculateData(6) },
            { text: "12 Hours", value: this.calculateData(12) },
            { text: "1 Day", value: this.calculateData(24) },
            { text: "3 Days", value: this.calculateData(24 * 3) },
            { text: "1 Week", value: this.calculateData(24 * 7) }
        ];
        this.formData = {
            id: this.auction._id,
            name: this.auction.name,
            price: this.auction.price,
            type: this.auction.type,
            duration: this.getDuration(),
            seller: this.auction.seller
        };
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
    margin: 5px auto;
}
#btn-save {
    background-color: green;
    display: table;
}
#other-buttons {
    display: table;
    margin: 5px auto;
    #btn-cancel {
        margin: 0 5px;
        background-color: orange;
    }
    // #btn-delete {
    //     background-color: red;
    // }
}

</style>
