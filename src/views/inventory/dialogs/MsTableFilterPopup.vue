<template>
  <div class="ms-filter-sidebar">
    <div class="filter__content">
      <div class="filter__header">
        <h3>Bộ lọc</h3>
        <div class="filter__close" @click="close">✕</div>
      </div>

      <div class="filter__body">
        <div class="search-box">
          <MsInput
            v-model="searchText"
            placeholder="Tìm kiếm "
            :isSearch="true"
          />
        </div>

        <div class="filter-list">
          <div
            v-for="col in filteredColumns"
            :key="col.key"
            class="filter-item"
            :class="{
              'filter-item--active': filterStore.columnFilters[col.key].active,
            }"
          >
            <!-- Header for non-checkbox types -->
            <div v-if="col.type !== 'checkbox'" class="filter-item-header">
              <label class="checkbox-wrapper">
                <input
                  type="checkbox"
                  v-model="filterStore.columnFilters[col.key].active"
                />
                <span>{{ col.label }}</span>
              </label>
            </div>

            <!-- Controls for non-checkbox types -->
            <div
              v-if="
                col.type !== 'checkbox' &&
                filterStore.columnFilters[col.key].active
              "
              class="filter-item-controls"
            >
              <MsSelect
                v-model="filterStore.columnFilters[col.key].operator"
                :options="getOperatorOptions(col.type)"
              />
              <MsInput
                v-model="filterStore.columnFilters[col.key].value"
                placeholder="Giá trị"
              />
            </div>

            <!-- Single checkbox for checkbox types -->
            <div v-if="col.type === 'checkbox'" class="filter-item-header">
              <label class="checkbox-wrapper">
                <input
                  type="checkbox"
                  :checked="filterStore.columnFilters[col.key].active"
                  @change="
                    onCheckboxFilterChange(col.key, $event.target.checked)
                  "
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
import MsInput from "../../../components/common/ms-input/MsInput.vue";
import MsSelect from "../../../components/common/ms-select/MsSelect.vue";
import MsButton from "../../../components/common/ms-button/MsButton.vue";
import fieldMenuData from "../../../assets/data/fieldMenu.js";
import { useFilterStore } from "../../../stores/filterStore";

const emit = defineEmits(["apply"]);

const filterStore = useFilterStore();
const searchText = ref("");

// Helper to get operators dynamically based on field type
const getOperatorOptions = (type) => {
  const t = type?.toLowerCase();
  if (t === "number" || t === "currency") {
    return [
      { value: "equals", label: "Bằng" },
      { value: "less_than", label: "Nhỏ hơn" },
      { value: "greater_than", label: "Lớn hơn" },
    ];
  }
  return [
    { value: "contains", label: "Chứa" },
    { value: "not_contains", label: "Không chứa" },
  ];
};

// Initialization is now handled by filterStore.toggleAdvancedFilter()

const filteredColumns = computed(() => {
  const colsWithKey = fieldMenuData.filter((c) => c.key);
  if (!searchText.value) return colsWithKey;
  return colsWithKey.filter((c) =>
    c.label.toLowerCase().includes(searchText.value.toLowerCase()),
  );
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
  width: 240px;
  height: calc(100% - 20px);
  z-index: 10;
  flex-shrink: 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin: 0px 20px 20px 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}
.filter__content {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.filter__header {
  height: 32px;
  margin: 12px 12px 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 5px 8px 0 8px;
  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #1f1f1f;
  }
  .filter__close {
    cursor: pointer;
    color: #999;
    font-size: 16px;
    margin-right: 8px;
  }
}
.filter__body {
  flex: 1;
  overflow-y: auto;
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.filter-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: transparent;
  transition: all 0.2s ease;

  &--active {
    background-color: #f0f6fe;
    padding: 8px;
  }
}
.filter-item-header {
  padding: 0;
  .checkbox-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    span {
      font-size: 13px;
      font-weight: 500;
    }
  }
}
:deep(.ms-input),
:deep(.ms-select) {
  width: 200px !important;
}

:deep(.ms-input--search .ms-input__field) {
  border: 1px solid #e0e0e0 !important;
  border-radius: 8px !important;
  height: 32px !important;
}

.filter-item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.filter__footer {
  height: 56px;
  padding: 0 16px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;

  :deep(.ms-button) {
    width: 80px !important;
    height: 32px !important;
    border-radius: 8px !important;
    font-size: 13px !important;
    font-weight: 500 !important;
    padding: 0 !important;
    white-space: nowrap !important;
  }
}
</style>
