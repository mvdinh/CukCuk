<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import InventoryDetailHeader from "./components/InventoryDetailHeader.vue";
import InventoryDetailTabs from "./components/InventoryDetailTabs.vue";
import InventoryDetailFooter from "./components/InventoryDetailFooter.vue";
import InventoryDetailMain from "./components/InventoryDetailMain.vue";
import { confirmDialog } from "../../utils/confirm";
import { toast } from "../../utils/toast";

const router = useRouter();
const route = useRoute();

const currentTab = ref("general");
const mainFormRef = ref(null);

const isEdit = computed(() => !!route.params.id);

const handleBack = async () => {
  const confirmed = await confirmDialog("Bạn đang thêm/sửa, bạn có chắc chắn muốn quay lại khi chưa lưu không?", {
    title: "Xác nhận",
    type: "warning",
    confirmText: "Có",
    cancelText: "Không",
  });
  if (confirmed) {
    router.push({ name: "inventory" });
  }
};

const handleSave = async () => {
  if (mainFormRef.value) {
    const isValid = mainFormRef.value.validateAll();
    if (!isValid) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }
    const success = await mainFormRef.value.saveData();
    if (success) {
      toast.success("Lưu dữ liệu thành công");
      router.push({ name: "inventory" });
    } else {
      toast.error("Lưu dữ liệu thất bại");
    }
  }
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

      <InventoryDetailMain ref="mainFormRef" :currentTab="currentTab" />

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
