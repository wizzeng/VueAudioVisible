<template>
    <div class="form-item">
        <label :for="title">
            {{title}}:
        </label>
        <div class="input-wrapper">
            <input :id="title"
                   :value="value"
                   @change="$emit('change', Number($event.target.value))"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Model} from 'vue-property-decorator'

    @Component
    export default class DemoInput extends Vue {
        @Prop({type: String}) title!: string;
        @Model('change', {type: Number}) readonly value!: number;
    }
</script>

<style scoped lang="scss">
    .form-item {
        display: flex;
        width: 50%;
        align-items: center;
        margin: 20px auto;

        label {
            min-width: 150px;
            text-align: left;
        }

        .input-wrapper {
            flex-grow: 1;
            height: 30px;
            border: 1px solid #b5b5b5;
            border-radius: 5px;
            overflow: hidden;
            transition: all .5s;

            &:hover, &:focus {
                border: 1px solid black;

                input {
                    color: black;
                }
            }

            input {
                color: #9c9c9c;
                display: block;
                border: none;
                width: calc(100% - 30px);
                height: 100%;
                outline: none;
                padding: 0 15px;
            }
        }
    }
</style>
