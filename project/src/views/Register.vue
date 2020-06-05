<template>
  <div class="register">
    <h2>Register</h2>
    <hr>
    <!-- @submit handles any form of submission. -->
    <!-- .prevent keeps the event from bubbling around and doing anything else. -->
    <form @submit.prevent="handleSubmit()">
      <input v-model="user.username" type="text" name="username" id="username"
      placeholder="Username" minLength="3" required="">
      <br><br>
      <input v-model="user.password" type="password" name="password" id="password"
      placeholder="Password" required="">
      <br><br>
      <!-- confirm password
          <input v-model="password" type="password" name="password" id="password" placeholder="Password"><br><br>
      -->
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
    name: "Register",
    data () {
        return {
            user: {
                username: "",
                password: ""
            }
        };
    },
    methods: {
        handleSubmit () {
            axios
                .post("api/register", this.user)
                .then(() => {
                    router.push({ name: "Login" });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
h2 {
    font-family: 'Montserrat', sans-serif;
    text-align: center;
}

// input {

// }
</style>
