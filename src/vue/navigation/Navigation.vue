<template>
    <section class="navigation">
        <!-- Logo and content divider -->
        <img src="../../../assets/icons/512x512.png" alt="Logo">
        <div class="divider"></div>

        <!-- Downloads -->
        <nav-item v-slot="{item}"
                  :subs="downloadSubs"
                  class="downloads"
                  title="Downloads"
                  to="/">
            <p :data-text="item.text" class="list-item">
                <span class="text">{{ item.text }}</span>
                <span class="value">{{ item.value || '/' }}</span>
            </p>
        </nav-item>

        <!-- More menu links -->
        <nav-item title="Settings" to="/settings"/>
        <nav-item title="About" to="/about"/>
    </section>
</template>

<script>

    // Components
    import NavItem from './NavItem';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        components: {NavItem},

        data() {
            return {};
        },

        computed: {
            ...mapState(['downloads']),

            downloadSubs() {
                const {downloads} = this;

                return [
                    {text: 'All', value: downloads.length},
                    {text: 'Active', value: downloads.filter(v => v.status === 'progress').length},
                    {text: 'Done', value: downloads.filter(v => v.status === 'finish').length},
                    {text: 'Failed', value: downloads.filter(v => v.status === 'errored').length},
                    {text: 'Cancelled', value: downloads.filter(v => v.status === 'cancelled').length}
                ];
            }
        }
    };

</script>

<style lang="scss" scoped>

    .navigation {
        @include flex(column, center);
        background: $palette-theme-secondary;
        padding: 0.75em 0;

        > img {
            width: 5em;
            margin: 0.5em 0 1em;
        }
    }

    .divider {
        @include size(1px, 60%);
        background: rgba($palette-snow-white, 0.1);
        margin: 0.5em 0 1em;
    }

    .downloads {
        margin-bottom: auto;

        .list-item {
            @include flex(row, center);
            font-size: 0.9em;

            &[data-text='All'] .value {
                background: $palette-cloud-blue;
            }

            &[data-text='Active'] .value {
                background: $palette-nature-orange;
            }

            &[data-text='Done'] .value {
                background: $palette-success-green;
            }

            &[data-text='Failed'] .value {
                background: $palette-bright-red;
            }

            .value {
                @include font(700, 0.85em);
                background: $palette-theme-tertiary;
                padding: 0.2em 0.8em 0.2em;
                border-radius: 100em;
                text-shadow: 0 1px 3px rgba(black, 0.5);
                text-align: center;
                margin-left: auto;
                min-width: 2.25em;
            }

            .text {
                margin-right: 1.5em;
            }
        }
    }

</style>
