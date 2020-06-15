import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import MyBids from "../views/MyBids.vue";
import MyAuctions from "../views/MyAuctions.vue";
import AuctionForm from "../views/AuctionForm.vue";
import AuctionEdit from "../views/AuctionEdit.vue";
import Conversation from "../views/Conversation.vue";
import MyConversations from "../views/MyConversations.vue";
import store from "../store";

Vue.use(VueRouter);

const routes = [
    {
        path: "/page/:page(\\d+)",
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
        path: "/my-bids/page/:page(\\d+)",
        name: "MyBids",
        component: MyBids
    },
    {
        path: "/my-auctions/page/:page(\\d+)",
        name: "MyAuctions",
        component: MyAuctions
    },
    {
        path: "/my-history/page/:page(\\d+)",
        name: "MyHistory",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () {
            return import("../views/MyHistory.vue");
        }
    },
    {
        path: "/auction",
        name: "Auction",
        component: AuctionForm
    },
    {
        path: "/auction-edit",
        name: "AuctionEdit",
        component: AuctionEdit
    },
    {
        path: "/conversation",
        name: "Conversation",
        component: Conversation
    },
    {
        path: "/my-conversations",
        name: "MyConversations",
        component: MyConversations
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

const isInRoutes = (name) => {
    const routeNames = [];
    router.options.routes.forEach(route => {
        routeNames.push(route.name);
    });
    return routeNames.includes(name);
};

router.beforeEach(async (to, from, next) => {
    await store.dispatch("fetchCurrentUser");
    if (!isInRoutes(to.name)) {
        next({ name: "Home", params: { page: 1 } });
    } else if (!store.getters.currentUser.isAuth) {
        if (to.name === "Register" ||
            to.name === "Login" ||
            to.name === "Home") {
            next();
        } else {
            next({ name: "Login" });
        }
    } else if (store.getters.currentUser.isAuth) {
        if (to.name === "Register" ||
            to.name === "Login") {
            next({ name: "Home", params: { page: 1 } });
        } else {
            next();
        }
    }
});

export default router;
