<template>
    <li class="auction-item">
        {{ auction }}
    </li>
</template>

<script>

export default {
    props: ["auction"],
    data () {
        return {
        };
    },
    computed: {
    },
    methods: {
    },
    created () {
        // włączenie obsługi pewnych zdarzeń
    },
    beforeDestroy () {
        // wyłączenie obsługi pewnych zdarzeń
        // this.$root.$off("zdarzenie");
    }
};
</script>

<style lang="scss" scoped>
</style>
