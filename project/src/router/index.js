import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import MyBids from "../views/MyBids.vue";
import MyAuctions from "../views/MyAuctions.vue";
import AuctionForm from "../views/AuctionForm.vue";
import Error404 from "../views/Error404.vue";
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
        path: "/conversation",
        name: "Conversation",
        component: Conversation
    },
    {
        path: "/my-conversations",
        name: "MyConversations",
        component: MyConversations
    },
    {
        path: "/404",
        name: "Error404",
        component: Error404
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

// TODO register should not be reachable by logged user
// make better
router.beforeEach(async (to, from, next) => {
    await store.dispatch("fetchCurrentUser");
    if (to.name === "Error404") {
        next();
    } else if (!isInRoutes(to.name)) {
        next({ name: "Error404" });
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
            next({ name: "Home" });
        } else {
            next();
        }
    }
});

export default router;
