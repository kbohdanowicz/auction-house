<template>
  <div class="conversations">
    <h2>Your conversations</h2>
    <img alt="Vue logo" src="../assets/logo.png"><br>
    <div v-if="currentUser.isAuth">
      Welcome {{currentUser.username}}
    </div>
    <Conversations v-bind:conversations="conversations"/>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import Conversations from "@/components/Conversations";
import { mapGetters } from "vuex";

export default {
    name: "Home",
    components: {
        Conversations
    },
    data () {
        return {
            conversations: null
        };
    },
    computed: {
        ...mapGetters(["currentUser"])
    },
    methods: {
        goToAuctionForm () {
            router.push("/conversation");
        }
    },
    created () {
        axios
            .get("/api/conversations")
            .then((resp) => {
                this.conversations = resp.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }
};
</script>
