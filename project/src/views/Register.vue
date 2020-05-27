<template>
  <div class="register">
    <h2>Register</h2>
    <hr>
    <!-- @submit handles any form of submission. -->
    <!-- .prevent keeps the event from bubbling around and doing anything else. -->
    <form @submit.prevent="handleSubmit">
      <input v-model="user.username" type="text" name="username" id="username"
      placeholder="Username">
      <br><br>
      <input v-model="user.passowrd" type="password" name="password" id="password"
      placeholder="Password">
      <br><br>
      <!-- confirm password
          <input v-model="password" type="password" name="password" id="password" placeholder="Password"><br><br>
      -->
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script>
import api from "../modules/api";

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
            api()
                .post("/api/register", this.user)
                .then(() => {
                    window.location.href = "/";
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
