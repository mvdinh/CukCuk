<template>
  <div class="inventory-form__footer">
    <MsButton type="secondary" @click="handleCancel">Hủy</MsButton>
    <div class="footer-right">
      <MsButton type="secondary" @click="handleSaveAndAdd"
        >Lưu và thêm</MsButton
      >
      <MsButton type="primary" @click="handleSave">Lưu</MsButton>
    </div>
  </div>
</template>

<script setup>
import MsButton from "../../components/ms-button/MsButton.vue";

const emit = defineEmits(["handleSave", "handleCancel"]);

const handleSave = () => emit("handleSave");
const handleCancel = () => emit("handleCancel");
const handleSaveAndAdd = () => emit("handleSave", true);
</script>

<style lang="scss" scoped>
.inventory-form__footer {
    height: 56px;
    padding: 0 24px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;

    .footer-right {
      display: flex;
      gap: 12px;
    }
  }</style>
