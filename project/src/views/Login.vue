<template>
  <div class="login">
    <h2>Log in</h2>
    <hr>
      <form @submit.prevent="handleSubmit()" ref="form">
        <input v-model="formData.username" type="text" name="username" id="username"
        placeholder="Username" minLength="3" required="">
        <br><br>
        <input v-model="formData.password" type="password" name="password" id="password"
        placeholder="Password" required="">
        <br><br>
        <button type="submit">Log in</button>
      </form>
      <div id="error-message">dupa</div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "Login",
    data () {
        return {
            formData: {
                username: "",
                password: ""
            }
        };
    },
    computed: {
        ...mapGetters(["currentUser"])
    },
    methods: {
        ...mapActions(["fetchCurrentUser"]),
        handleSubmit () {
            axios
                .post("/api/login", this.formData)
                .then((res) => {
                    router.push("/page/1");
                })
                .catch((err) => {
                    const error = document.getElementById("error-message");
                    if (err.response.status === 401) {
                        error.style.visibility = "visible";
                        error.innerHTML = "Invalid credentials";
                    } else {
                        error.style.visibility = "visible";
                        error.innerHTML = "An error occured, try again later";
                    }
                });
        }
    }
};
</script>

<style lang="scss" scoped>
h2 {
    text-align: center;
}
#error-message {
    visibility: hidden;
    color: red;
}
// input {

// }
</style>
