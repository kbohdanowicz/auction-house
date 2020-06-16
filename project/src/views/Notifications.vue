<template>
  <div class="notifications">
    <!-- <h2 class="header-text">Notifications</h2> -->
    <ul>
      <li v-for="notification in currentUser.notifications" :key="notification">
       {{ notification }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    name: "Home",
    components: {
    },
    data () {
        return {
        };
    },
    computed: {
        ...mapGetters(["currentUser"]),
        notifications () {
            return this.currentUser.notifications;
        }
    },
    created () {
        this.$store.dispatch("setIsNewNotificationFalse");
    }
};
</script>

<style lang="scss" scoped>
h2 {
    margin-top: 35px;
}
ul {
    margin-top: 65px;
    li {
        margin-top: 25px;
    }
}
</style>
