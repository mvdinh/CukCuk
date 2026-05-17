<template>
  <div class="main-header">
    <div class="main-header__container">
      <!-- Left -->
      <div class="main-header__left">
        <h2 class="main-header__title">Thực đơn</h2>
      </div>

      <!-- Right -->
      <div class="main-header__actions">
        <!-- Import -->
        <MsButton
          type="secondary"
          text="Nhập từ Excel"
          :icon="{ url: icons.header.file_import, x: 0, y: 0 }"
          @click="handleImport"
        />

        <!-- Add -->
        <MsButton
          type="primary"
          text="Thêm"
          :icon="{ url: icons.header.plus, x: 0, y: 0, color: '#fff' }"
          @click="handleAdd"
        />

        <!-- More -->
        <MsButton
          type="secondary"
          :icon="{ url: icons.header.dots, x: 0, y: 0, color: '#1f1f1f' }"
          @click="handleMore"
          class="btn__more"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";

import MsButton from "../common/ms-button/MsButton.vue";
import MsIcon from "../common/ms-icon/MsIcon.vue";

const icons = inject("icons");

const emit = defineEmits(["handleAdd", "handleImport", "handleMore"]);

const handleAdd = () => emit("handleAdd");
const handleImport = () => emit("handleImport");
const handleMore = () => emit("handleMore");
</script>

<style lang="scss" scoped>
.main-header {
  margin: 12px 20px;

  &__container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__left {
    display: flex;
    align-items: center;
  }

  &__title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
    color: #1f1f1f;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;

    :deep(.ms-button) {
      height: 32px !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 6px !important;
    }

    :deep(.ms-button__text) {
      font-size: 14px;
    }

    :deep(.ms-button__icon) {
      width: 16px;
      height: 16px;
    }
  }
  .btn__more {
    width: 32px;
    height: 32px;

    padding: 0;

    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
