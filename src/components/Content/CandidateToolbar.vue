<template>
  <div class="content__body__title">
    <div class="content__body__header__left">
      <div
        v-if="selectedIds.length === 0"
        class="content__body__header__left__search"
      >
        <MsInput
          v-model="localSearchText"
          :isSearch="true"
          searchIcon="mi__icon__search"
          placeholder="Tìm kiếm"
          @keyup.enter="emitSearch"
        />
      </div>

      <div
        v-else
        class="content__body__header__left__bulk"
        style="display: flex; align-items: center; gap: 16px"
      >
        <div class="selected-count-text">
          Đã chọn <strong>{{ selectedIds.length }}</strong>
        </div>
        <div
          class="unselect-btn"
          @click="clearSelection"
          style="color: #2680eb; cursor: pointer; font-weight: 500"
        >
          Bỏ chọn
        </div>
        <MsButton
          type="custom"
          class="btn-delete-bulk"
          @click="handleDeleteMultiple(selectedIds)"
        >
          <div class="mi__icon__delete__user"></div>
          Xóa các mục đã chọn
        </MsButton>
      </div>
    </div>

    <div class="content__body__header__right" style="position: relative; display: flex; gap: 8px;">
      <MsButton type="custom" class="toolbar__icon" title="Tải lại" @click="$emit('reload')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.26l5.08 5.08"/></svg>
      </MsButton>
      <MsButton type="custom" class="toolbar__icon" title="Xuất file">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
      </MsButton>
      <MsButton type="custom" class="toolbar__icon" title="Cài đặt" @click="$emit('configColumns')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </MsButton>
      <MsButton type="custom" class="toolbar__icon" :class="{ 'filter--active': filterStore.showAdvancedFilter }" title="Bộ lọc" @click="filterStore.toggleAdvancedFilter()">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
      </MsButton>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import MsInput from "../ms-input/MsInput.vue";
import MsButton from "../ms-button/MsButton.vue";
import { useFilterStore } from "../../stores/filterStore";

const filterStore = useFilterStore();

const props = defineProps({
  selectedIds: Array,
  searchText: String,
});

const emit = defineEmits([
  "update:searchText",
  "update:selectedIds",
  "deleteMultiple",
  "search",
  "filter",
  "configColumns"
]);

// Remove local filter visibility state

const handleApplyFilter = (filters) => {
  activeFilters.value = filters;
  emit("filter", filters);
};

const localSearchText = computed({
  get: () => props.searchText,
  set: (val) => emit("update:searchText", val),
});

const clearSelection = () => {
  emit("update:selectedIds", []);
};

const handleDeleteMultiple = () => {
  emit("deleteMultiple");
};

const emitSearch = () => {
  emit("search");
};
</script>

<style>
.content__body__header__left__search {
  min-width: 350px;
}

.content__body__header__left__bulk {
  background-color: #fff;
  height: 100%;
  display: flex;
  align-items: center;
}

.btn-delete-bulk {
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #ff4d4f;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.btn-delete-bulk:hover {
  background: #fff1f0;
}
.mi__icon__search {
  width: 20px;
  height: 20px !important;
  position: absolute;
  top: 10px;
  left: 12px;
  opacity: 0.5;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E") !important;
  background-size: contain;
  background-repeat: no-repeat;
}
.toolbar__icon {
  background: white;
  border: 1px solid #d3d5d8;
  border-radius: 4px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
}
.toolbar__icon:hover {
  background: #f1f2f4;
}
.toolbar__icon.filter--active {
  color: #2680eb;
  border-color: #2680eb;
  background: #eff6ff;
}
</style>
