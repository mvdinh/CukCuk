<template>
  <div class="content__body__footer">
    <div class="content__body__footer__total" id="totalRecords">
      Tổng: <strong>{{ total }}</strong> bản ghi
    </div>

    <div class="content__body__footer__paging">
      <span class="paging-label">Số dòng/trang</span>

      <select
        id="pageSizeSelect"
        class="page-size-select"
        :value="pageSize"
        @change="onPageSizeChange"
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>

      <span class="page-info" id="pageInfo">
        <strong>{{ rangeStart }}</strong> -
        <strong>{{ rangeEnd }}</strong> /
        <strong>{{ total }}</strong> bản ghi
      </span>

      <!-- Trang đầu -->
      <MsButton
        type="icon"
        title="Trang đầu"
        :disabled="currentPage <= 1"
        @click="changePage(1)"
      >
        <MsIcon
          :size="16"
          :webkitMaskImage="icons.paging.chevron_left_pipe"
        />
      </MsButton>

      <!-- Trang trước -->
      <MsButton
        type="icon"
        title="Trang trước"
        :disabled="currentPage <= 1"
        @click="changePage(currentPage - 1)"
      >
        <MsIcon
          :size="16"
          :webkitMaskImage="icons.paging.chevron_left"
        />
      </MsButton>

      <!-- Trang sau -->
      <MsButton
        type="icon"
        title="Trang sau"
        :disabled="currentPage >= totalPages"
        @click="changePage(currentPage + 1)"
      >
        <MsIcon
          :size="16"
          :webkitMaskImage="icons.paging.chevron_right"
        />
      </MsButton>

      <!-- Trang cuối -->
      <MsButton
        type="icon"
        title="Trang cuối"
        :disabled="currentPage >= totalPages"
        @click="changePage(totalPages)"
      >
        <MsIcon
          :size="16"
          :webkitMaskImage="icons.paging.chevron_right_pipe"
        />
      </MsButton>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";
import MsIcon from "../ms-icon/MsIcon.vue";
import MsButton from "../ms-button/MsButton.vue";

const icons = inject("icons");

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },

  pageSize: {
    type: Number,
    default: 10,
  },

  currentPage: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits([
  "update:pageSize",
  "update:currentPage",
  "change",
]);

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize) || 1;
});

const rangeStart = computed(() => {
  if (props.total === 0) return 0;
  return (props.currentPage - 1) * props.pageSize + 1;
});

const rangeEnd = computed(() => {
  const end = props.currentPage * props.pageSize;
  return end > props.total ? props.total : end;
});

const onPageSizeChange = (e) => {
  const size = parseInt(e.target.value);

  emit("update:pageSize", size);
  emit("update:currentPage", 1);
  emit("change");
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit("update:currentPage", page);
    emit("change");
  }
};
</script>

<style scoped>
@import url("../../../assets/styles/employees.css");

.content__body__footer__paging {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-select {
  height: 32px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  padding: 0 8px;
  outline: none;
}

.page-info {
  margin: 0 8px;
}
</style>