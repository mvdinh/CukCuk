<template>
  <div class="content">
    <ContentHeader
      @handleAdd="handleAdd"
      @handleDeleteInactive="handleDeleteInactive"
    />

    <div class="content__body">
      <div class="content__body__container">
        <CandidateToolbar
          v-model:selectedIds="selectedIds"
          v-model:searchText="searchText"
          @search="handleSearchEnter"
          @filter="handleFilter"
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
              v-model:selected="selectedIds"
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

    <CandidateForm
      v-if="isShowForm"
      :selectedRecord="selectedRecord"
      @close="closeForm"
      @save="handleSave"
    />
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, watch, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

import MsTable from "../../components/ms-table/MsTable.vue";
import CandidateForm from "./CandidateForm.vue";
import MsPagination from "../../components/ms-pagination/MsPagination.vue";
import ContentHeader from "../../components/Content/ContentHeader.vue";
import CandidateToolbar from "../../components/Content/CandidateToolbar.vue";
import BaseList from "../../base/BaseList";
import fieldMenu from "../../assets/data/fieldMenu.js";
import { toast } from "../../utils/toast";
import { confirmDialog } from "../../utils/confirm";
import { toPascalCasePayload } from "../../utils/payload";

export default defineComponent({
  name: "CandidateList",

  components: {
    MsTable,
    CandidateForm,
    MsPagination,
    ContentHeader,
    CandidateToolbar,
  },

  extends: BaseList,

  props: {
    api: {
      type: String,
      default: "https://localhost:7128/api/v1/InventoryItem",
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

        if (proxy.filters) {
          if (proxy.filters.source) {
            filtersArray.push({
              dataType: "string",
              operator: "equals",
              property: "candidateSource",
              value: proxy.filters.source,
            });
          }
          if (
            proxy.filters.gender !== null &&
            proxy.filters.gender !== undefined
          ) {
            filtersArray.push({
              dataType: "number",
              operator: "equals",
              property: "gender",
              value: proxy.filters.gender.toString(),
            });
          }
          if (proxy.filters.dateValue) {
            filtersArray.push({
              dataType: "date",
              operator: proxy.filters.dateOperator,
              property: "dateOfBirth",
              value: proxy.filters.dateValue,
            });
          }
        }

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

      if (proxy.filters) {
        if (proxy.filters.source) query.source = proxy.filters.source;
        if (proxy.filters.gender !== null) query.gender = proxy.filters.gender;
        if (proxy.filters.dateValue) {
          query.dateOfBirth = proxy.filters.dateValue;
          query.dateOperator = proxy.filters.dateOperator;
        }
      }

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
      const id = row.inventoryItemID || row.candidateID;
      const name = row.itemName || row.candidateName || "mục này";

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

    const handleDeleteMultiple = async () => {
      if (!proxy.selectedIds.length) return;

      const count = proxy.selectedIds.length;

      const confirmed = await confirmDialog(
        `Bạn có chắc chắn muốn xóa ${count} bản ghi đã chọn không?`,
        {
          title: "Xóa nhiều món ăn",
          type: "danger",
          confirmText: "Xóa tất cả",
          cancelText: "Hủy",
        },
      );
      console.log(proxy.selectedIds);

      if (!confirmed) return;

      try {
        await proxy.removeMultiple(proxy.selectedIds);
        toast.success(`Đã xóa ${count} bản ghi thành công!`);
        proxy.selectedIds = [];
        loadData();
      } catch (err) {
        console.error("Delete multiple error:", err);
        toast.error("Xóa thất bại. Vui lòng thử lại!");
      }
    };

    const handleSave = async (data) => {
      try {
        const isEdit = !!(data.inventoryItemID || data.candidateID);
        const payload = toPascalCasePayload(data);

        if (isEdit) {
          const id = data.inventoryItemID || data.candidateID;
          await proxy.update(id, payload);
          toast.success("Cập nhật món ăn thành công!");
        } else {
          await proxy.add(payload);
          toast.success("Thêm mới món ăn thành công!");
        }

        proxy.closeForm();
        loadData();
      } catch (err) {
        console.error("Save error:", err);

        // Hiển thị lỗi từ server nếu có
        const serverMessage =
          err.response?.data?.userMessage ||
          err.response?.data?.message ||
          null;

        if (serverMessage) {
          toast.error(serverMessage);
        } else {
          toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
        }
      }
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

      if (query.source || query.gender || query.dateOfBirth) {
        proxy.filters = {
          source: query.source || null,
          gender: query.gender !== undefined ? Number(query.gender) : null,
          dateValue: query.dateOfBirth || null,
          dateOperator: query.dateOperator || "=",
        };
      }

      loadData();
    });

    return {
      loadData,
      handlePagingChange,
      handleDelete,
      handleDeleteMultiple,
      handleSearchEnter,
      handleFilter,
      handleSave,

      fieldMenu,
    };
  },

  data() {
    return {
      pageIndex: 1,
      pageSize: 10,
      selectedIds: [],
      searchText: "",
      debounceTimer: null,
      filters: null,
    };
  },
});
</script>

<style>
@import url("../../assets/styles/employees.css");
</style>
