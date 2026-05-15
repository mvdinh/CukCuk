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
import { ref } from 'vue';

defineProps({
  modelValue: {
    type: String,
    default: 'general',
  },
});

const emit = defineEmits(['update:modelValue']);

const tabs = ref([
  { label: 'Thông tin chung', value: 'general' },
  { label: 'Sở thích phục vụ', value: 'serving' },
]);

const selectTab = (value) => {
  emit('update:modelValue', value);
};
</script>

<style lang="scss" scoped>
.inventory-form__tabs {
    display: flex;
    padding: 0 24px;
    border-bottom: 1px solid #e0e0e0;
    background: #f4f5f8;

    .tab-item {
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      position: relative;

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
