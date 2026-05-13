<template>
  <table id="table__user">
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
          :style="field.type === 'avatar' ? 'min-width: 48px; width: 48px; padding-right: 0;' : ''"
        >
          {{ field.label }}
        </th>

        <th class="col-action" rowspan="2"></th>
      </tr>
      <tr>
        <template v-for="field in fields" :key="'sub_' + (field.key || field.label)">
          <th v-if="field.children" v-for="child in field.children" :key="child.key">
            {{ child.label }}
          </th>
        </template>
      </tr>
    </thead>
    <thead v-else>
      <tr>
        <th v-if="hasCheckbox" class="col-checkbox">
          <input
            type="checkbox"
            :checked="isAllSelected"
            @change="toggleSelectAll"
          />
        </th>

        <th v-for="field in fields" :key="field.key" :style="field.type === 'avatar' ? 'min-width: 48px; width: 48px; padding-right: 0;' : ''">
          <div class="header-content">
            {{ field.label }}
            <div v-if="filterable" class="header-filter-icon" @click.stop="toggleFilter(field.key)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M3 6H21M6 12H18M10 18H14" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </th>

        <th class="col-action"></th>
      </tr>
      <tr v-if="filterable" class="filter-row">
        <th v-if="hasCheckbox"></th>
        <th v-for="field in fields" :key="'filter_' + field.key">
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
        <td v-if="hasCheckbox" class="col-checkbox">
          <input
            type="checkbox"
            :checked="selected.includes(item[rowKey])"
            @change="toggleSelectRow(item[rowKey])"
          />
        </td>

        <td v-for="field in flatFields" :key="field.key" :style="[field.type === 'avatar' ? 'min-width: 48px; width: 48px; padding-right: 0;' : '', field.align ? `text-align: ${field.align}` : '']">
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
             <span style="color: #FFC107; font-size: 18px;">{{ renderValue(item, field) }}</span>
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
import { computed, ref } from "vue";
import MsButton from "../ms-button/MsButton.vue";

const props = defineProps({
  fields: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  selected: {
    type: Array,
    default: () => [],
  },
  hasCheckbox: {
    type: Boolean,
    default: true,
  },
  filterable: {
    type: Boolean,
    default: false,
  },
});

const filters = ref({});
const filterVisible = ref({});

const handleFilterInput = () => {
  emit("filter", filters.value);
};

const toggleFilter = (key) => {
  filterVisible.value[key] = !filterVisible.value[key];
};

const emit = defineEmits(["edit", "delete", "update:selected"]);

const rowKey = computed(() => {
  if (!props.rows.length) return "id";

  const keys = Object.keys(props.rows[0]);
  return keys.find((k) => k.toLowerCase().endsWith("id"));
});

const hasChildren = computed(() => props.fields.some((f) => f.children));

const flatFields = computed(() => {
  return props.fields.reduce((acc, field) => {
    if (field.children) {
      acc.push(...field.children);
    } else {
      acc.push(field);
    }
    return acc;
  }, []);
});

const getInitial = (name) => {
  if (!name || !name.trim()) return "A";
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

    case "currency": {
      return Number(value || 0).toLocaleString("vi-VN");
    }

    case "date": {
      const d = new Date(value);
      if (isNaN(d.getTime())) return "--";
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }

    case "custom":
      return field.render ? field.render(row) : value;

    default:
      return value;
  }
};

const handleEdit = (row) => emit("edit", row);
const handleDelete = (row) => emit("delete", row);


const isAllSelected = computed(() => {
  return (
    props.rows.length > 0 &&
    props.rows.every((row) => props.selected.includes(row[rowKey.value]))
  );
});

const toggleSelectRow = (id) => {
  const newSelected = [...props.selected];
  const index = newSelected.indexOf(id);

  if (index > -1) newSelected.splice(index, 1);
  else newSelected.push(id);

  emit("update:selected", newSelected);
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
}

th {
  text-align: left;
  height: 48px;
  padding: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top: 1px solid var(--border-table);
  background-color: #f9fafb;
  min-width: 120px;
  max-width: 240px;
}

td {
  height: 48px;
  padding: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-top: 1px solid var(--border-table);
  border-bottom: 1px solid var(--border-table);
  background-color: white;
}
tr:hover td {
  background-color: rgba(42, 126, 252, 0.1) !important;
}

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

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.header-filter-icon {
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  &:hover {
    background: #e0e0e0;
  }
}

.filter-row {
  th {
    padding: 4px 8px;
    background: #fff;
    border-bottom: 1px solid var(--border-table);
  }
}

.filter-input-wrapper {
  .filter-input {
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
}
</style>
