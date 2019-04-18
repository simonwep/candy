<template>
    <div :class="{'drop-down-selection': 1, open}">

        <button ref="activator">
            <i class="fas fa-fw fa-angle-down"></i>
            <span>{{ value ? (itemValueFilter ? itemValueFilter(value) : value) : title }}</span>
        </button>

        <div ref="items" class="items">
            <p v-for="item of preparedItems" @click="select(item)">{{ item.modified }}</p>
        </div>

    </div>
</template>

<script>

    export default {

        props: {
            title: {type: String, required: true},
            value: {type: String, default: ''},
            items: {type: Array, required: true},
            itemValue: {type: String, default: null},
            itemValueFilter: {type: Function, default: null}
        },

        data() {
            return {
                open: false,
                replacedTitle: null,
                outsideClickArguments: null
            };
        },

        computed: {
            preparedItems() {
                const {items, itemValue, itemValueFilter} = this;
                const prep = [];

                for (const item of items) {
                    const v = itemValue ? item[itemValue] : item;

                    if (!v) {
                        continue;
                    }

                    const v2 = itemValueFilter ? itemValueFilter(v) : v;

                    if (v2 && !prep.find(({modified}) => modified === v2)) {
                        prep.push({modified: v2, original: v});
                    }
                }

                return prep;
            }
        },

        mounted() {
            const {items, activator} = this.$refs;

            // Detect clicks outside of it and close it afterwards
            this.outsideClickArguments = this.utils.on(window, 'click', ({path}) => {
                if (path.includes(activator)) {
                    this.open = !this.open;
                } else if (!path.includes(items)) {
                    this.open = false;
                }
            });
        },

        destroyed() {
            this.utils.off(...this.outsideClickArguments);
        },

        methods: {

            select({modified, original}) {
                this.$emit('input', original);
                this.replacedTitle = modified;
                this.open = false;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .drop-down-selection {
        color: $palette-snow-white;

        &.open {

            button i {
                transform: rotate(180deg) translateY(0.1em);
            }

            .items {
                opacity: 1;
                visibility: visible;
                transform: none;
            }
        }
    }

    button {
        @include font(600, 0.8em);
        @include flex(row, center);
        @include white-space-overflow();
        align-self: stretch;
        display: inline-block;
        cursor: pointer;
        border: 1px solid rgba(black, 0.2);
        border-radius: 0.15em;
        padding: 0.5em 0.75em;
        text-transform: capitalize;

        i {
            margin-right: 0.5em;
            transition: all 0.3s;
            transform-origin: center;
        }

        span {
            margin-right: 0.25em;
        }
    }

    .items {
        @include white-space-overflow();
        position: absolute;
        background: $palette-theme-secondary;
        padding: 0.2em 0;
        margin-top: 0.5em;
        border-radius: 0.15em;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-0.5em);
        transition: all 0.3s;
        box-shadow: 0 0.05em 0.75em rgba(black, 0.25);
        max-height: 50vh;
        overflow: auto;
        z-index: 100;

        p {
            @include font(400, 0.85em);
            margin: 0.25em 0;
            padding: 0.5em 0.85em;
            transition: all 0.3s;
            cursor: pointer;
            text-transform: capitalize;

            &:hover {
                background: rgba(black, 0.075);
            }
        }
    }

</style>
