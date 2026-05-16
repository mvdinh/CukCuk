<template>
  <div class="ms-filter-sidebar">
    <div class="filter__content">
      <div class="filter__header">
        <h3>Bộ lọc</h3>
        <div class="filter__close" @click="close">✕</div>
      </div>

      <div class="filter__body">
        <div class="search-box">
          <MsInput v-model="searchText" placeholder="Tìm kiếm trường lọc" :isSearch="true" />
        </div>

        <div class="filter-list">
          <div v-for="col in filteredColumns" :key="col.key" class="filter-item">
            <!-- Header for non-checkbox types -->
            <div v-if="col.type !== 'checkbox'" class="filter-item-header">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="filterStore.columnFilters[col.key].active" />
                <span>{{ col.label }}</span>
              </label>
            </div>

            <!-- Controls for non-checkbox types -->
            <div v-if="col.type !== 'checkbox' && filterStore.columnFilters[col.key].active" class="filter-item-controls">
              <select v-model="filterStore.columnFilters[col.key].operator" class="filter-select">
                <option value="contains">Chứa</option>
                <option value="equals">Bằng</option>
                <option value="starts_with">Bắt đầu bằng</option>
                <option value="ends_with">Kết thúc bằng</option>
                <option value="not_contains">Không chứa</option>
              </select>
              <MsInput v-model="filterStore.columnFilters[col.key].value" placeholder="Giá trị" />
            </div>

            <!-- Single checkbox for checkbox types -->
            <div v-if="col.type === 'checkbox'" class="filter-item-header">
              <label class="checkbox-wrapper">
                <input 
                  type="checkbox" 
                  :checked="filterStore.columnFilters[col.key].active"
                  @change="onCheckboxFilterChange(col.key, $event.target.checked)"
                />
                <span>{{ col.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="filter__footer">
        <MsButton type="secondary" @click="clearAll">Bỏ lọc</MsButton>
        <MsButton type="primary" @click="applyFilters">Áp dụng</MsButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsButton from "../../components/ms-button/MsButton.vue";
import fieldMenuData from "../../assets/data/fieldMenu.js";
import { useFilterStore } from "../../stores/filterStore";

const emit = defineEmits(["apply"]);

const filterStore = useFilterStore();
const searchText = ref("");

// Initialization is now handled by filterStore.toggleAdvancedFilter()

const filteredColumns = computed(() => {
  const colsWithKey = fieldMenuData.filter(c => c.key);
  if (!searchText.value) return colsWithKey;
  return colsWithKey.filter(c => c.label.toLowerCase().includes(searchText.value.toLowerCase()));
});

const onCheckboxFilterChange = (key, checked) => {
  filterStore.columnFilters[key].active = checked;
  filterStore.columnFilters[key].value = checked ? "1" : "0";
  filterStore.columnFilters[key].operator = "equals";
};

const close = () => {
  filterStore.showAdvancedFilter = false;
};

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
.ms-filter-sidebar {
  width: 300px;
  height: 100%;
  z-index: 10;
  flex-shrink: 0;
  border-left: 1px solid #e0e0e0;
}
.filter__content {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}
.filter__header {
  padding: 16px; 
  border-bottom: 1px solid #e0e0e0;
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  h3 { margin: 0; font-size: 16px; font-weight: 700; color: #1f1f1f; }
  .filter__close { cursor: pointer; color: #999; font-size: 18px; }
}
.filter__body {
  flex: 1; 
  overflow-y: auto; 
  padding: 16px;
  display: flex; 
  flex-direction: column; 
  gap: 16px;
}
.filter-list {
  display: flex; 
  flex-direction: column; 
  gap: 12px;
}
.filter-item {
  display: flex; 
  flex-direction: column; 
  gap: 8px;
}
.filter-item-header {
  .checkbox-wrapper {
    display: flex; 
    align-items: center; 
    gap: 8px; 
    cursor: pointer;
    span { font-size: 13px; font-weight: 500; }
  }
}
.filter-item-controls {
  padding-left: 24px; 
  display: flex; 
  flex-direction: column; 
  gap: 8px;
  .filter-select {
    height: 32px; 
    border: 1px solid #e0e0e0; 
    border-radius: 4px; 
    outline: none; 
    padding: 0 8px;
    &:focus { border-color: #2680eb; }
  }
}
.filter__footer {
  padding: 16px; 
  border-top: 1px solid #e0e0e0; 
  background: #f9f9f9;
  display: flex; 
  justify-content: flex-end; 
  gap: 12px;
}
</style>
