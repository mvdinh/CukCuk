<template>
  <div class="inventory-form__header">
    <div class="header-left">
      <div class="back-icon" @click="handleBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="#333"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h2>{{ isEdit ? "Sửa thực đơn" : "Thêm thực đơn" }}</h2>
      <div class="item-type-badge">Loại món: Món ăn</div>
    </div>
  </div>
</template>

<script setup>
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
  padding: 0 24px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  background: #fff;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

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
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border: 1px solid #d0d0d0;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      margin-left: 16px;
    }
  }
}
</style>
