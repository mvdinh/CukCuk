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
        <strong>{{ rangeStart }}</strong> - <strong>{{ rangeEnd }}</strong> /
        <strong>{{ total }}</strong> bản ghi
      </span>
      <MsButton type="icon">
        <MsIcon :size="16" :webkitMaskImage="icons.paging.chevron_left_pipe" />
      </MsButton>
      <MsButton type="icon">
        <MsIcon :size="16" :webkitMaskImage="icons.paging.chevron_left" />
      </MsButton>
      <MsButton type="icon">
        <MsIcon :size="16" :webkitMaskImage="icons.paging.chevron_right" />
      </MsButton>
      <MsButton type="icon">
        <MsIcon :size="16" :webkitMaskImage="icons.paging.chevron_right_pipe" />
      </MsButton>
      <button
        class="btn-page"
        id="btnPrevPage"
        title="Trang trước"
        :disabled="currentPage <= 1"
        @click="changePage(currentPage - 1)"
      >
        <div class="icon-prev"></div>
      </button>

      <button
        class="btn-page"
        id="btnNextPage"
        title="Trang sau"
        :disabled="currentPage >= totalPages"
        @click="changePage(currentPage + 1)"
      >
        <div class="icon-next"></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";
import MsIcon from "../ms-icon/MsIcon.vue";
import MsButton from "../ms-button/MsButton.vue";
const icons = inject("icons");

const props = defineProps({
  total: Number,
  pageSize: Number,
  currentPage: Number,
});

const emit = defineEmits(["update:pageSize", "update:currentPage", "change"]);

const totalPages = computed(() => Math.ceil(props.total / props.pageSize) || 1);

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
@import url("../../assets/styles/employees.css");
</style>
