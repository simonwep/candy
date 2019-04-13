<template>
    <div class="downloads">

        <div class="header">
            <div class="url-input">
                <i class="fas fa-fw fa-search"></i>
                <input type="text" placeholder="Enter video or playlist url">
            </div>
        </div>

    </div>
</template>

<script>

    export default {

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .downloads {
        @include flex(column);
    }

    .header {
        flex-shrink: 0;
        background: $palette-theme-secondary;
        border-left: 1px solid $palette-theme-tertiary;
        padding: 1em 2em;

        .url-input {
            @include flex(row, center);
            @include width(50vw, auto, 30em);
            background: $palette-theme-tertiary;
            padding: 0.5em 0.75em;
            border-radius: 0.1em;
            color: white;

            &:focus-within i {
                color: white;
            }

            > i {
                font-size: 0.75em;
                margin-right: 0.75em;
                transition: all 0.3s;
                color: rgba(white, 0.6);
            }

            > input {
                font-family: 'Source Sans Pro';
                flex-grow: 1;
                @include font(400, 0.9em);

                &::placeholder {
                    color: rgba(white, 0.6);
                }
            }
        }
    }

</style>
