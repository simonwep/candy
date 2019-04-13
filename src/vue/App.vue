<template>
    <div id="app">
        <navigation/>
        <router-view class="router"/>
    </div>
</template>

<script>

    // Font-awesome and normalize.css
    import '@fortawesome/fontawesome-free/css/all.css';
    import 'normalize.css';

    // Components
    import Navigation from './navigation/Navigation';

    export default {

        components: {Navigation},

        data() {
            return {};
        }

    };

</script>

<style lang="scss" scoped>

    #app {
        position: fixed;
        @include position(0, 0, 0, 0);
        @include flex(row);
        font-family: 'Open Sans', sans-serif;
        background: $palette-theme-tertiary;
        user-select: none;

        .router {
            flex-grow: 1;
        }
    }


</style>
