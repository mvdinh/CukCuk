<template>
  <div class="inventory-filter" v-if="modelValue">
    <div class="filter__content">
      <div class="filter__header">
        <h3>Bộ lọc</h3>
        <div class="filter__close" @click="close">✕</div>
      </div>

      <div class="filter__body">
        <div class="search-box">
          <MsInput v-model="searchText" placeholder="Tìm kiếm" isSearch />
        </div>

        <div class="filter-list">
          <div v-for="col in filteredColumns" :key="col.key" class="filter-item">
            <div class="filter-item-header">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="filterStore.columnFilters[col.key].active" />
                <span>{{ col.label }}</span>
              </label>
            </div>
            
            <div v-if="filterStore.columnFilters[col.key].active" class="filter-item-controls">
              <select v-model="filterStore.columnFilters[col.key].operator" class="filter-select">
                <option value="contains">Chứa</option>
                <option value="equals">Bằng</option>
                <option value="starts_with">Bắt đầu bằng</option>
                <option value="ends_with">Kết thúc bằng</option>
                <option value="not_contains">Không chứa</option>
              </select>
              <MsInput v-model="filterStore.columnFilters[col.key].value" placeholder="Giá trị" />
            </div>
          </div>
        </div>
      </div>

      <div class="filter__footer">
        <button class="btn-secondary" @click="clearAll">Bỏ lọc</button>
        <button class="btn-primary" @click="applyFilters">Áp dụng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import MsInput from "../ms-input/MsInput.vue";
import MsButton from "../ms-button/MsButton.vue";
import fieldMenuData from "../../assets/data/fieldMenu.js";
import { useFilterStore } from "../../stores/filterStore";

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(["update:modelValue", "apply"]);

const filterStore = useFilterStore();
const searchText = ref("");

// Khởi tạo filters nếu chưa có
onMounted(() => {
  fieldMenuData.forEach(col => {
    if (col.key && !filterStore.columnFilters[col.key]) {
      filterStore.setFilter(col.key, { operator: 'contains', value: '', active: false });
    }
  });
});

const filteredColumns = computed(() => {
  const colsWithKey = fieldMenuData.filter(c => c.key);
  if (!searchText.value) return colsWithKey;
  return colsWithKey.filter(c => c.label.toLowerCase().includes(searchText.value.toLowerCase()));
});

const close = () => emit("update:modelValue", false);

const applyFilters = () => {
  emit("apply", filterStore.columnFilters);
  close();
};

const clearAll = () => {
  filterStore.clearAll();
  emit("apply", filterStore.columnFilters);
};
</script>

<style scoped lang="scss">
.inventory-filter {
  height: 100%;
  z-index: 10;
  flex-shrink: 0;
}
.filter__content {
  position: relative;
  width: 280px;
  height: 100%;
  background: #fff;
  border-left: 1px solid #e0e0e0;
  box-shadow: -2px 0 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}
.filter__header {
  padding: 16px; border-bottom: 1px solid #e0e0e0;
  display: flex; justify-content: space-between; align-items: center;
  h3 { margin: 0; font-size: 16px; }
  .filter__close { cursor: pointer; color: #999; font-size: 18px; }
}
.filter__body {
  flex: 1; overflow-y: auto; padding: 16px;
  display: flex; flex-direction: column; gap: 16px;
}
.filter-list {
  display: flex; flex-direction: column; gap: 12px;
}
.filter-item {
  display: flex; flex-direction: column; gap: 8px;
}
.filter-item-header {
  .checkbox-wrapper {
    display: flex; align-items: center; gap: 8px; cursor: pointer;
    span { font-size: 13px; font-weight: 500; }
  }
}
.filter-item-controls {
  padding-left: 24px; display: flex; flex-direction: column; gap: 8px;
  .filter-select {
    height: 32px; border: 1px solid #e0e0e0; border-radius: 4px; outline: none; padding: 0 8px;
    &:focus { border-color: #2680eb; }
  }
}
.filter__footer {
  padding: 16px; border-top: 1px solid #e0e0e0; background: #f9f9f9;
  display: flex; justify-content: flex-end; gap: 8px;
}

.btn-primary { background: #2680eb; color: #fff; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; font-weight: 600; }
.btn-secondary { background: #fff; border: 1px solid #e0e0e0; border-radius: 4px; padding: 8px 16px; cursor: pointer; font-weight: 600; }
</style>
