<template>
  <div class="login">
    <h2>Log in</h2>
    <hr>
      <form action="/api/login" method="POST">
        <input ref="username-input" type="text" name="username" id="username" placeholder="Username"><br><br>
        <input ref="password-input" type="password" name="password" id="password" placeholder="Password"><br><br>
        <input type="submit" value="Log in">
      </form>
  </div>
</template>

<script>
import axios from "@/../node_modules/axios/dist/axios.min.js";

export default {
    name: "Login",
    methods: {
        login () {
            var user = {
                username: this.$refs[""].value,
                password: this.$refs["password-input"].value
            };
            axios.post("/api/login", user)
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

input {

}
</style>
