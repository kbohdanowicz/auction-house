<template>
  <div class="conversation" v-if="conversation !== null">
    <input v-model="messageInput" id="message-content" type="text" placeholder="Content">
    <button id="btn-send" @click="sendMessage()">Send</button>
    <div v-if="conversation.messages.length === 0">
        No messages
    </div>
    <div v-else v-for="message in conversation.messages" :key="message._id">
      <strong>{{ message.handle }}</strong>: {{ message.content }}
    </div>
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import router from "../router";
import io from "@/../node_modules/socket.io-client";

export default {
    name: "Auction",
    data () {
        return {
            socket: io(),
            messageInput: "",
            conversation: null
        };
    },
    computed: {
        ...mapGetters(["currentUser"])
    },
    methods: {
        getOtherUser (participants) {
            if (participants[0] === this.currentUser.username) {
                return participants[1];
            } else {
                return participants[0];
            }
        },
        sendMessage () {
            if (this.messageInput === "") {
                console.log("Your message is empty!");
            } else {
                const dataToSend = {
                    id: this.conversation._id,
                    handle: this.currentUser.username,
                    content: this.messageInput,
                    otherUser: this.getOtherUser(this.conversation.participants)
                };
                this.socket.emit("new-message", dataToSend);
                this.messageInput = "";
            }
        },
        leaveSocket () {
            if (this.currentUser.isAuth) {
                this.socket.emit("leave-conversation", {
                    id: this.conversation._id,
                    username: this.currentUser.username
                });
                console.log("Left conversation!");
            }
        }
    },
    created () {
        if (this.$route.params.conversation === undefined) {
            router.push({
                name: "MyConversations"
            });
            return;
        }
        this.conversation = this.$route.params.conversation;
        if (this.currentUser.isAuth) {
            this.socket.emit("join-conversation", {
                id: this.conversation._id,
                username: this.currentUser.username
            });
            console.log("Joined a conversation!");
        }

        this.socket.on("new-message", (data) => {
            this.conversation.messages.push(data);
            console.log(`New message from ${data.handle} has arrived!`);
        });

        window.onbeforeunload = () => {
            this.leaveSocket();
        };

        const msgs = this.conversation.messages;
        if (msgs.length >= 1 &&
            !msgs[msgs.length - 1].seen.includes(this.currentUser.username)) {
            this.socket.emit("update-conversation-seen", {
                id: this.conversation._id
            });
        }
    },
    beforeDestroy () {
        if (this.$route.params.conversation !== undefined) {
            this.leaveSocket();
        }
    }
};
</script>

<style lang="scss" scoped>
.conversation {
    margin-top: 70px;
    padding-top: 1px;
}
</style>
