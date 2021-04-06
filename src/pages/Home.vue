<template>
    <div>
        <breadcrumb></breadcrumb>
        <k-button class="primary-btn" @click="newPurchase">New Purchase Requisition</k-button>

    </div>
</template>

<script>
    import { Button } from '@progress/kendo-buttons-vue-wrapper';
    import Breadcrumb from "../components/Breadcrumb";
    export default {
        name: "Home",
        components: {Breadcrumb,
        'k-button': Button
        },
        methods: {
            newPurchase() {
                this.$router.push('/new-purchase')
            }
        }
    }
</script>

<style scoped>

</style>