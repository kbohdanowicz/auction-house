import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import MyAuctions from "../views/MyAuctions.vue";
import Auction from "../views/Auction.vue";
import AuctionForm from "../views/AuctionForm.vue";
import Error404 from "../views/Error_404.vue";
import store from "../store";

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
        path: "/my-history",
        name: "MyHistory",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () {
            return import("../views/MyHistory.vue");
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
    },
    {
        path: "/404",
        name: "Error_404",
        component: Error404
    }
];

// const guard (to, from, next) => {
//     if(store.state.auth.loggedIn) {
//         // or however you store your logged in state
//         next(); // allow to enter route
//     } else{
//         next('/login'); // go to '/login';
//     }

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

// TODO let unlogged user get to /auction/id=
router.beforeEach((to, from, next) => {
    store.dispatch("fetchCurrentUser");
    console.log("Route " + to.name + " is " + isInRoutes(to.name));
    if (to.name === "Error_404") {
        // do nothing
    } else if (!isInRoutes(to.name)) {
        next({ name: "Error_404" });
    } else if (to.name === "Register" || to.name === "Home" || to.name === "Auction") {
        next();
    } else if (to.name !== "Login" && !store.getters.currentUser.isAuth) {
        console.log("Not logged in. Redirecting to login page");
        // next({ name: "Login" });
    } else if (to.name === "Login" && store.getters.currentUser.isAuth) {
        console.log("Logged in. Redirecting to home page");
        next({ name: "Home" });
    } else {
        console.log("Other");
        next();
    }
});

export default router;
