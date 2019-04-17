<template>
    <section class="navigation">

        <candy-icon/>

        <div class="divider"></div>

        <!-- Downloads -->
        <nav-item v-slot="{item}"
                  :subs="downloadSubs"
                  class="downloads"
                  title="Downloads"
                  to="/downloads">

            <p :data-text="item.text" class="list-item">
                <span class="text">{{ item.text }}</span>
                <span class="value">{{ item.value || '/' }}</span>
            </p>
        </nav-item>

        <!-- Settings -->
        <nav-item class="settings"
                  title="Settings"
                  to="/settings"/>
        <nav-item class="about"
                  title="About"
                  to="/about"/>

    </section>
</template>

<script>

    // Components
    import CandyIcon  from '../ui/specific/CandyIcon';
    import NavItem    from './NavItem';
    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        components: {CandyIcon, NavItem},

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
                    {text: 'Failed', value: downloads.filter(v => v.status === 'errored').length}
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

        .candy-icon {
            fill: $palette-turquoise;
            @include size(5em);
            margin: 0.5em 0 1em;
        }
    }

    .divider {
        @include size(1px, 60%);
        background: rgba(white, 0.1);
        margin: 0.5em 0 1em;
    }

    .downloads {

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
            }

            .text {
                margin-right: 1.5em;
            }
        }
    }

    .settings {
        margin-top: auto;
    }

</style>
