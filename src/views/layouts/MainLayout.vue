<template>
  <NavBar />
  <SideBar @toggle="handleToggle" />
  <router-view :key="$route.fullPath" :class="{ 'content--expanded': isCollapsed }"></router-view>

  <ColumnConfigDialog
    v-model="columnStore.showConfig"
    :columns="columnStore.inventoryColumns"
    @apply="columnStore.updateColumns"
    @reset="columnStore.resetColumns"
  />
</template>
<script setup>
import { ref } from "vue";
import NavBar from "./components/NavBar.vue";
import SideBar from "./components/SideBar.vue";
import ColumnConfigDialog from "../inventory/dialogs/ColumnConfigDialog.vue";
import { useColumnStore } from "../../stores/columnStore";

const columnStore = useColumnStore();
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
