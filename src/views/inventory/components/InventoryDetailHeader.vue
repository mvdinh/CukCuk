<template>
  <div class="inventory-form__header">
    <div class="header-left">
      <MsButton
        type="icon"
        :icon="{ url: icons.detail.back, x: -2, y: -2, color: '#1f1f1f' }"
        :size="16"
        @click="handleBack"
      />
      <h2>{{ isEdit ? "Sửa thực đơn" : "Thêm thực đơn" }}</h2>
      <div class="item-type-badge">
        <span>Loại món: Món ăn</span>
        <MsIcon
          :size="14"
          :isImage="true"
          :webkitMaskImage="icons.chevon_down"
          color="#1f1f1f"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import MsButton from "../../../components/common/ms-button/MsButton.vue";
import MsIcon from "../../../components/common/ms-icon/MsIcon.vue";
import { inject } from "vue";
const icons = inject("icons");
defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["handleBack"]);
const handleBack = () => emit("handleBack");
</script>

<style lang="scss">
.inventory-form__header {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  background: #fff;

  .header-left {
    display: flex;
    align-items: center;
    gap: 2px 16px;

    .back-icon {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      &:hover {
        background: #f0f0f0;
      }
    }

    h2 {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      color: #1f1f1f;
    }

    .item-type-badge {
      width: auto;
      height: 32px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border: 1px solid #d0d0d0;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      margin-left: 16px;
    }
  }
}
</style>
