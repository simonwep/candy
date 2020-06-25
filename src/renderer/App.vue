<template>
    <div id="app">
        <!-- Customiued title bar -->
        <app-title-bar/>

        <!-- Actual content -->
        <div class="content">
            <navigation/>
            <keep-alive>
                <router-view class="router"/>
            </keep-alive>
        </div>

        <!-- Static content -->
        <dialog-box/>
    </div>
</template>

<script>

    // Components
    import AppTitleBar from './AppTitleBar';
    import Navigation from './navigation/Navigation';
    import DialogBox from './ui/DialogBox';

    export default {

        components: {AppTitleBar, Navigation, DialogBox},

        data() {
            return {};
        }
    };

</script>

<style>
    @import '~@fortawesome/fontawesome-free/css/all.css';
    @import '~normalize.css';
    @import './scss/_reset.scss';
</style>

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
    }

    .navigation {
        height: 100%;
    }

    .router {
        flex-grow: 1;
        overflow: hidden;
    }

</style>
