<template>
  <div>
    <h2 class="header-text">Conversation</h2>
    <div class="conversation" v-if="conversation !== null">
      <div id="no-messages" v-if="conversation.messages.length === 0">
        No messages
      </div>
    <div id="messages" v-else v-for="message in conversation.messages" :key="message._id">
      <strong>{{ message.handle }}:</strong> <div class="message-content">{{ message.content }}</div>
    </div>
    <div class="box">
      <textarea v-model="messageInput" placeholder="Type here"/>
      <div class="right">
        <button id="btn-send" @click="sendMessage()">Send</button>
      </div>
    </div>
    <div id="footer"></div>
</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import router from "../router";
import io from "@/../node_modules/socket.io-client";

export default {
    name: "Conversation",
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
        if (this.$route.params.conversation !== null) {
            this.leaveSocket();
        }
    }
};
</script>

<style lang="scss" scoped>
.conversation {
    margin: 45px auto;
    padding-top: 70px;
    //width: 50%;
    display: table;
}
#no-messages {
    margin-top: 5px;
}
#btn-send {
    margin-left: 0px;
}
textarea {
    resize: none;
    height: 50px;
}
.message-content {
    word-break: break-all;
}
.box {
    display: table;
    margin: 0 auto;
    //left: 50%;
    .right {
         display: table;
    margin: 0 auto;
    }
}
#footer {
    left: 0;
}
</style>
