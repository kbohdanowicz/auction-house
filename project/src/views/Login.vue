<template>
  <div class="login">
    <h2>Log in</h2>
    <hr>
      <form @submit.prevent="handleSubmit()">
        <input v-model="user.username" type="text" name="username" id="username"
        placeholder="Username" minLength="3" required="">
        <br><br>
        <input v-model="user.password" type="password" name="password" id="password"
        placeholder="Password" required="">
        <br><br>
        <button type="submit">Log in</button>
      </form>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
    name: "Login",
    data () {
        return {
            user: {
                username: "",
                password: ""
            }
        };
    },
    methods: {
        async handleSubmit () {
            console.log("START");
            await axios
                .post("/api/login", this.user)
                .then((res) => {
                    router.push("/");
                })
                .catch((err) => {
                    console.log(err);
                    router.push("/login");
                    location.reload();
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
