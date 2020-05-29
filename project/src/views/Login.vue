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
                    router.push("/");
                })
                .catch((err) => {
                    console.log(err);
                    location.reload();
                });
        }
    }
    // }// ,
    // destroyed () {
    //     alert("destroyed");
    //     this.$store.dispatch("fetchCurrentUser");
    // }
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
