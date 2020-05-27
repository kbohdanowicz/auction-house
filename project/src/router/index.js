import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import MyAuctions from "../views/MyAuctions.vue";
import Auction from "../views/Auction.vue";
import AuctionForm from "../views/AuctionForm.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path: "/my-auctions",
        name: "MyAuctions",
        component: MyAuctions
    },
    {
        path: "/auctions-history",
        name: "AuctionsHistory",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () {
            return import("../views/AuctionsHistory.vue");
        }
    },
    {
        path: "/auction/:id",
        name: "Auction",
        component: Auction
    },
    {
        path: "/auction",
        name: "AuctionForm",
        component: AuctionForm
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
