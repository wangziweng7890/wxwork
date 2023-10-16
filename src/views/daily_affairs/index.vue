<template>
    <router-view v-slot="{ Component }">
        <keep-alive include="daily_affairs">
            <component :is="Component" />
        </keep-alive>
    </router-view>
</template>
<script setup></script>