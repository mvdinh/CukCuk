<template>
  <div class="content">
    <ContentHeader @handleAdd="handleAdd" @handleImport="handleImport" />

    <div class="content__body">
      <div class="content__body__container">
        <CandidateToolbar
          v-model:searchText="searchText"
          :selectedIds="[]"
          @search="handleSearchEnter"
          @filter="handleFilter"
          @reload="loadData"
        />

        <div class="content__body__table">
          <div v-if="rows.length === 0" class="table__empty-overlay">
            <span class="table__empty-message">
              Không tìm thấy dữ liệu phù hợp
            </span>
          </div>

          <div class="table-wrapper">
            <MsTable
              :rows="rows"
              :fields="fieldMenu"
              :hasCheckbox="false"
              @edit="handleEdit"
              @delete="handleDelete"
            />
          </div>
        </div>

        <MsPagination
          :total="totalRows"
          v-model:currentPage="pageIndex"
          v-model:pageSize="pageSize"
          @change="handlePagingChange"
        />
      </div>
    </div>

    <!-- InventoryForm goes here in the future -->
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, watch, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

import MsTable from "../components/ms-table/MsTable.vue";
import MsPagination from "../components/ms-pagination/MsPagination.vue";
import ContentHeader from "../components/Content/ContentHeader.vue";
import CandidateToolbar from "../components/Content/CandidateToolbar.vue";
import BaseList from "../base/BaseList";
import fieldMenu from "../assets/data/fieldMenu.js";
import { toast } from "../utils/toast";
import { confirmDialog } from "../utils/confirm";

export default defineComponent({
  name: "InventoryList",

  components: {
    MsTable,
    MsPagination,
    ContentHeader,
    CandidateToolbar,
  },

  extends: BaseList,

  props: {
    api: {
      type: String,
      default: "https://localhost:7056/api/v1/inventory",
    },
  },

  setup(props) {
    const { proxy } = getCurrentInstance();
    const router = useRouter();
    const route = useRoute();

    const loadData = async () => {
      try {
        proxy.loading = true;

        const filtersArray = [];
        // Giữ logic filter cũ nếu cần, hoặc bỏ đi

        const payload = {
          textSearch: proxy.searchText || "",
          Filters: filtersArray,
          pageIndex: proxy.pageIndex,
          pageSize: proxy.pageSize,
        };

        const res = await axios.post(`${props.api}/filter`, payload);

        proxy.store.data = res.data.listData ?? [];
        proxy.store.total = res.data.totalCount ?? 0;
      } catch (err) {
        console.error("loadData error:", err.response || err);
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại!");
      } finally {
        proxy.loading = false;
      }
    };

    const updateUrl = () => {
      const query = {
        page: proxy.pageIndex,
        pageSize: proxy.pageSize,
        search: proxy.searchText || undefined,
      };
      router.replace({ query });
    };

    const handlePagingChange = () => {
      updateUrl();
      loadData();
    };

    const handleSearchEnter = () => {
      proxy.pageIndex = 1;
      updateUrl();
      loadData();
    };

    const handleFilter = (filters) => {
      proxy.filters = filters;
      proxy.pageIndex = 1;
      updateUrl();
      loadData();
    };

    const handleSearchChange = () => {
      clearTimeout(proxy.debounceTimer);

      proxy.debounceTimer = setTimeout(() => {
        proxy.pageIndex = 1;
        updateUrl();
        loadData();
      }, 500);
    };

    const handleDelete = async (row) => {
      const id = row.inventoryItemID;
      const name = row.itemName || "mục này";

      const confirmed = await confirmDialog(
        `Bạn có chắc chắn muốn xóa "${name}" không?`,
        {
          title: "Xóa món ăn",
          type: "danger",
          confirmText: "Xóa",
          cancelText: "Hủy",
        },
      );

      if (!confirmed) return;

      try {
        await proxy.remove(id);
        toast.success(`Đã xóa "${name}" thành công!`);
        loadData();
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Xóa thất bại. Vui lòng thử lại!");
      }
    };

    const handleImport = () => {
      toast.info("Tính năng nhập từ Excel đang phát triển!");
    };

    const handleAdd = () => {
      router.push({ name: "inventory-add" });
    };

    const handleEdit = (row) => {
      router.push({ name: "inventory-edit", params: { id: row.inventoryItemID } });
    };

    watch(
      () => proxy.searchText,
      () => handleSearchChange(),
    );

    onMounted(() => {
      const query = route.query;

      proxy.pageIndex = Number(query.page) || 1;
      proxy.pageSize = Number(query.pageSize) || 10;
      proxy.searchText = query.search || "";

      loadData();
    });

    return {
      loadData,
      handlePagingChange,
      handleDelete,
      handleSearchEnter,
      handleFilter,
      handleImport,
      handleAdd,
      handleEdit,

      fieldMenu,
    };
  },

  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      searchText: "",
      debounceTimer: null,
      filters: null,
    };
  },
});
</script>

<style>
@import url("../assets/styles/employees.css");
</style>
