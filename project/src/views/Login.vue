<template>
  <div class="login">
    <h2 class="header-text">Log in</h2>
    <form class="login-form" @submit.prevent="handleSubmit()" ref="form">
      <input class="input-login" v-model="formData.username"
      type="text" name="username" id="username"
      placeholder="Username" minLength="2" maxLength="16" required="">
      <br><br>
      <input v-model="formData.password" type="password" name="password" id="password"
      placeholder="Password" required="">
      <br><br>
      <button class="btn-submit" type="submit">Log in</button>
      <div id="error-message" v-if="errorMessage.isVisible">
        {{ errorMessage.content }}
      </div>
    </form>
    <div class="blank"></div>
    <div id="footer"></div>
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
            },
            errorMessage: {
                isVisible: false,
                content: ""
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
                    router.push({
                        name: "Home",
                        params: { page: 1 }
                    });
                })
                .catch((err) => {
                    if (err.response.status === 401) {
                        this.errorMessage.content = "Invalid credentials";
                    } else {
                        this.errorMessage.content = "Something went wrong";
                    }
                    this.errorMessage.isVisible = true;
                    setTimeout(() => {
                        this.errorMessage.isVisible = false;
                    }, 3000);
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
    text-align: center;
    color: red;
}
.login-form {
    display: table;
    margin: 0 auto;
    margin-top: 45px;
    padding-top: 1px;
}
.input-login {
    margin-top: 60px;
    padding-top: 1px;
}
button[type=submit] {
    display: table;
    margin: 0 auto;
}
</style>
