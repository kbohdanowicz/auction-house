<template>
  <div class="error-404">
    <p>Error 404. This page doesn't exist</p>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
    name: "Error404",
    computed: {
        ...mapGetters(["currentUser"])
    }
};
</script>
