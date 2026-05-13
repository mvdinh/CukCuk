<template>
  <div class="candidate-filter" v-if="modelValue">
    <div class="filter__overlay" @click="close"></div>
    <div class="filter__content">
      <div class="filter__header">
        <h3>Bộ lọc</h3>
        <div class="filter__close" @click="close" style="cursor: pointer">
          &times;
        </div>
      </div>

      <div class="filter__body">
        <!-- Lọc theo Nguồn ứng viên -->
        <div class="filter__row">
          <MsSelect
            label="Nguồn ứng viên"
            v-model="filters.source"
            :options="sourceOptions"
            placeholder="Tất cả"
          />
        </div>

        <!-- Lọc theo Giới tính -->
        <div class="filter__row">
          <MsSelect
            label="Giới tính"
            v-model="filters.gender"
            :options="genderOptions"
            placeholder="Tất cả"
          />
        </div>

        <!-- Lọc theo Ngày sinh -->
        <div class="filter__row">
          <div class="ms-input__label">Ngày sinh</div>
          <div class="date-filter-group">
            <MsSelect
              v-model="filters.dateOperator"
              :options="dateOperators"
              placeholder="Toán tử"
              class="date-operator"
            />
            <MsInput
              type="date"
              v-model="filters.dateValue"
              placeholder="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>

      <div class="filter__footer">
        <MsButton type="secondary" text="Bỏ lọc" @click="clearFilters" />
        <MsButton type="primary" text="Áp dụng" @click="applyFilters" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import MsSelect from "../ms-select/MsSelect.vue";
import MsInput from "../ms-input/MsInput.vue";
import MsButton from "../ms-button/MsButton.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  currentFilters: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "apply"]);

const filters = reactive({
  source: null,
  gender: null,
  dateOperator: null,
  dateValue: null,
});

const sourceOptions = [
  { value: "Website", label: "Website" },
  { value: "Facebook", label: "Facebook" },
  { value: "LinkedIn", label: "LinkedIn" },
  { value: "Gioi thieu", label: "Giới thiệu" },
  { value: "Tuyen dung", label: "Tuyển dụng" },
];

const genderOptions = [
  { value: 1, label: "Nam" },
  { value: 0, label: "Nữ" },
];

const dateOperators = [
  { value: "equals", label: "Bằng" },
  { value: "greater_than", label: "Lớn hơn" },
  { value: "less_than", label: "Nhỏ hơn" },
];

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      // Reset filters when opening based on currentFilters
      Object.assign(filters, {
        source: props.currentFilters.source || null,
        gender: props.currentFilters.gender ?? null,
        dateOperator: props.currentFilters.dateOperator,
        dateValue: props.currentFilters.dateValue || null,
      });
    }
  },
);

const close = () => {
  emit("update:modelValue", false);
};

const clearFilters = () => {
  filters.source = null;
  filters.gender = null;
  filters.dateOperator = null;
  filters.dateValue = null;
  emit("apply", { ...filters });
  close();
};

const applyFilters = () => {
  emit("apply", { ...filters });
  close();
};
</script>

<style scoped>
.candidate-filter {
  position: absolute;
  top: 40px;
  right: 0;
  z-index: 1000;
}

.filter__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.filter__content {
  position: relative;
  z-index: 1000;
  width: 350px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.filter__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.filter__header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.filter__close {
  font-size: 24px;
  color: #757575;
}

.filter__body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter__row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.date-filter-group {
  display: flex;
  gap: 8px;
}

.date-operator {
  width: 120px;
}

.filter__footer {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.ms-input__label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}
</style>
