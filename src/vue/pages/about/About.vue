<template>
    <div class="about">
        <img src="../../../../assets/icons/512x512.png" alt="Logo">

        <article>
            <h2>About us</h2>
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

        <article>
            Everyone can submit their ideas, suggenstions, bugs or whatsoever
            <browser-link href="https://github.com/Simonwep/candy/issues/new">
                here
            </browser-link>
            .
            Every contributor get's listed below if he's ok with that.
        </article>

        <article class="contributors">
            <h2>Contributors</h2>
            <template v-for="con of config.contributors">
                <browser-link v-if="con.github"
                              :key="con.name"
                              :href="con.github">
                    {{ con.name }}
                </browser-link>
                <span v-else :key="con.name">{{ con.name }}</span>
            </template>
        </article>
    </div>
</template>

<script>

    // Components
    import BrowserLink from '../../ui/specific/BrowserLink';


    export default {
        components: {BrowserLink},

        data() {
            return {};
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
        line-height: 1.25em;
        text-shadow: 0 0.1em 0.2em rgba(black, 0.1);

        > h2 {
            @include font(600, 1.2em);
            margin-bottom: 0.25em;
        }

        &.contributors {

            a, span {
                font-size: 0.9em;
                margin-left: 0.5em;
            }
        }
    }

</style>
