<template>
    <div class="breadcrumb">
        <div id="menu">
            <svg>
                <use xlink:href="@/assets/images/sprite.svg#menu"></use>
            </svg>
        </div>
        <ul>
            <li>
                <router-link to="/">
                    <svg id="home">
                        <use xlink:href="@/assets/images/sprite.svg#home"></use>
                    </svg>
                </router-link>
            </li>
            <slot></slot>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Breadcrumb"
    }
</script>

<style scoped>

</style>