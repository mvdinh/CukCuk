<template>
  <div class="table-toolbar-wrapper">
    <div class="table-toolbar">
      <div class="table-toolbar__search">
        <MsInput
          v-model="localSearchText"
          :isSearch="true"
          placeholder="Tìm kiếm"
          @keyup.enter="emitSearch"
        />
      </div>

      <div class="table-toolbar__actions">
        <MsButton
          type="secondary"
          :icon="{
            url: icons.toolbar.swap_resize,
            x: 0,
            y: 0,
            color: '#1f1f1f',
          }"
          class="table-toolbar__button"
        />

        <MsButton
          type="secondary"
          :icon="{
            url: icons.toolbar.file_export,
            x: 0,
            y: 0,
            color: '#1f1f1f',
          }"
          class="table-toolbar__button"
        />

        <MsButton
          type="secondary"
          :icon="{
            url: icons.toolbar.settings,
            x: 0,
            y: 0,
            color: '#1f1f1f',
          }"
          class="table-toolbar__button"
        />

        <MsButton
          type="secondary"
          :icon="{
            url: icons.toolbar.filter,
            x: 0,
            y: 0,
            color: '#1f1f1f',
          }"
          class="table-toolbar__button"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";

import MsInput from "../ms-input/MsInput.vue";
import MsButton from "../ms-button/MsButton.vue";

const icons = inject("icons");

const props = defineProps({
  searchText: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:searchText", "search"]);

const localSearchText = computed({
  get: () => props.searchText,
  set: (value) => emit("update:searchText", value),
});

const emitSearch = () => {
  emit("search");
};
</script>

<style lang="scss">
.table-toolbar-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  height: 56px;
}

.table-toolbar {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 12px;

  &__search {
    width: 224px;
    height: 32px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    border: 1px solid #d5d7da;
    border-radius: 8px;
    box-sizing: border-box;

    :deep(.ms-input) {
      width: 208px; // 224px - 8px*2 (padding trái + phải)
      height: 18px;
    }

    :deep(.ms-input__wrapper) {
      width: 208px;
      height: 18px;
      border: none;
      box-shadow: none;
      background: transparent;
    }

    :deep(.ms-input__field) {
      font-size: 14px;
      height: 18px ;
      line-height: 18px !important;
      padding: 0 0 0 24px; // chỉ chừa chỗ cho icon search bên trái
      border: none !important;
      outline: none !important;
      box-shadow: none !important;
      background: transparent;
      box-sizing: border-box;
    }

    :deep(.ms-input__icon-search) {
      width: 16px;
      height: 16px;
      left: 0; // reset về 0 vì wrapper đã có padding

      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 32px;
  }

  &__button {
    width: 32px;
    height: 32px;
    min-width: 32px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px !important;
  }
}
</style>
