<template>
  <teleport to="body">
    <div v-if="modelValue" class="dialog-overlay" @click.self="close">
      <div class="dialog">
        <!-- Header -->
        <div class="dialog__header">
          <span class="dialog__title">Chọn sở thích phục vụ</span>
          <button class="dialog__close" @click="close">✕</button>
        </div>

        <!-- Search -->
        <div class="dialog__search">
          <MsInput
            v-model="searchText"
            :isSearch="true"
            placeholder="Tìm kiếm sở thích..."
          />
        </div>

        <!-- Table body -->
        <div class="dialog__body">
          <table class="selection-table">
            <thead>
              <tr>
                <th class="col-checkbox">
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    :indeterminate="isIndeterminate"
                    @change="toggleSelectAll"
                  />
                </th>
                <th>Tên sở thích</th>
                <th class="col-price">Thu thêm (đ)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="opt in filteredOptions"
                :key="opt.value"
                :class="{ 'row--selected': selectedIds.includes(opt.value) }"
                @click="toggleSelect(opt.value)"
              >
                <td class="col-checkbox">
                  <input
                    type="checkbox"
                    :checked="selectedIds.includes(opt.value)"
                    @click.stop
                    @change="toggleSelect(opt.value)"
                  />
                </td>
                <td>{{ opt.label }}</td>
                <td class="col-price price-value">
                  {{
                    opt.price != null
                      ? Number(opt.price).toLocaleString("vi-VN") + " đ"
                      : "—"
                  }}
                </td>
              </tr>

              <tr v-if="filteredOptions.length === 0">
                <td colspan="3" class="empty-cell">Không có dữ liệu</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="dialog__footer">
          <button class="btn btn--ghost" @click="$emit('add')">
            + Thêm mới
          </button>
          <div class="dialog__footer__actions">
            <span class="selected-count" v-if="selectedIds.length > 0">
              Đã chọn {{ selectedIds.length }}
            </span>
            <button class="btn btn--cancel" @click="close">Hủy</button>
            <button
              class="btn btn--primary"
              :disabled="selectedIds.length === 0"
              @click="confirmSelection"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import MsInput from "../../components/ms-input/MsInput.vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  // Mỗi option: { value, label, price }
  options: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "select", "add"]);

const searchText = ref("");
const selectedIds = ref([]);

// Reset state mỗi lần mở dialog
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      searchText.value = "";
      selectedIds.value = [];
    }
  },
);

const filteredOptions = computed(() => {
  const q = searchText.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter((o) => o.label?.toLowerCase().includes(q));
});

const isAllSelected = computed(
  () =>
    filteredOptions.value.length > 0 &&
    filteredOptions.value.every((o) => selectedIds.value.includes(o.value)),
);

const isIndeterminate = computed(
  () =>
    selectedIds.value.length > 0 &&
    !isAllSelected.value &&
    filteredOptions.value.some((o) => selectedIds.value.includes(o.value)),
);

const toggleSelect = (id) => {
  const idx = selectedIds.value.indexOf(id);
  if (idx === -1) {
    selectedIds.value.push(id);
  } else {
    selectedIds.value.splice(idx, 1);
  }
};

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = filteredOptions.value.map((o) => o.value);
  }
};

const confirmSelection = () => {
  emit("select", [...selectedIds.value]);
  close();
};

const close = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
/* Overlay */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Dialog box */
.dialog {
  background: #fff;
  border-radius: 10px;
  width: 580px;
  max-height: 78vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.18s ease;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    transform: translateY(16px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Header */
.dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.dialog__title {
  font-weight: 600;
  font-size: 15px;
  color: #111827;
}

.dialog__close {
  background: none;
  border: none;
  font-size: 16px;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  line-height: 1;
  transition:
    background 0.15s,
    color 0.15s;
}

.dialog__close:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Search */
.dialog__search {
  padding: 12px 20px 10px;
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0;
}

/* Body / table */
.dialog__body {
  flex: 1;
  overflow-y: auto;
}

.selection-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.selection-table thead th {
  background: #f9fafb;
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 1;
}

.col-checkbox {
  width: 44px;
  text-align: center !important;
}

.col-price {
  width: 150px;
  text-align: right !important;
}

.selection-table tbody tr {
  cursor: pointer;
  transition: background 0.12s;
}

.selection-table tbody tr:hover {
  background: #f0f7ff;
}

.selection-table tbody tr.row--selected {
  background: #eff6ff;
}

.selection-table td {
  padding: 10px 14px;
  color: #111827;
  border-bottom: 1px solid #f3f4f6;
}

.price-value {
  color: #059669;
  font-weight: 500;
  text-align: right;
}

.empty-cell {
  text-align: center;
  color: #9ca3af;
  padding: 40px 0;
  font-size: 13px;
}

/* Footer */
.dialog__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid #e5e7eb;
  flex-shrink: 0;
  gap: 8px;
}

.dialog__footer__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.selected-count {
  font-size: 13px;
  color: #2e90fa;
  font-weight: 500;
}

/* Buttons */
.btn {
  height: 34px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition:
    background 0.15s,
    opacity 0.15s;
  white-space: nowrap;
}

.btn--ghost {
  background: none;
  color: #2e90fa;
  border: 1px dashed #2e90fa;
}

.btn--ghost:hover {
  background: #eff6ff;
}

.btn--cancel {
  background: #f3f4f6;
  color: #374151;
}

.btn--cancel:hover {
  background: #e5e7eb;
}

.btn--primary {
  background: #2e90fa;
  color: #fff;
  min-width: 96px;
}

.btn--primary:hover:not(:disabled) {
  background: #1d7eea;
}

.btn--primary:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>
