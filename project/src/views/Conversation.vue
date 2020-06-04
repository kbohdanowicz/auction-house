<template>
  <div v-if="conversation !== null" class="conversation">
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
        sendMessage () {
            if (this.messageInput === "") {
                console.log("Your message is empty!");
            } else {
                const message = {
                    handle: this.currentUser.username,
                    content: this.messageInput
                };
                const tempMessage = message;
                tempMessage.id = this.conversation._id;
                this.socket.emit("new-message", tempMessage);
                this.messageInput = "";
            }
        }
    },
    created () {
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
    },
    beforeDestroy () {
        if (this.currentUser.isAuth) {
            this.socket.emit("leave-conversation", {
                id: this.conversation._id,
                username: this.currentUser.username
            });
            console.log("Left conversation!");
        }
    }
};
</script>
