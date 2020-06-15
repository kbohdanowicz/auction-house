<template>
  <div class="conversation">
    <h2 class="header-text">{{ getOtherUser(conversation.participants) }}</h2>
    <div class="container" :class="{'desktop-view':!mobileView}">
      <ul v-if="conversation !== null">
        <li id="no-messages" v-if="conversation.messages.length === 0">
          <h2>Type something!</h2>
        </li>
        <li id="message" :class="checkCurrentUser(message)"
        v-else v-for="message in conversation.messages" :key="message._id">
          <div class="message-handle">{{ message.handle }}</div>
          <div class="message-content">{{ message.content }}</div>
        </li>
        <li id="bottom-chat"></li>
      </ul>
      <div class="box">
        <textarea :class="{'desktop-text-area':!mobileView}" maxlength="100"
         v-model="messageInput" placeholder="Type here"/>
        <div>
          <button @click="sendMessage()">Send</button>
        </div>
      </div>
    </div>
    <div id="footer"></div>
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
            conversation: null,
            mobileView: true
        };
    },
    computed: {
        ...mapGetters(["currentUser"])
    },
    methods: {
        checkCurrentUser (message) {
            if (this.$store.getters.currentUser.username === message.handle) {
                return "message-current-user";
            } else {
                return "message-other-user";
            }
        },
        getOtherUser (participants) {
            if (participants[0] === this.currentUser.username) {
                return participants[1];
            } else {
                return participants[0];
            }
        },
        isEmptyOrSpaces (str) {
            return str === "" || str.match(/^ *$/) !== null;
        },
        sendMessage () {
            this.messageInput.trim();
            if (this.isEmptyOrSpaces(this.messageInput)) {
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
                document.getElementById("bottom-chat").scrollIntoView();
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
        },
        handleView () {
            // console.log("Width: " + window.innerWidth);
            this.mobileView = window.innerWidth <= 680;
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
        this.mobileView = this.$route.params.mobileView;

        this.handleView();
        window.addEventListener("resize", this.handleView, false);

        if (this.currentUser.isAuth) {
            this.socket.emit("join-conversation", {
                id: this.conversation._id,
                username: this.currentUser.username
            });
            console.log("Joined a conversation!");
        }

        this.socket.on("new-message", async (data) => {
            await this.conversation.messages.push(data);
            console.log(`New message from ${data.handle} has arrived!`);
            document.getElementById("bottom-chat").scrollIntoView();
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
    mounted () {
        document.getElementById("bottom-chat").scrollIntoView();
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
    .header-text {
        width: 100vw;
        word-break: break-all;
    }
    .container {
        margin: 45px auto;
        ul {
            border-bottom: solid royalblue;
            margin-top: 48px;
            padding-top: 70px;
            padding-left: 0;
            height: 50vh;
            overflow: auto;
            list-style-type: none;
            li {
                margin: 5px auto;
                .message-handle {
                    font-size: 12px;
                    margin: 0 10px;
                }
                .message-content {
                    margin: 0 10px;
                    word-break: break-all;
                }
            }
            #no-messages {
                padding: 10px;
                display: table;
                margin: 10vh auto;
            }
            #message {
                max-width: 250px;
                background-color: #dfdfdf;
                border-radius: 6px;
                margin-bottom: 10px;
                padding: 5px 0px;
            }
            .message-other-user {
                margin-left: 8px;
                .message-handle {
                    color: red;
                }
            }
            .message-current-user {
                margin-right: 8px;
                text-align: right;
                .message-handle {
                    color: royalblue;
                }
            }
        }
        .box {
            display: table;
            margin: 0 auto;
            textarea {
                resize: none;
                height: 13vh;
                width: 60vw;
            }
            button {
                display: table;
                margin: 8px auto;
                color: white;
                background-color: royalblue;
                border-radius: 8px;
                padding: 4px 12px;
                font-size: 18px;
                cursor: pointer;
            }
        }
    }
    .container.desktop-view {
        display: table;
        width: 36vw;
    }
    #footer {
        left: 0;
    }
}
.desktop-text-area{
    max-width: 30vw;
}
</style>
