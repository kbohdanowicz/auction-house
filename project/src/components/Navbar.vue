<template>
  <div class="navbar">
    <header>
      <nav>
        <ul>
          <li>
            <!-- all auctions -->
            <router-link to="/">Home</router-link>
          </li>
          <li v-if="currentUser.isAuth" class="nav-item">
            <router-link to="/my-bids">My bids</router-link>
          </li>
          <li v-if="currentUser.isAuth" class="nav-item">
            <router-link to="/my-auctions">My offers</router-link>
          </li>
          <li v-if="currentUser.isAuth" class="nav-item">
            <router-link to="/my-history">My History</router-link>
          </li>
          <!-- on the right side -->
          <li v-if="currentUser.isAuth" class="nav-item">
            <a @click="logout()">Log out</a>
          </li>
          <!-- <div v-else></div> -->
          <li v-if="!currentUser.isAuth" class="nav-item">
            <router-link to="/login">Log in</router-link>
          </li>
          <li v-if="!currentUser.isAuth" class="nav-item">
            <router-link to="/register">Register</router-link>
          </li>
        </ul>
      </nav>
    </header>
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
    methods: {
        ...mapActions(["fetchCurrentUser"]),
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
* {
    //box-sizing: border-box;
    margin: 0;
    padding: 0;
    background-color: royalblue;
}

ul {
    //list-style: none;

    li {
        font-family: 'Montserrat', sans-serif;
        //font-weight: 500;
        //font-size: 16px;
        //text-decoration: none;
        display: inline-block;
        //padding: 0px 25px;
        a {
            padding: 20px 25px;
            text-decoration: none;
            color: white;
        }
        a:hover {
            color: lightgray;
            cursor: pointer;
        }
    }
}

header {
    //display: flex;
    //justify-content: space-between;
    //align-items: center;
    padding: 20px 5%;
}
</style>
