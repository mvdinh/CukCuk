<template>
  <div class="inventory-form__footer">
    <div class="footer_actions">
      <MsButton
        type="secondary"
        @click="handleCancel"
        text="Hủy"
        class="btn__action"
      />
      <MsButton type="secondary" @click="handleSaveAndAdd"
        >Lưu và thêm</MsButton
      >
      <MsButton
        type="primary"
        @click="handleSave"
        text="Lưu"
        class="btn__action"
      />
    </div>
  </div>
</template>

<script setup>
import MsButton from "../../../components/common/ms-button/MsButton.vue";

const emit = defineEmits(["handleSave", "handleCancel"]);

const handleSave = () => emit("handleSave");
const handleCancel = () => emit("handleCancel");
const handleSaveAndAdd = () => emit("handleSave", true);
</script>

<style lang="scss" scoped>
.inventory-form__footer {
  height: 48px;
  padding: 0 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #fff;

  .footer_actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  :deep(.ms-button) {
    height: 32px !important;
    border-radius: 8px !important;
  }
  .btn__action {
    width: 80px;
  }
}
</style>
