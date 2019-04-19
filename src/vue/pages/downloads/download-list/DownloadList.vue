<template>
    <div class="download-list">

        <div v-if="downloads.length" class="list">
            <download-item v-for="download of downloads"
                           :card-size="cardSize"
                           :download="download"/>
        </div>

        <p v-else class="placeholder">
            Currently no downloads active.
        </p>
    </div>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

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
        @include flex(column, center, center);
        height: 100%;
    }

    .list {
        @include size(100%);

        .download-item {
            margin: 1em 2em;
        }
    }

    .placeholder {
        @include font(400, 1.1em);
        color: $palette-snow-white;
    }

</style>
