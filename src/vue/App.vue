<template>
    <div id="app">
        <router-view class="router"/>
    </div>
</template>

<script>

    // Font-awesome styles
    import '@fortawesome/fontawesome-free/css/all.css';

    // Normalize css to look (almost) equal on all browsers
    import 'normalize.css';

    export default {

        components: {},

        data() {
            return {};
        }

    };

</script>

<style lang="scss" scoped>

    #app {
        position: fixed;
        @include position(0, 0, 0, 0);
        @include flex(column);
        font-family: 'Open Sans';

        .router {
            flex-grow: 1;
        }
    }


</style>
