<template>
  <div id="navbar-mobile">
    <ul>
      <li v-if="currentUser.isAuth">
        <div id="welcome-message">Welcome {{currentUser.username}}</div>
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
// import router from "../router";
import { mapGetters, mapActions } from "vuex";

export default {
    name: "Navbar",
    computed: {
        ...mapGetters(["currentUser"])
    },
    props: ["showNav"],
    data () {
        return {
        };
    },
    methods: {
        ...mapActions(["fetchCurrentUser"]),
        openOrCloseNavBar () {
            this.$emit("swap");
        },
        logout () {
            axios
                .get("/api/logout")
                .then(() => {
                    // router.push("/"); // uncaught exception error
                    location.reload();
                })
                .catch((err) => {
                    console.log(err);
                    // location.reload();
                });
        }
    }
};
</script>

<style lang="scss" scoped>
#navbar-mobile {
    // padding: 20px 0 0 0;
    // z-index: 125555;
    ul {
        position: fixed;
        // height: 100vh;
        background-color: royalblue;
        list-style: none;
        width: 58%;
        li {
            font-family: 'Montserrat', sans-serif;
            font-size: 25px;
            padding: 0px;
            color: #fff;
            margin-bottom: 20px;
            cursor: pointer;
            a {
                text-align: center;
                padding: 14px 0px;
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
