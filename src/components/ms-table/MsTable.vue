<template>
  <div class="ms-table-container">
    <table
      id="table__user"
      :style="{ tableLayout: 'fixed', width: tableWidth + 'px' }"
    >
      <colgroup>
        <col v-if="hasCheckbox" style="width: 48px; min-width: 48px" />
        <col
          v-for="field in flatFields"
          :key="'col_' + field.key"
          :style="{ width: (colWidths[field.key] || field.width || 160) + 'px' }"
        />
        <col style="width: 80px; min-width: 80px" />
      </colgroup>

      <thead v-if="hasChildren">
        <tr>
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
              v-for="child in field.children || []"
              :key="child.key"
              class="resizable-th"
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
            style="left: 0; z-index: 51"
          ></th>

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
              <span class="header-label">{{ field.label }}</span>
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
                  width="12"
                  height="12"
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
              <span style="color: #ffc107; font-size: 13px">{{
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
                type="secondary"
                :icon="{ url: icons.table.swap_resize, x: 0, y: 0, color: '#1f1f1f' }"
                @click="handleEdit"
                class="btn__action"
              />
              <MsButton
                type="secondary"
                :icon="{
                  url: icons.table.box_multiple,
                  x: 0,
                  y: 0,
                  color: '#1f1f1f',
                }"
                @click="handleDuplicate"
                class="btn__action"
              />
              <MsButton
                type="secondary"
                :icon="{ url: icons.table.trash, x: 0, y: 0, color: 'red' }"
                @click="handleDelete"
                class="btn__action"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  watch,
  inject,
} from "vue";
import MsButton from "../ms-button/MsButton.vue";
import { useTableFilter } from "./useTableFilter";
const icons = inject("icons");
const props = defineProps({
  fields: { type: Array, required: true },
  rows: { type: Array, required: true },
  selected: { type: Array, default: () => [] },
  hasCheckbox: { type: Boolean, default: true },
  filterable: { type: Boolean, default: false },
});

const emit = defineEmits(["edit", "delete", "update:selected", "filter"]);

// ─── Filter Logic ────────────────────────────────────────────────────────────
const {
  hoveredKey,
  activeFilterKey,
  filters,
  localFilter,
  handleFilterInput,
  toggleFilterPopup,
  isFilterActive,
  applyLocalFilter,
  clearLocalFilter,
} = useTableFilter(props, emit);

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

const DEFAULT_WIDTH = 160;
const MIN_WIDTH = 60;

const colWidths = reactive({});

const initWidths = () => {
  flatFields.value.forEach((field) => {
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

<style scoped>
@import url("./MsTable.css");
</style>
