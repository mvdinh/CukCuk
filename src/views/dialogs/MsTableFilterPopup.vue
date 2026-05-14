<template>
  <table
    id="table__user"
    :style="{ tableLayout: 'fixed', width: tableWidth + 'px' }"
  >
    <colgroup>
      <col v-if="hasCheckbox" style="width: 48px; min-width: 48px" />
      <col
        v-for="field in flatFields"
        :key="'col_' + field.key"
        :style="{ width: (colWidths[field.key] || field.width || 150) + 'px' }"
      />
      <col style="width: 80px; min-width: 80px" />
    </colgroup>

    <thead v-if="hasChildren">
      <tr>
        <th v-if="hasCheckbox" class="col-checkbox" rowspan="2">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
          />
        </th>

        <th
          v-for="field in fields"
          :key="field.key || field.label"
          :rowspan="field.children ? 1 : 2"
          :colspan="field.children ? field.children.length : 1"
          class="resizable-th"
        >
          {{ field.label }}
        </th>

        <th class="col-action" rowspan="2"></th>
      </tr>
      <tr>
        <template
          v-for="field in fields"
          :key="'sub_' + (field.key || field.label)"
        >
          <th
            v-if="field.children"
            v-for="child in field.children"
            :key="child.key"
          >
            {{ child.label }}
          </th>
        </template>
      </tr>
    </thead>

    <thead v-else>
      <tr>
        <th
          v-if="hasCheckbox"
          class="col-checkbox col--pinned"
          style="left: 0; z-index: 31"
        >
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
          />
        </th>

        <th
          v-for="(field, index) in fields"
          :key="field.key"
          class="resizable-th"
          :class="{
            'th--resizing': resizingKey === field.key,
            'col--pinned': field.fixed,
            'col--last-pinned': isLastPinned(field.key),
          }"
          :style="field.fixed ? { left: getStickyLeft(field.key) + 'px' } : {}"
        >
          <div
            class="header-content"
            @mouseenter="hoveredKey = field.key"
            @mouseleave="hoveredKey = null"
          >
            {{ field.label }}
            <div
              v-if="
                filterable &&
                (hoveredKey === field.key || isFilterActive(field.key))
              "
              class="header-filter-icon"
              :class="{ 'filter--active': isFilterActive(field.key) }"
              @click.stop="toggleFilterPopup(field.key)"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
              </svg>
            </div>
          </div>

          <!-- Column Filter Popup -->
          <div
            v-if="activeFilterKey === field.key"
            class="column-filter-popup"
            @click.stop
          >
            <div class="popup-header">
              <span>Lọc {{ field.label }}</span>
              <div class="popup-close" @click="activeFilterKey = null">✕</div>
            </div>
            <div class="popup-body">
              <select v-model="localFilter.operator" class="filter-select">
                <option value="contains">Chứa</option>
                <option value="equals">Bằng</option>
                <option value="starts_with">Bắt đầu bằng</option>
                <option value="ends_with">Kết thúc bằng</option>
                <option value="not_contains">Không chứa</option>
              </select>
              <input
                type="text"
                v-model="localFilter.value"
                class="filter-input-text"
                placeholder="Giá trị lọc"
                @keyup.enter="applyLocalFilter"
              />
            </div>
            <div class="popup-footer">
              <button class="btn-text" @click="clearLocalFilter">Bỏ lọc</button>
              <div class="footer-right">
                <button class="btn-white" @click="activeFilterKey = null">
                  Hủy
                </button>
                <button class="btn-primary" @click="applyLocalFilter">
                  Áp dụng
                </button>
              </div>
            </div>
          </div>

          <!-- Resize handle -->
          <div
            class="resize-handle"
            @mousedown.prevent="startResize($event, field.key)"
          ></div>
        </th>

        <th class="col-action"></th>
      </tr>

      <tr v-if="filterable" class="filter-row">
        <th
          v-if="hasCheckbox"
          class="col-checkbox col--pinned"
          style="left: 0; z-index: 31"
        ></th>
        <th
          v-for="field in fields"
          :key="'filter_' + field.key"
          :class="{
            'col--pinned': field.fixed,
            'col--last-pinned': isLastPinned(field.key),
          }"
          :style="field.fixed ? { left: getStickyLeft(field.key) + 'px' } : {}"
        >
          <div v-if="field.key" class="filter-input-wrapper">
            <input
              type="text"
              class="filter-input"
              v-model="filters[field.key]"
              @input="handleFilterInput"
              placeholder="*"
            />
          </div>
        </th>
        <th></th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="item in rows"
        :key="item[rowKey]"
        :class="{ 'row--selected': selected.includes(item[rowKey]) }"
        @dblclick="handleEdit(item)"
      >
        <td v-if="hasCheckbox" class="col-checkbox col--pinned" style="left: 0">
          <input
            type="checkbox"
            :checked="selected.includes(item[rowKey])"
            @change="toggleSelectRow(item[rowKey])"
          />
        </td>

        <td
          v-for="field in flatFields"
          :key="field.key"
          :class="{
            'col--pinned': field.fixed,
            'col--last-pinned': isLastPinned(field.key),
          }"
          :style="[
            field.align ? `text-align: ${field.align}` : '',
            field.fixed ? { left: getStickyLeft(field.key) + 'px' } : {},
          ]"
        >
          <template v-if="field.type === 'avatar'">
            <div class="table-avatar">
              <img
                v-if="item.urlAvatar || item.UrlAvatar"
                :src="item.urlAvatar || item.UrlAvatar"
                alt="Avatar"
                class="avatar-img-small"
              />
              <span v-else class="avatar-initial">{{
                getInitial(item.candidateName || item.CandidateName)
              }}</span>
            </div>
          </template>
          <template v-else-if="field.type === 'rating'">
            <span style="color: #ffc107; font-size: 18px">{{
              renderValue(item, field)
            }}</span>
          </template>
          <template v-else-if="field.type === 'checkbox'">
            <input type="checkbox" :checked="item[field.key]" disabled />
          </template>
          <template v-else>
            {{ renderValue(item, field) }}
          </template>
        </td>

        <td class="col-action">
          <div class="table__action">
            <MsButton
              type="custom"
              class="mi__icon"
              title="Sửa"
              @click="handleEdit(item)"
            >
              <div class="mi__icon__edit"></div>
            </MsButton>
            <MsButton
              type="custom"
              class="mi__icon"
              title="Xóa"
              @click="handleDelete(item)"
            >
              <div class="mi__icon__delete"></div>
            </MsButton>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import {
  computed,
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import MsButton from "../ms-button/MsButton.vue";
import { useFilterStore } from "../../stores/filterStore";

const filterStore = useFilterStore();

const props = defineProps({
  fields: { type: Array, required: true },
  rows: { type: Array, required: true },
  selected: { type: Array, default: () => [] },
  hasCheckbox: { type: Boolean, default: true },
  filterable: { type: Boolean, default: false },
});

const emit = defineEmits(["edit", "delete", "update:selected", "filter"]);

// ─── Helpers ────────────────────────────────────────────────────────────────

const rowKey = computed(() => {
  if (!props.rows.length) return "id";
  const keys = Object.keys(props.rows[0]);
  return keys.find((k) => k.toLowerCase().endsWith("id")) || keys[0];
});

const hasChildren = computed(() => props.fields.some((f) => f.children));

const flatFields = computed(() =>
  props.fields.reduce((acc, field) => {
    if (field.children) acc.push(...field.children);
    else acc.push(field);
    return acc;
  }, []),
);

// ─── Column widths ───────────────────────────────────────────────────────────

const DEFAULT_WIDTH = 150;
const MIN_WIDTH = 60;

const colWidths = reactive({});

// Khởi tạo width mặc định cho các cột
const initWidths = () => {
  flatFields.value.forEach((field) => {
    // Luôn cập nhật nếu field có width mới từ cha (dialog)
    if (field.width) {
      colWidths[field.key] = field.width;
    } else if (!colWidths[field.key]) {
      colWidths[field.key] = DEFAULT_WIDTH;
    }
  });
};

watch(() => props.fields, initWidths, { immediate: true, deep: true });
onMounted(initWidths);

// ─── Pinned logic ────────────────────────────────────────────────────────────

const getStickyLeft = (key) => {
  let left = props.hasCheckbox ? 48 : 0;
  for (let i = 0; i < props.fields.length; i++) {
    const field = props.fields[i];
    if (field.key === key) break;
    if (field.fixed) {
      left += colWidths[field.key] || field.width || DEFAULT_WIDTH;
    }
  }
  return left;
};

const isLastPinned = (key) => {
  const pinnedFields = props.fields.filter((f) => f.fixed);
  if (!pinnedFields.length) return false;
  return pinnedFields[pinnedFields.length - 1].key === key;
};

const tableWidth = computed(() => {
  const checkboxCol = props.hasCheckbox ? 48 : 0;
  const actionCol = 80;
  const colsWidth = flatFields.value.reduce(
    (sum, f) => sum + (colWidths[f.key] || DEFAULT_WIDTH),
    0,
  );
  return checkboxCol + colsWidth + actionCol;
});

// ─── Resize logic ────────────────────────────────────────────────────────────

const resizingKey = ref(null);
let startX = 0;
let startWidth = 0;

const startResize = (e, key) => {
  resizingKey.value = key;
  startX = e.clientX;
  startWidth = colWidths[key] || DEFAULT_WIDTH;

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
};

const onMouseMove = (e) => {
  if (!resizingKey.value) return;
  const delta = e.clientX - startX;
  const newWidth = Math.max(MIN_WIDTH, startWidth + delta);
  colWidths[resizingKey.value] = newWidth;
};

const onMouseUp = () => {
  resizingKey.value = null;
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
};

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
});

// ─── Filter ──────────────────────────────────────────────────────────────────

const hoveredKey = ref(null);
const activeFilterKey = ref(null);
const localFilter = reactive({
  operator: "contains",
  value: "",
});

const isFilterActive = (key) => {
  return (
    filterStore.columnFilters[key]?.active &&
    filterStore.columnFilters[key]?.value
  );
};

const toggleFilterPopup = (key) => {
  if (activeFilterKey.value === key) {
    activeFilterKey.value = null;
  } else {
    activeFilterKey.value = key;
    const current = filterStore.columnFilters[key] || {
      operator: "contains",
      value: "",
    };
    localFilter.operator = current.operator;
    localFilter.value = current.value;
  }
};

const applyLocalFilter = () => {
  filterStore.setFilter(activeFilterKey.value, {
    operator: localFilter.operator,
    value: localFilter.value,
    active: true,
  });
  activeFilterKey.value = null;
  emit("filter", filterStore.columnFilters);
};

const clearLocalFilter = () => {
  filterStore.removeFilter(activeFilterKey.value);
  activeFilterKey.value = null;
  emit("filter", filterStore.columnFilters);
};

const handleFilterInput = () => emit("filter", filterStore.columnFilters);

// Đóng popup khi click ngoài
const handleClickOutside = (e) => {
  if (
    activeFilterKey.value &&
    !e.target.closest(".column-filter-popup") &&
    !e.target.closest(".header-filter-icon")
  ) {
    activeFilterKey.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// ─── Render ──────────────────────────────────────────────────────────────────

const getInitial = (name) => {
  if (!name?.trim()) return "A";
  const parts = name.trim().split(" ");
  return parts[parts.length - 1].charAt(0).toUpperCase();
};

const renderValue = (row, field) => {
  const value = row[field.key];
  if (value == null || value === "") return "--";

  switch (field.type) {
    case "rating": {
      const num = Math.min(Math.max(Number(value) || 0, 0), 5);
      return "★".repeat(num) + "☆".repeat(5 - num);
    }
    case "currency":
      return Number(value || 0).toLocaleString("vi-VN");
    case "date": {
      const d = new Date(value);
      if (isNaN(d.getTime())) return "--";
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    }
    case "custom":
      return field.render ? field.render(row) : value;
    default:
      return value;
  }
};

// ─── Actions ─────────────────────────────────────────────────────────────────

const handleEdit = (row) => emit("edit", row);
const handleDelete = (row) => emit("delete", row);

const isAllSelected = computed(
  () =>
    props.rows.length > 0 &&
    props.rows.every((row) => props.selected.includes(row[rowKey.value])),
);

const toggleSelectRow = (id) => {
  const next = [...props.selected];
  const idx = next.indexOf(id);
  if (idx > -1) next.splice(idx, 1);
  else next.push(id);
  emit("update:selected", next);
};

const toggleSelectAll = () => {
  const ids = props.rows.map((row) => row[rowKey.value]);
  if (isAllSelected.value) {
    emit(
      "update:selected",
      props.selected.filter((id) => !ids.includes(id)),
    );
  } else {
    emit("update:selected", [...new Set([...props.selected, ...ids])]);
  }
};
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  min-width: 100%;
}

/* ── Header ── */
th {
  position: relative;
  text-align: left;
  height: 48px;
  padding: 8px 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top: 1px solid var(--border-table);
  border-right: 1px solid var(--border-table); /* Thêm viền phải để nhìn rõ cột */
  background-color: #f9fafb;
}

/* Bắt buộc phải có overflow visible để vùng bắt chuột nằm đè lên viền */
th.resizable-th {
  overflow: visible !important;
}

th.th--resizing {
  background-color: #eff6ff;
}

/* ── Resize handle giống MS Word ── */
.resize-handle {
  position: absolute;
  right: -4px; /* Nằm chính giữa đường viền của 2 cột */
  top: 0;
  bottom: 0;
  width: 8px; /* Tăng kích thước vùng bắt chuột để dễ kéo */
  cursor: col-resize; /* Mũi tên 2 bên (giống MS Word) */
  z-index: 10;

  /* Tạo đường kẻ mờ khi di chuột vào hoặc đang kéo */
  &::after {
    content: "";
    position: absolute;
    left: 3px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: transparent;
    transition: background 0.15s;
  }

  /* Khi hover hoặc đang kéo thì đường viền đổi màu xanh báo hiệu */
  &:hover::after,
  .th--resizing &::after {
    background: #3b82f6;
  }
}

/* ── Cells ── */
td {
  height: 48px;
  padding: 8px 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top: 1px solid var(--border-table);
  border-bottom: 1px solid var(--border-table);
  border-right: 1px solid var(--border-table);
  background-color: white;
}

/* ── Pinned Columns ── */
.col--pinned {
  position: sticky !important;
  z-index: 20;
  background-color: inherit; /* Giữ màu nền của hàng/thead */
}

th.col--pinned {
  z-index: 30; /* Header pinned cao hơn body pinned */
}

.col--last-pinned {
  border-right: 2px solid #e0e0e0 !important;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
}

tr:hover td.col--pinned {
  background-color: #f0f7ff !important;
}

tr:hover td {
  background-color: rgba(42, 126, 252, 0.07) !important;
}

/* ── Checkbox col ── */
.col-checkbox {
  width: 48px;
  min-width: 48px;
  text-align: center;
  padding: 0;
}

/* ── Action col ── */
.col-action {
  width: 80px;
  min-width: 80px;
  text-align: center;
  padding: 0;
}

/* ── Avatar ── */
.table-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #757575;
  overflow: hidden;
  border: 1px solid #ccc;
}

.avatar-img-small {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ── Header filter icon ── */
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 8px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.header-filter-icon {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #2680eb; /* Make it blue by default to be visible, or at least visible on hover */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  background: rgba(38, 128, 235, 0.1);

  &:hover {
    background: #2680eb;
    color: #fff;
  }
}

/* ── Column Filter Popup ── */
.column-filter-popup {
  position: absolute;
  top: 40px;
  left: 10px;
  width: 240px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
  border: 1px solid #e0e0e0;
  z-index: 100;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: default;
  white-space: normal;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  font-size: 14px;
  .popup-close {
    cursor: pointer;
    color: #999;
  }
}

.popup-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  .filter-select {
    height: 32px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    outline: none;
    padding: 0 8px;
    &:focus {
      border-color: #2680eb;
    }
  }
  .filter-input-text {
    height: 32px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    outline: none;
    padding: 0 8px;
    &:focus {
      border-color: #2680eb;
    }
  }
}

.popup-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f1f1f1;
}

.footer-right {
  display: flex;
  gap: 8px;
}

.btn-text {
  background: transparent;
  border: none;
  color: #2680eb;
  cursor: pointer;
  font-weight: 600;
  padding: 4px;
}
.btn-white {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 12px;
}
.btn-primary {
  background: #2680eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 12px;
}

/* ── Filter row ── */
.filter-row th {
  padding: 4px 8px;
  background: #fff;
  border-bottom: 1px solid var(--border-table);
}

.filter-input-wrapper .filter-input {
  width: 100%;
  height: 28px;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
  padding: 0 8px;
  font-size: 12px;
  outline: none;
  &:focus {
    border-color: #2680eb;
  }
}
</style>
