<template>
    <div id="app">
        <the-header></the-header>
        <div class="page-wrapper">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import TheHeader from "./components/layout/TheHeader";

    export default {
        name: 'App',
        components: {TheHeader},
        data() {
            return {}
        },
    }
</script>

<style>

</style>
