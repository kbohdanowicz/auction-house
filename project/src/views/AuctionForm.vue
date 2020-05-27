<template>
  <div class="auction-form">
    <form>
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
        <input type="number" placeholder="Duration" required="">
        <br><br>
      </div>
      <button class="button" @click="create">Create</button>
      <br><br>
      <div v-if="formData.type === 'Bid'">
        <button class="button" @click="createAndStart">Create and start</button>
      </div>
    </form>
  </div>
</template>

<script>
import api from "../modules/api";

export default {
    name: "AuctionForm",
    data () {
        return {
            formData: {
                // type: "Bid"
            }
        };
    },
    methods: {
        create () {
            api()
                .post("/auction", this.formData)
                .then(() => {
                    window.location.href = "/";
                });
        },
        createAndStart () {

        }
    }
};
</script>

<style lang="scss" scoped>
#auction-form {
    position: center;
}
</style>
