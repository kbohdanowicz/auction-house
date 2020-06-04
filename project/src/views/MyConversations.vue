<template>
  <div class="conversations">
    <h2>Your conversations</h2>
    <ul>
      <li class="conversation-list" v-for="conversation in conversations"
      :key="conversation._id">
        <h3>Conversation</h3>
        {{ getOtherUser }}
        <button id="btn-show-conversation" @click="goToConversation(conversation)">
          Details
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";

export default {
    name: "Home",
    data () {
        return {
            conversations: null
        };
    },
    computed: {
        getOtherUser () {
            return "OtherUser";
        }
    },
    methods: {
        goToConversation (_conversation) {
            router.push({
                name: "Conversation",
                params: { conversation: _conversation }
            });
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
