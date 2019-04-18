<template>
    <div :class="{'text-input-field': 1, focused}">

        <!-- Placeholder, will be moved if input contains text -->
        <label :class="{placeholder: 1, moved: value || focused}" :for="labelId">{{ placeholder }}</label>

        <div class="field">
            <input ref="input"
                   :autofocus="autofocus ? 'autofocus' : ''"
                   :class="{empty: !value}"
                   :id="labelId"
                   :type="password && !showPwd ? 'password' : 'text'"
                   :value="value"
                   spellcheck="false"
                   @blur="focused = false"
                   @focus="focused = true"
                   @input="$emit('input', $event.target.value)"
                   @keyup.enter="$emit('submit')">


            <!-- Show password -->
            <i v-if="password"
               :class="`show-pwd fas fa-fw fa-${showPwd ? 'eye' : 'eye-slash'}`"
               @click="showPwd = !showPwd"></i>

            <!-- Clear input -->
            <i :class="{'clear fas fa-fw fa-times': 1, visible: value}"
               @click="$emit('input', '')"></i>
        </div>

        <!-- Colored border to show focus -->
        <span class="border"></span>

    </div>
</template>

<script>

    export default {
        props: {
            placeholder: {type: String, required: true},
            password: {type: Boolean, default: false},
            autofocus: {type: Boolean, default: false},
            value: {type: String, default: null}
        },

        data() {
            return {
                showPwd: false,
                focused: false,
                labelId: `label-${(Date.now() + Math.floor(Math.random() * 1e15)).toString(36)}`
            };
        }
    };

</script>

<style lang="scss" scoped>


    .text-input-field {
        position: relative;
        @include inline-flex(row, center);
        border-radius: 0.15em;
        transition: all 0.3s;
        padding-top: 0.75em;
        margin: 0 0.25em;
        font-size: 1.05em;

        &.focused {

            .placeholder {
                color: $palette-turquoise;
            }

            .border::after {
                width: 100%;
                background: $palette-turquoise;
            }
        }
    }

    .border {
        position: absolute;
        @include position(auto, 0, 0, 0);
        @include size(1px, 100%);
        opacity: 0.75;

        &::before,
        &::after {
            @include pseudo();
            @include size(1px, 100%);
            background: $palette-theme-tertiary;
        }

        &::after {
            width: 0;
            transition: all 0.3s ease-in-out;
        }
    }

    .placeholder {
        position: absolute;
        color: $palette-theme-tertiary;
        transition: all 0.3s;
        @include font(600, 0.8em);

        &.moved {
            transform: translateY(-120%) scale(0.85);
            transform-origin: left;
            opacity: 0.9;
        }
    }

    .field {
        @include flex(row, center);
        width: 100%;

        input {
            @include font(600, 0.75em);
            padding: 0.9em 0 0.8em;
            width: 100%;
            z-index: 2;
            color: $palette-snow-white;
        }

        i {
            font-size: 0.8em;
            color: $palette-theme-tertiary;
            cursor: pointer;
            transition: all 0.3s;

            &.show-pwd {
                @include fixed-width(1.25em);

                &:hover {
                    color: $palette-turquoise;
                }
            }

            &.clear {
                opacity: 0;
                transform: rotate(90deg);
                pointer-events: none;

                &:hover {
                    color: $palette-bright-red;
                }

                &.visible {
                    opacity: 1;
                    transform: none;
                    pointer-events: all;
                    max-width: 1em;
                    margin-left: 0.35em;
                }
            }
        }
    }

</style>
