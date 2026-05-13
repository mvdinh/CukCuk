<template>
  <div class="inventory-filter" v-if="modelValue">
    <div class="filter__overlay" @click="close"></div>
    <div class="filter__content">
      <div class="filter__header">
        <h3>Bộ lọc</h3>
        <div class="filter__close" @click="close" style="cursor: pointer">
          &times;
        </div>
      </div>

      <div class="filter__body">
        <!-- Lọc theo Loại món -->
        <div class="filter__row">
          <MsSelect
            label="Loại món"
            v-model="filters.itemType"
            :options="typeOptions"
            placeholder="Tất cả"
          />
        </div>

        <!-- Lọc theo Nhóm thực đơn -->
        <div class="filter__row">
          <MsSelect
            label="Nhóm thực đơn"
            v-model="filters.category"
            :options="categoryOptions"
            placeholder="Tất cả"
          />
        </div>

        <!-- Lọc theo Giá bán -->
        <div class="filter__row">
          <div class="ms-input__label">Giá bán</div>
          <div class="flex-row">
            <MsInput type="number" v-model="filters.minPrice" placeholder="Từ" />
            <MsInput type="number" v-model="filters.maxPrice" placeholder="Đến" />
          </div>
        </div>
      </div>

      <div class="filter__footer">
        <MsButton type="secondary" @click="clearFilters">Bỏ lọc</MsButton>
        <MsButton type="primary" @click="applyFilters">Áp dụng</MsButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from "vue";
import MsSelect from "../ms-select/MsSelect.vue";
import MsInput from "../ms-input/MsInput.vue";
import MsButton from "../ms-button/MsButton.vue";
import { useCategoryStore } from "../../stores/categoryStore";

const props = defineProps({
  modelValue: Boolean,
  currentFilters: Object
});

const emit = defineEmits(["update:modelValue", "apply"]);

const categoryStore = useCategoryStore();

const filters = reactive({
  itemType: null,
  category: null,
  minPrice: null,
  maxPrice: null
});

const typeOptions = [
  { value: "Món ăn", label: "Món ăn" },
  { value: "Đồ uống", label: "Đồ uống" },
  { value: "Khác", label: "Khác" }
];

const categoryOptions = computed(() => 
  categoryStore.categories.map(c => ({ value: c.inventoryItemCategoryID, label: c.inventoryItemCategoryName }))
);

watch(() => props.modelValue, (val) => {
  if (val) {
    categoryStore.fetchCategories();
    Object.assign(filters, props.currentFilters);
  }
});

const close = () => emit("update:modelValue", false);

const applyFilters = () => {
  emit("apply", { ...filters });
  close();
};

const clearFilters = () => {
  Object.assign(filters, { itemType: null, category: null, minPrice: null, maxPrice: null });
  emit("apply", { ...filters });
  close();
};
</script>

<style scoped lang="scss">
.inventory-filter {
  position: absolute; top: 40px; right: 0; z-index: 1000;
}
.filter__overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999; }
.filter__content {
  position: relative; z-index: 1000; width: 350px; background: #fff; border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.16); border: 1px solid #e0e0e0;
}
.filter__header { display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid #e0e0e0; }
.filter__body { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.filter__row { display: flex; flex-direction: column; gap: 8px; }
.filter__footer { padding: 16px; border-top: 1px solid #e0e0e0; display: flex; justify-content: flex-end; gap: 8px; }
.ms-input__label { font-size: 13px; font-weight: 600; color: #333; }
.flex-row { display: flex; gap: 8px; }
</style>
