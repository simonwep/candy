<template>
    <div id="app">

        <!-- Customiued title bar -->
        <app-title-bar/>

        <!-- Actual content -->
        <div class="content">
            <navigation/>
            <router-view class="router"/>
        </div>

    </div>
</template>

<script>

    // Font-awesome and normalize.css
    import '@fortawesome/fontawesome-free/css/all.css';
    import 'normalize.css';

    // Components
    import AppTitleBar from './AppTitleBar';
    import Navigation  from './navigation/Navigation';

    export default {

        components: {AppTitleBar, Navigation},

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
        font-family: 'Open Sans', sans-serif;
        background: $palette-theme-tertiary;
        user-select: none;
    }

    .content {
        @include flex(row);
        height: 100%;
        flex-grow: 1;

        .navigation {
            height: 100%;
        }

        .router {
            flex-grow: 1;
            overflow: hidden;
        }
    }

</style>
