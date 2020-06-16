<template>
  <div class="register">
    <h2 class="header-text">Register</h2>
    <!-- @submit handles any form of submission. -->
    <!-- .prevent keeps the event from bubbling around and doing anything else. -->
    <form class="login-form" @submit.prevent="handleSubmit()">
      <input class="input-login" v-model="user.username"
      type="text" name="username" id="username"
      placeholder="Username" minLength="2" maxLength="16" required="">
      <input v-model="user.password" type="password" name="password" id="password"
      placeholder="Password" maxLength="16" required="">
      <button type="submit">Register</button>
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

export default {
    name: "Register",
    data () {
        return {
            user: {
                username: "",
                password: ""
            },
            errorMessage: {
                isVisible: false,
                content: ""
            }
        };
    },
    methods: {
        isUsernameValid (str) {
            const nameRegex = /^[a-zA-Z0-9]+$/;
            return str.match(nameRegex) !== null;
        },
        showErrorMessage (message) {
            this.errorMessage.content = message;
            this.errorMessage.isVisible = true;
            setTimeout(() => {
                this.errorMessage.isVisible = false;
            }, 3000);
        },
        handleSubmit () {
            if (this.isUsernameValid(this.user.username)) {
                axios
                    .post("api/register", this.user)
                    .then(() => {
                        router.push({ name: "Login" });
                    })
                    .catch((err) => {
                        const status = err.response.status;
                        if (status === 401) {
                            this.showErrorMessage("Invalid credentials");
                        } else if (status === 422) {
                            this.showErrorMessage("Username is already taken");
                        } else {
                            this.showErrorMessage("Something went wrong");
                        }
                    });
            } else {
                this.showErrorMessage("Invalid username");
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.register {
    .login-form {
        display: table;
        margin: 0 auto;
        margin-top: 45px;
        padding-top: 1px;
        width: 80%;
        max-width: 300px;
        input{
            margin-bottom: 12px;
            font-size: 17px;
            border: 2px solid royalblue;
            border-radius: 4px;
            width: 100%;
            padding: 12px 14px;
            box-sizing: border-box;
        }
    }
    .input-login {
        margin-top: 60px;
    }
    button[type=submit] {
        display: table;
        margin: 0 auto;
        padding: 5px 8px;
    }
    #error-message {
        text-align: center;
        color: red;
        margin-top: 12px;
    }
}
</style>
