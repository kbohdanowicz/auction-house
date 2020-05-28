<template>
  <div class="navbar">
    <header>
      <nav>
        <ul>
          <li>
            <!-- all auctions -->
            <router-link to="/">Home</router-link>
          </li>
          <!-- <div v-if isAuthenticated></div> -->
          <li class="nav-item">
            <router-link to="/my-auctions">My auctions</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/my-history">My History</router-link>
          </li>
          <!-- on the right side -->
          <li class="nav-item">
             <router-link to="/logout">Log out</router-link>
          </li>
          <!-- <div v-else></div> -->
          <li class="nav-item">
            <router-link to="/login">Log in</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/register">Register</router-link>
          </li>
        </ul>
      </nav>
    </header>
  </div>
</template>

<script>
import api from "../modules/api";
import router from "../router";

export default {
    name: "Navbar",
    data () {
        return {
            isAuthenticated: {
                type: Boolean,
                default: false
            }
        };
    },
    methods: {
        logout () {
            api()
                .post("/logout")
                .then(() => {
                    router.push("/");
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
