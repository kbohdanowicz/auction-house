<template>
  <div class="conversations">
    <h2 class="header-text">Conversations</h2>
    <ul v-if="conversations !== null">
      <li v-if="conversations.length <= 0" class="no-content-message">
        <h2>No conversations :(</h2>
      </li>
      <li class="conversation" v-for="conversation in conversations"
      :key="conversation._id">
        {{ getOtherUser(conversation.participants) }}
        <br>
        <button id="btn-show-conversation" @click="goToConversation(conversation)">
          Open
        </button>
        <strong v-if="isAnyMessageUnRead(conversation.messages)">
          (!)
        </strong>
      </li>
      <li class="blank">Blank</li>
    </ul>
    <div id="footer"></div>
  </div>
</template>

<script>
import axios from "axios";
import router from "../router";
import { mapGetters } from "vuex";

export default {
    name: "MyConversations",
    data () {
        return {
            conversations: null
        };
    },
    computed: {
        ...mapGetters(["currentUser"])
    },
    methods: {
        isAnyMessageUnRead (messages) {
            const fun = msg => !msg.seen.includes(this.currentUser.username);
            return messages.some(fun);
        },
        getOtherUser (participants) {
            if (participants[0] === this.currentUser.username) {
                return participants[1];
            } else {
                return participants[0];
            }
        },
        goToConversation (_conversation) {
            router.push({
                name: "Conversation",
                params: { conversation: _conversation }
            });
        }
    },
    async created () {
        await axios
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

<style lang="scss" scoped>
.conversations {
    margin-top: 45px;
    padding-top: 1px;
    ul {
        list-style-type: none;
        display: table;
        margin: 0 auto;
        margin-top: 35px;
        padding-left: 0;
        li {
            text-align: center;
            padding-top: 20px;
            button {
                margin: 8px 0;
            }
        }
    }
}
</style>
