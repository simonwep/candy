<template>
    <div class="tag-input-field">

        <!-- Tag list -->
        <div v-for="tag of value" class="tag">
            <span>{{ tag }}</span>
            <div @click="removeTag(tag)"></div>
        </div>

        <!-- New tag input -->
        <input v-model="newTag"
               :placeholder="placeholder"
               type="text"
               @keydown.enter="addTag">

    </div>
</template>

<script>

    export default {

        props: {
            placeholder: {type: String, default: 'Add tag...'},
            value: {type: Array, default: () => []}
        },

        data() {
            return {
                newTag: ''
            };
        },

        methods: {

            addTag() {
                const {newTag, value} = this;

                // Check if tag isn't empty and does not already exist
                if (newTag.length && !value.includes(newTag)) {
                    this.$emit('input', value.concat([newTag]));
                    this.newTag = '';
                }
            },

            removeTag(tag) {
                const {value} = this;

                const idx = this.value.indexOf(tag);
                if (~idx) {
                    const copy = [...value];
                    copy.splice(idx, 1);
                    this.$emit('input', copy);
                }
            }
        }
    };

</script>


<style lang="scss" scoped>

    .tag-input-field {
        @include flex(row, center);
        flex-wrap: wrap;
    }

    .tag {
        @include flex(row, center);
        border-radius: 0.2em;
        padding: 0.35em 1em 0.35em 0.75em;
        margin: 0 0.5em 0.5em 0;
        background: $palette-theme-tertiary;
        color: $palette-turquoise;

        @include animate('0.5s ease-in-out') {
            from {
                opacity: 0;
            }
        }

        > span {
            @include font(600, 0.75em);
            margin-right: 7px;
        }

        > div {
            @include size(0.75em);
            position: relative;
            cursor: pointer;
            padding-left: 10px;
            border-left: 1px solid $palette-turquoise;

            &::before,
            &::after {
                @include pseudo();
                @include position(0, 0, 0, 10px);
                @include size(2px, 100%);
                background: $palette-turquoise;
                margin: auto;
                border-radius: 100em;
                transition: all 0.3s;
            }

            &::before {
                transform: rotate(45deg);
            }

            &::after {
                transform: rotate(-45deg);
            }

            &:hover {
                &::before,
                &::after {
                    background: $palette-bright-red;
                }
            }
        }
    }

    input {
        @include font(600, 0.75em);
        font-size: 0.8em;
        height: 1.5em;
        margin: 0 0.65em 0.65em 0;
        color: $palette-snow-white;

        &::placeholder {
            color: $palette-theme-tertiary;
        }
    }


</style>
