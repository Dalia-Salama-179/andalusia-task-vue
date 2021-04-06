<template>
    <div>
        <td v-if="!dataItem.inEdit" :class="className">{{ dataItem[field]}}</td>
        <td v-else><select class="k-textbox" @change="change">
            <option>Purchase UOM</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
        </select></td>
    </div>
</template>
<script>

    export default {
        props: {
            field: String,
            dataItem: Object,
            format: String,
            className: String,
            columnIndex: Number,
            columnsCount: Number,
            rowType: String,
            level: Number,
            expanded: Boolean,
            editor: String
        },
        methods: {
            change(e) {
                this.$emit('change', e, e.target.value);
            }
        }
    }
</script>