<template>
  <div id="navbar-mobile">
    <ul>
      <li v-if="currentUser.isAuth">
        <div id="welcome-message">Welcome <br>{{currentUser.username}}</div>
      </li>
      <li @click="openOrCloseNavBar()">
        <router-link to="/page/1">Home</router-link>
      </li>
      <li @click="openOrCloseNavBar()"
      v-if="currentUser.isAuth" class="nav-item">
        <router-link to="/my-bids/page/1">Bids</router-link>
      </li>
      <li @click="openOrCloseNavBar()"
      v-if="currentUser.isAuth" class="nav-item">
        <router-link to="/my-auctions/page/1">My offers</router-link>
      </li>
      <li @click="openOrCloseNavBar()"
      v-if="currentUser.isAuth" class="nav-item">
        <router-link to="/my-history/page/1">History</router-link>
      </li>
      <li @click="openOrCloseNavBar()"
      v-if="currentUser.isAuth" class="nav-item">
        <router-link to="/my-conversations">Conversations</router-link>
      </li>
      <li @click="openOrCloseNavBar()"
      v-if="currentUser.isAuth" class="nav-item">
        <a @click="logout()">Log out</a>
      </li>
      <li @click="openOrCloseNavBar()"
      v-if="!currentUser.isAuth" class="nav-item">
        <router-link to="/login">Log in</router-link>
      </li>
      <li @click="openOrCloseNavBar()"
      v-if="!currentUser.isAuth" class="nav-item">
        <router-link to="/register">Register</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "NavbarMobile",
    computed: {
        ...mapGetters(["currentUser"])
    },
    props: ["showSideBar"],
    methods: {
        ...mapActions(["fetchCurrentUser"]), // raczej useless
        openOrCloseNavBar () {
            this.$emit("swap");
        },
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
#navbar-mobile {
    background-color: rgba(65, 105, 225, 0.8);
    height: 100vh;
    ul {
        position: fixed;
        list-style: none;
        width: 56vw;
        li {
            word-break: break-all;
            font-family: 'Montserrat', sans-serif;
            font-size: 25px;
            //padding: 0px 0px;
            color: white;
            margin-bottom: 20px;
            a {
                cursor: pointer;
                text-align: center;
                text-decoration: none;
                color: white;
            }
            a:hover {
                cursor: pointer;
            }
        }
    }
}
</style>
