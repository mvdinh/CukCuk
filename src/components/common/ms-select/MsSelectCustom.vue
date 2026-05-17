<template>
  <div class="ms-select" ref="rootRef">
    <!-- LABEL -->
    <label v-if="label" class="ms-select__label">
      {{ label }}
      <span v-if="required" class="ms-select__required"> * </span>
    </label>

    <!-- SELECT GROUP -->
    <div
      class="ms-select__group"
      :class="{ 'ms-select__group--split': allowAdd && !iconsInside }"
    >
      <!-- Trigger box (thay thế <select> mặc định) -->
      <div
        class="select__container"
        :class="{
          'select__container--split': allowAdd && !iconsInside,
          'select__container--open': isOpen,
        }"
        @click="toggleDropdown"
      >
        <span
          class="select__value"
          :class="{ 'select__value--placeholder': !selectedLabel }"
        >
          {{ selectedLabel || placeholder || "Chọn giá trị" }}
        </span>

        <div class="select__icons" @click.stop>
          <MsIcon
            :size="14"
            :webkitMaskImage="icons.chevon_down"
            color="#666"
            class="select__arrow"
            :class="{ 'select__arrow--up': isOpen }"
          />
        </div>
      </div>

      <button
        v-if="allowAdd && !iconsInside"
        type="button"
        class="ms-select__add"
        @click.stop="$emit('add')"
      >
        +
      </button>
    </div>

    <!-- Custom dropdown table -->
    <teleport to="body">
      <div v-if="isOpen" class="ms-dropdown" :style="dropdownStyle">
        <!-- Table -->
        <div class="ms-dropdown__body">
          <table class="ms-dropdown__table">
            <thead>
              <tr>
                <th>{{ colLabelTitle }}</th>
                <th class="col-price">{{ colPriceTitle }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="opt in filteredOptions"
                :key="opt[valueField]"
                :class="{ 'row--active': opt[valueField] === modelValue }"
                @click.stop="selectOption(opt)"
              >
                <td>{{ opt[labelField] }}</td>
                <td class="col-price price-value">
                  {{
                    opt[priceField] != null
                      ? Number(opt[priceField]).toLocaleString("vi-VN") + " đ"
                      : "—"
                  }}
                </td>
              </tr>
              <tr v-if="filteredOptions.length === 0">
                <td colspan="2" class="empty-cell">Không có dữ liệu</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import {
  inject,
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from "vue";
import MsIcon from "../ms-icon/MsIcon.vue";

const icons = inject("icons");

const props = defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: String,
  options: {
    type: Array,
    default: () => [],
  },
  required: { type: Boolean, default: false },
  allowAdd: { type: Boolean, default: false },
  allowSearch: { type: Boolean, default: false },
  iconsInside: { type: Boolean, default: false },

  // Custom fields
  valueField: { type: String, default: "value" },
  labelField: { type: String, default: "label" },
  priceField: { type: String, default: "price" },

  // Custom titles
  colLabelTitle: { type: String, default: "Tên" },
  colPriceTitle: { type: String, default: "Thu thêm (đ)" },
});

const emit = defineEmits(["update:modelValue", "change", "add", "search"]);

const rootRef = ref(null);
const searchRef = ref(null);
const isOpen = ref(false);
const searchText = ref("");
const dropdownStyle = ref({});

// Label hiển thị của giá trị đang chọn
const selectedLabel = computed(() => {
  const found = props.options.find(
    (o) => o[props.valueField] === props.modelValue,
  );
  return found ? found[props.labelField] : "";
});

const filteredOptions = computed(() => {
  const q = searchText.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter((o) =>
    o[props.labelField]?.toLowerCase().includes(q),
  );
});

const calcDropdownPosition = () => {
  if (!rootRef.value) return;
  const rect = rootRef.value.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const dropdownHeight = 280;

  if (spaceBelow >= dropdownHeight) {
    // Hiện bên dưới
    dropdownStyle.value = {
      top: `${rect.bottom + window.scrollY + 4}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${Math.max(rect.width, 360)}px`,
    };
  } else {
    // Hiện bên trên
    dropdownStyle.value = {
      top: `${rect.top + window.scrollY - dropdownHeight - 4}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${Math.max(rect.width, 360)}px`,
    };
  }
};

const toggleDropdown = () => {
  if (isOpen.value) {
    closeDropdown();
  } else {
    openDropdown();
  }
};

const openDropdown = () => {
  searchText.value = "";
  calcDropdownPosition();
  isOpen.value = true;
  console.log("[MsSelect] dropdown opened");
  nextTick(() => {
    searchRef.value?.focus();
  });
};

const closeDropdown = () => {
  isOpen.value = false;
  console.log("[MsSelect] dropdown closed");
};

const selectOption = (opt) => {
  console.log("[MsSelect] selected:", opt);
  emit("update:modelValue", opt[props.valueField]);
  emit("change", opt[props.valueField]);
  closeDropdown();
};

// Đóng khi click ra ngoài
const handleOutsideClick = (e) => {
  const isClickInsideSelect = rootRef.value?.contains(e.target);
  const isClickInsideDropdown = e.target.closest(".ms-dropdown");
  if (!isClickInsideSelect && !isClickInsideDropdown) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});
</script>

<style scoped>
.ms-select {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
}

.ms-select__label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.ms-select__required {
  color: red;
}

/* GROUP */
.ms-select__group {
  display: flex;
  align-items: center;
  width: 100%;
}

.ms-select__group--split {
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  overflow: visible;
}

/* CONTAINER (trigger box) */
.select__container {
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  background-color: #fff;
  padding: 0 8px 0 12px;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.15s;
}

.select__container:hover {
  border-color: #aaa;
}

.select__container--open {
  border-color: #2e90fa;
}

.select__container--split {
  border: none;
  border-radius: 0;
}

.select__value {
  flex: 1;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select__value--placeholder {
  color: #aaa;
}

.select__icons {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.select__arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #666;
  transition: transform 0.2s;
}

.select__arrow--up {
  transform: rotate(180deg);
}

.icon-action {
  cursor: pointer;
  color: #666;
}

.icon-plus {
  color: #2680eb;
}

/* ADD BUTTON */
.ms-select__add {
  width: 32px;
  min-width: 32px;
  height: 32px;
  border: none;
  border-left: 1px solid #d0d0d0;
  border-radius: 0 8px 8px 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #2680eb;
  cursor: pointer;
  transition: background-color 0.2s;
}

.ms-select__add:hover {
  background-color: #f2f7ff;
}
</style>

<!-- Dropdown (global, teleport to body) -->
<style>
.ms-dropdown {
  position: absolute;
  z-index: 9999;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  max-height: 280px;
  overflow: hidden;
  animation: dropdownFadeIn 0.15s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ms-dropdown__body {
  flex: 1;
  overflow-y: auto;
}

.ms-dropdown__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.ms-dropdown__table thead th {
  background: #f3f4f6;
  padding: 8px 12px;
  text-align: center !important;
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
}

.ms-dropdown__table th:first-child,
.ms-dropdown__table td:first-child {
  border-right: 1px solid #e5e7eb;
}

.ms-dropdown__table .col-price {
  width: 120px;
  min-width: 120px;
  max-width: 120px;
  text-align: right;
}

.ms-dropdown__table tbody tr {
  cursor: pointer;
  transition: background 0.1s;
}

.ms-dropdown__table tbody tr:hover {
  background: #f5f5f5;
}

.ms-dropdown__table tbody tr.row--active {
  background: #e5e7eb;
  font-weight: 500;
}

.ms-dropdown__table td {
  padding: 9px 12px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

.ms-dropdown__table .price-value {
  color: #1f2937;
  font-weight: 500;
  text-align: right;
}

.ms-dropdown__table .empty-cell {
  text-align: center;
  color: #9ca3af;
  padding: 24px;
  font-size: 13px;
}
</style>
