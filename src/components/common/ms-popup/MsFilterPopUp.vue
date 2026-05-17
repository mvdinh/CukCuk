<template>
  <div class="column-filter-popup" @click.stop>
    <div class="popup__header">
      <h3 class="popup__header__name">Lọc {{ columnName }}</h3>
      <MsIcon
        :size="14"
        :isImage="true"
        :webkitMaskImage="icons.table.close"
        @click="$emit('close')"
        class="popup__header__close"
      />
    </div>
    <div class="popup-body">
      <MsSelect
        v-model="filter.operator"
        :options="operatorOptions"
      />
      <MsInput
        v-model="filter.value"
        placeholder="Giá trị lọc"
        @keyup.enter="$emit('apply')"
      />
    </div>
    <div class="popup-footer">
      <MsButton type="secondary" class="btn-action" @click="$emit('clear')">Bỏ lọc</MsButton>
      <div class="footer-right">
        <MsButton type="secondary" class="btn-action" @click="$emit('close')">Hủy</MsButton>
        <MsButton type="primary" class="btn-action" @click="$emit('apply')">Áp dụng</MsButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, computed, watch } from "vue";
import MsIcon from "../ms-icon/MsIcon.vue";
import MsSelect from "../ms-select/MsSelect.vue";
import MsInput from "../ms-input/MsInput.vue";
import MsButton from "../ms-button/MsButton.vue";

const icons = inject("icons");

const props = defineProps({
  columnName: {
    type: String,
    required: true,
  },
  columnType: {
    type: String,
    default: "text",
  },
  filter: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["apply", "clear", "close"]);

const operatorOptions = computed(() => {
  const type = props.columnType?.toLowerCase();
  if (type === "number" || type === "currency") {
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
});

// Auto-correct the active operator to a valid choice when options change
watch(
  operatorOptions,
  (newOptions) => {
    const hasCurrentOperator = newOptions.some(
      (opt) => opt.value === props.filter.operator
    );
    if (!hasCurrentOperator && newOptions.length > 0) {
      props.filter.operator = newOptions[0].value;
    }
  },
  { immediate: true }
);
</script>
