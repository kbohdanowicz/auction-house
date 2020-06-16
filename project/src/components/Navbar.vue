<template>
  <div id="navbar">
    <ul>
      <li v-if="currentUser.isAuth">
        <router-link :class="checkIsNewNotification" to="/notifications">(!)</router-link>
      </li>
      <li>
        <router-link to="/page/1">Home</router-link>
      </li>
      <li v-if="currentUser.isAuth" class="nav-item">
        <router-link to="/my-bids/page/1">Bids</router-link>
      </li>
      <li v-if="currentUser.isAuth" class="nav-item">
        <router-link to="/my-auctions/page/1">My offers</router-link>
      </li>
      <li v-if="currentUser.isAuth" class="nav-item">
        <router-link to="/my-history/page/1">History</router-link>
      </li>
      <li v-if="currentUser.isAuth" class="nav-item">
        <router-link to="/my-conversations">Conversations</router-link>
      </li>
      <li v-if="currentUser.isAuth">
        <a class="log-item" @click="logout()">Log out</a>
      </li>
      <li v-if="!currentUser.isAuth">
        <router-link class="log-item" to="/login">Log in</router-link>
      </li>
      <li v-if="!currentUser.isAuth">
        <router-link  class="log-item" to="/register">Register</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "Navbar",
    computed: {
        ...mapGetters(["currentUser"]),
        checkIsNewNotification () {
            console.log("Checking notifications");
            let str;
            if (this.$store.getters.currentUser.isNewNotification) {
                str = "red";
            }
            return str;
        }
    },
    data () {
        return {
        };
    },
    methods: {
        ...mapActions(["fetchCurrentUser"]),
        // checkIsNewNotification () {
        //     console.log("Checking notifications");
        //     let str;
        //     if (this.currentUser.isNewNotification) {
        //         str = "red";
        //     }
        //     return str;
        // },
        logout () {
            axios
                .get("/api/logout")
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
#navbar {
    margin: 0;
    padding: 0;
    width: 100vw;
}
ul {
    position: fixed;
    top: 0;
    width: 100%;
    overflow: hidden;
    margin: 0;
    background-color: royalblue;
    list-style-type: none;
    .log-item {
        float:right;
    }
    .white {
        color: white;
    }
    .red {
        color: red;
    }
    li {
        float: left;
        font-family: 'Montserrat', sans-serif;
        a {
            border-left: 1px solid rgba(173, 173, 173, 0.2);
            display: block;
            text-decoration: none;
            color: white;
            text-align: center;
            padding: 14px 16px;
        }
        #welcome-message {
            display: block;
            text-decoration: none;
            color: white;
            text-align: center;
            padding: 14px 16px;
        }
        a:hover {
            background-color: rgb(2, 25, 43);
            cursor: pointer;
        }
    }
}
</style>
