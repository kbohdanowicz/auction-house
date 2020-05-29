<template>
  <div class="auction-edit">
    <form @submit.prevent="updateAuction()">
      <br><br>
      <label for="name-input">Name: </label>
      <input v-model="formData.name" id="name-input" class="input" type="text"
       minLength="3" placeholder="Name" required="">
      <br><br>
      <label for="name-input">Price: $ </label>
      <input v-model="formData.price" id="price-input" class="input" type="number"
       min="0.01" step="0.01" placeholder="Price"
       size="9" required="">
      <br><br>
      <div class="select-type">
      <label for="type-input">Type: </label>
        <select v-model="formData.type" id="select">
          <option value="Bid">Bid</option>
          <option value="Buy">Buy now</option>
        </select>
        <br><br>
      </div>
      <div v-if="formData.type === 'Bid'">
        <label for="timeLeft-input">Duration: </label>
        <input v-model="formData.timeLeft" id="timeLeft-input"
        class="input" type="number" placeholder="Duration" required="">
        <br><br>
      </div>
      <button id="btn-save" type="submit">Save changes</button>
    </form>
    <br>
    <button id="btn-delete" @click="deleteAuction()">Remove auction</button>
    <br><br>
  </div>
</template>

<script>
import axios from "axios";

export default {
    name: "AuctionEdit",
    props: ["auction"],
    data () {
        return {
            formData: {
                name: this.auction.name,
                price: this.auction.price,
                type: this.auction.type,
                timeLeft: this.auction.timeLeft
            }
        };
    },
    methods: {
        updateAuction () {
            if (this.formData.type === "Buy") {
                this.formData.timeLeft = "";
            }
            axios
                .patch(`/api/auction/id=${this.auction._id}`, this.formData)
                .then(() => {
                    location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        deleteAuction () {

        }
        // refresh view data ($emit)
    }
};
</script>

<style lang="scss" scoped>
</style>
