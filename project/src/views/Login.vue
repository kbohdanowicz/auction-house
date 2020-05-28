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
        <input type="submit" value="Log in">
      </form>
  </div>
</template>

<script>
import api from "../modules/api";
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
        handleSubmit () {
            api()
                .post("/login", this.user)
                .then(() => {
                    router.push("/");
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
