<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import InventoryDetailHeader from "./components/InventoryDetailHeader.vue";
import InventoryDetailTabs from "./components/InventoryDetailTabs.vue";
import InventoryDetailFooter from "./components/InventoryDetailFooter.vue";
import InventoryDetailForm from "./components/InventoryDetailForm.vue";

const router = useRouter();
const route = useRoute();

const currentTab = ref("general");

const isEdit = computed(() => !!route.params.id);

const handleBack = () => {
  router.push({ name: "inventory" });
};

const handleSave = () => {
  console.log("Save");
};

const handleCancel = () => {
  handleBack();
};
</script>

<template>
  <div class="content inventory-form-wrapper">
    <div class="inventory-form">
      <InventoryDetailHeader :isEdit="isEdit" @handleBack="handleBack" />

      <InventoryDetailTabs v-model="currentTab" />

      <InventoryDetailForm :currentTab="currentTab" />

      <InventoryDetailFooter
        @handleSave="handleSave"
        @handleCancel="handleCancel"
      />
    </div>
  </div>
</template>

<style lang="scss">
.inventory-form-wrapper {
  display: flex;
  flex-direction: column;
  background: #f4f5f8;
  height: calc(100vh - 48px);
  overflow: hidden;
}

.inventory-form {
  background: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
