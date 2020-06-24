<template>
    <div class="about">
        <img :src="logo" alt="Logo">

        <article>
            <h2>Candy YT Downloader</h2>
            Candy is developed and maintained by
            <browser-link href="https://github.com/Simonwep">
                Simon Reinisch
            </browser-link>
            and is published under the
            <browser-link href="https://choosealicense.com/licenses/mit/">
                MIT License
            </browser-link>
            on
            <browser-link href="https://github.com/Simonwep/candy">
                GitHub
            </browser-link>
            .
        </article>
    </div>
</template>

<script>

    // Components
    import BrowserLink from '../../ui/specific/BrowserLink';
    import logo from '../../../../static/icons/512x512.png';

    export default {
        components: {BrowserLink},

        data() {
            return {logo};
        }
    };

</script>

<style lang="scss" scoped>

    .about {
        @include flex(column, center, center);
        color: $palette-snow-white;

        > img {
            width: 10em;
            fill: $palette-turquoise;
            margin-bottom: 1.5em;
            filter: drop-shadow(0 0.15em 0.75em rgba(black, 0.45));
        }
    }

    article {
        @include width(50vw, 10em, 30em);
        font-size: 1.1em;
        text-align: center;
        margin: 0.75em 0 0.5em;
        line-height: 1.45em;
        text-shadow: 0 0.1em 0.2em rgba(black, 0.1);

        > h2 {
            @include font(600, 1.2em);
            margin-bottom: 0.25em;
        }
    }

</style>
