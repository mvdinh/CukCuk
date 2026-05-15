<template>
  <div class="ms-dialog-overlay" v-if="modelValue">
    <div class="ms-dialog serving-selection-dialog">
      <div class="ms-dialog__header">
        <h3 class="ms-dialog__title">Chọn sở thích phục vụ</h3>
        <div class="ms-dialog__close" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <div class="ms-dialog__content">
        <div class="search-bar">
          <MsInput 
            v-model="searchText" 
            placeholder="Nhập sở thích phục vụ cần tìm" 
            class="flex-1"
          />
          <MsButton type="secondary" class="btn-search">
            <template #icon>
              <MsIcon :webkitMaskImage="icons.table.search" :size="16" />
            </template>
            Tìm kiếm
          </MsButton>
        </div>

        <div class="table-wrapper">
          <table class="selection-table">
            <thead>
              <tr>
                <th style="width: 40px"><input type="checkbox" @change="toggleAll" :checked="isAllSelected" /></th>
                <th>Sở thích phục vụ</th>
                <th style="width: 150px">Thu thêm</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="opt in filteredOptions" :key="opt.value" @click="toggleRow(opt.value)">
                <td><input type="checkbox" :checked="selectedIds.includes(opt.value)" @click.stop /></td>
                <td>{{ opt.label }}</td>
                <td class="text-right">{{ formatCurrency(opt.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <div class="pagination-left">
            <MsIcon :webkitMaskImage="icons.table.first" :size="20" />
            <MsIcon :webkitMaskImage="icons.table.prev" :size="20" />
            <span>Trang</span>
            <input type="text" value="1" class="page-input" />
            <span>trên 1</span>
            <MsIcon :webkitMaskImage="icons.table.next" :size="20" />
            <MsIcon :webkitMaskImage="icons.table.last" :size="20" />
            <MsIcon :webkitMaskImage="icons.table.refresh" :size="20" />
            <select class="page-size">
              <option>100</option>
            </select>
          </div>
          <div class="pagination-right">
            Hiển thị 1 - {{ filteredOptions.length }} trên {{ filteredOptions.length }} kết quả
          </div>
        </div>
      </div>

      <div class="ms-dialog__footer">
        <div class="footer-left">
          <MsButton type="secondary" @click="$emit('add')">
            <template #icon>
              <MsIcon :webkitMaskImage="icons.form.plus" :size="16" color="#2680eb" />
            </template>
            Thêm...
          </MsButton>
        </div>
        <div class="footer-right">
          <MsButton type="primary" @click="confirm">
            <template #icon>
              <MsIcon :webkitMaskImage="icons.table.check" :size="16" color="#fff" />
            </template>
            Chọn
          </MsButton>
          <MsButton type="secondary" class="btn-cancel" @click="close">
            <template #icon>
              <MsIcon :webkitMaskImage="icons.table.x_circle" :size="16" color="#ef4444" />
            </template>
            Hủy bỏ
          </MsButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsButton from "../../components/ms-button/MsButton.vue";
import MsIcon from "../../components/ms-icon/MsIcon.vue";

const props = defineProps({
  modelValue: Boolean,
  options: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["update:modelValue", "select", "add"]);

const icons = inject("icons");
const searchText = ref("");
const selectedIds = ref([]);

const filteredOptions = computed(() => {
  if (!searchText.value) return props.options;
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(searchText.value.toLowerCase())
  );
});

const isAllSelected = computed(() => {
  return filteredOptions.value.length > 0 && selectedIds.value.length === filteredOptions.value.length;
});

const toggleAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = [];
  } else {
    selectedIds.value = filteredOptions.value.map(opt => opt.value);
  }
};

const toggleRow = (id) => {
  const index = selectedIds.value.indexOf(id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(id);
  }
};

const close = () => emit("update:modelValue", false);

const confirm = () => {
  emit("select", selectedIds.value);
  close();
};

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 2 }).format(val || 0);
};
</script>

<style scoped lang="scss">
.ms-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.serving-selection-dialog {
  width: 800px;
  background: #fff;
  border-radius: 4px;
  border: 4px solid #0072bc;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);

  .ms-dialog__header {
    background: #0072bc;
    height: 36px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;

    .ms-dialog__title {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }

    .ms-dialog__close {
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }

  .ms-dialog__content {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .search-bar {
      display: flex;
      gap: 8px;
      
      .btn-search {
        border: 1px solid #d0d0d0;
        height: 32px;
        padding: 0 12px;
        font-size: 13px;
      }
    }

    .table-wrapper {
      height: 300px;
      overflow-y: auto;
      border: 1px solid #e0e0e0;

      .selection-table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;

        th, td {
          border: 1px solid #e0e0e0;
          padding: 8px;
          text-align: left;
          font-size: 13px;
        }

        th {
          background: #f5f5f5;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        tr:hover {
          background: #f0f7ff;
          cursor: pointer;
        }

        .text-right {
          text-align: right;
        }
      }
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      background: #f9f9f9;
      border: 1px solid #e0e0e0;
      font-size: 12px;

      .pagination-left {
        display: flex;
        align-items: center;
        gap: 8px;

        .page-input {
          width: 30px;
          height: 24px;
          text-align: center;
          border: 1px solid #d0d0d0;
        }

        .page-size {
          height: 24px;
        }
      }
    }
  }

  .ms-dialog__footer {
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-top: 1px solid #e0e0e0;

    .footer-right {
      display: flex;
      gap: 8px;
    }

    .btn-cancel {
      color: #333;
    }
  }
}

.flex-1 { flex: 1; }
</style>
