<template>
  <div class="auction-form">
    <form @submit.prevent="handleSubmit()">
      <br><br>
      <input v-model="formData.name" id="name-input" class="input" type="text"
      placeholder="Name" required="">
      <br><br>
      <input v-model="formData.price" id="price-input" class="input" type="number"
      min="0.01" step="0.01" placeholder="Price" required="">
      <br><br>
      <div class="select-type">
        <select v-model="formData.type" id="select">
          <option value="Bid" selected>Bid</option>
          <option value="Buy">Buy now</option>
        </select>
        <br><br>
      </div>
      <div v-if="formData.type === 'Bid'">
        <input v-model="formData.timeLeft" type="number" placeholder="Duration" required="">
        <br><br>
      </div>
      <button type="submit">Create</button>
      <br><br>
      <!--
      <div v-if="formData.type === 'Bid'">
        <button class="button" @click="createAndStart()">Create and start</button>
      </div>
      -->
    </form>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
    name: "AuctionForm",
    data () {
        return {
            formData: {
                name: null,
                price: null,
                type: null,
                seller: this.$store.getters.currentUser.username,
                status: null,
                timeleft: null
            }
        };
    },
    methods: {
        handleSubmit () {
            this.formData.status = "New";
            axios
                .post("/api/auction", this.formData)
                .then(() => {
                    router.push("/");
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        createAndStart () {
            // this.formData.status = "OnSale";
            // axios
            //     .post("/auction", this.formData)
            //     .then(() => {
            //         router.push("/");
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     });
        }
    }
};
</script>

<style lang="scss" scoped>
#auction-form {
    position: center;
}
</style>
