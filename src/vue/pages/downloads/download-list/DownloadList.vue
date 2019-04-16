<template>
    <div class="download-list">
        <download-item :card-size="cardSize" :download="download" v-for="download of downloads"/>
    </div>
</template>

<script>

    // Vuex stuff
    import {mapState}   from 'vuex';
    // Components
    import DownloadItem from './DownloadListItem';

    export default {
        components: {DownloadItem},

        props: {
            cardSize: {type: String, default: 'big'}
        },

        data() {
            return {};
        },

        computed: {
            ...mapState(['downloads'])
        }
    };

</script>

<style lang="scss" scoped>

    .download-list {

    }

    .download-item {
        margin: 1em 2em;
    }

</style>
