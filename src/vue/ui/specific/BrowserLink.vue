<template>

    <!-- Normally a link would be opened inside the electron application. To prevent this a custom link is required -->
    <a class="browser-link" @click.prevent="href && shell.openExternal(href)">
        <slot></slot>
    </a>
</template>

<script>

    // Shell
    import {shell} from 'electron';

    export default {

        props: {
            href: {type: String, default: null}
        },

        data() {
            return {shell};
        }
    };

</script>

<style lang="scss" scoped>

    .browser-link {
        cursor: pointer;
    }

</style>
