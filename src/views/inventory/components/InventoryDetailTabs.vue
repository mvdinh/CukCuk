<template>
  <div class="inventory-form__tabs">
    <div
      v-for="tab in tabs"
      :key="tab.value"
      class="tab-item"
      :class="{ active: modelValue === tab.value }"
      @click="selectTab(tab.value)"
    >
      {{ tab.label }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  modelValue: {
    type: String,
    default: "general",
  },
});

const emit = defineEmits(["update:modelValue"]);

const tabs = ref([
  { label: "Thông tin chung", value: "general" },
  { label: "Sở thích phục vụ", value: "serving" },
]);

const selectTab = (value) => {
  emit("update:modelValue", value);
};
</script>

<style lang="scss" scoped>
.inventory-form__tabs {
  height: 44px;
  display: flex;
  align-items: flex-end;
  padding: 0 20px;
  background: #ffff;
  border-bottom: 1px solid #e0e0e0;

  .tab-item {
    height: 36px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    position: relative;
    white-space: nowrap;

    &:hover {
      color: #2680eb;
    }

    &.active {
      color: #2680eb;
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: #2680eb;
      }
    }
  }
}
</style>
