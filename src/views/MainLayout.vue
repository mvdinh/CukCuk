<template>
  <NavBar />
  <SideBar @toggle="handleToggle" />
  <router-view :class="{ 'content--expanded': isCollapsed }"></router-view>

</template>
<script setup>
import { ref } from "vue";
import NavBar from "../components/NavBar.vue";
import SideBar from "../components/SideBar.vue";

const isCollapsed = ref(false);
const handleToggle = (state) => {
  isCollapsed.value = state;
};
</script>
<style>
.content {
  transition: width 0.25s ease;
}
.content--expanded {
  width: calc(100% - 64px) !important;
}
</style>
