<template>
  <div class="content">
    <ContentHeader @handleAdd="handleAdd" @handleImport="handleImport" />

    <div class="content-wrapper">
      <div class="content__body">
        <div class="content__body__container">
          <ContentToolbar
            v-model:searchText="searchText"
            @search="handleSearchEnter"
            @reload="loadData"
            @configColumns="columnStore.showConfig = true"
            @export="handleExport"
          />

          <div class="content__body__main">
            <div
              class="content__body__table"
              :class="{ 'table--with-filter': filterStore.showAdvancedFilter }"
            >
              <div v-if="rows.length === 0" class="table__empty-overlay">
                <span class="table__empty-message">
                  Không tìm thấy dữ liệu phù hợp
                </span>
              </div>

              <div class="table-wrapper">
                <MsTable
                  :rows="rows"
                  :fields="tableColumns"
                  :hasCheckbox="false"
                  filterable
                  :loading="loading"
                  @edit="handleEdit"
                  @delete="handleDelete"
                  @filter="handleFilter"
                />
              </div>
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
      <MsTableFilterPopup
        v-if="filterStore.showAdvancedFilter"
        @apply="handleFilter"
      />
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  watch,
  onMounted,
  ref,
  computed,
} from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { exportToExcel } from "../../utils/excelExporter";

import MsTable from "../../components/common/ms-table/MsTable.vue";
import MsPagination from "../../components/common/ms-pagination/MsPagination.vue";
import ContentHeader from "../../components/Content/ContentHeader.vue";
import ContentToolbar from "../../components/Content/ContentToolbar.vue";
import BaseList from "../../base/BaseList";
import fieldMenuData from "../../assets/data/fieldMenu.js";
import { useColumnStore } from "../../stores/columnStore";
import { useFilterStore } from "../../stores/filterStore";
import { toast } from "../../utils/toast";
import { confirmDialog } from "../../utils/confirm";
import MsTableFilterPopup from "./dialogs/MsTableFilterPopup.vue";

export default defineComponent({
  name: "InventoryList",

  components: {
    MsTable,
    MsPagination,
    ContentHeader,
    ContentToolbar,
    MsTableFilterPopup,
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
    const columnStore = useColumnStore();
    const filterStore = useFilterStore();

    // Dùng cột từ store (đã lọc visible)
    const tableColumns = computed(() => {
      return columnStore.inventoryColumns.filter((c) => c.visible !== false);
    });

    const handleExport = () => {
      try {
        console.log("handleExport called");
        proxy.loading = true;

        if (!proxy.store.data || proxy.store.data.length === 0) {
          toast.warning("Không có dữ liệu để xuất!");
          return;
        }

        exportToExcel({
          data: proxy.store.data,
          columns: tableColumns.value,
          title: "Danh sách thực đơn",
          fileName: "Danh_sach_thuc_don",
          sheetName: "Thực đơn",
        });

        toast.success("Xuất file Excel thành công!");
      } catch (err) {
        console.error("handleExport error:", err);
        toast.error("Xuất file Excel thất bại!");
      } finally {
        proxy.loading = false;
      }
    };

    const loadData = async () => {
      try {
        proxy.loading = true;

        const filtersArray = [];
        const columnFilters = filterStore.columnFilters;

        Object.keys(columnFilters).forEach((key) => {
          const filter = columnFilters[key];
          // Cho phép giá trị 0 (với checkbox)
          const hasValue =
            filter.value !== "" &&
            filter.value !== null &&
            filter.value !== undefined;

          if (filter.active && hasValue) {
            let dataType = "string";
            const fieldDef = fieldMenuData.find((f) => f.key === key);

            if (fieldDef) {
              if (fieldDef.type === "number") {
                dataType = "number";
              } else if (
                fieldDef.type === "checkbox" ||
                fieldDef.type === "boolean"
              ) {
                // Người dùng yêu cầu truyền dataType là "string" cho checkbox
                dataType = "string";
              }
            }

            filtersArray.push({
              dataType: dataType,
              operator: filter.operator || "equals",
              property: key,
              value:
                fieldDef &&
                (fieldDef.type === "checkbox" || fieldDef.type === "boolean")
                  ? String(filter.value)
                  : filter.value,
            });
          }
        });

        const payload = {
          textSearch: proxy.searchText || "",
          Filters: filtersArray,
          pageIndex: proxy.pageIndex,
          pageSize: proxy.pageSize,
        };

        const startTime = Date.now();
        const res = await axios.post(`${props.api}/filter`, payload);

        proxy.store.data = res.data.listData ?? [];
        proxy.store.total = res.data.totalCount ?? 0;

        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 1000) {
          await new Promise((resolve) => setTimeout(resolve, 1000 - elapsedTime));
        }
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
      router.push({
        name: "inventory-edit",
        params: { id: row.inventoryItemID },
      });
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
      handleExport,
      handleImport,
      handleAdd,
      handleEdit,
      tableColumns,
      columnStore,
      filterStore,
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


.content {
  background: #d5d7da;
  font-family: Inter;
  box-sizing: border-box;
  position: absolute;
  width: calc(100% - 200px);
  height: calc(100% - 48px);
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
}
.content-wrapper {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.content__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  padding: 0 20px 20px;
}

.content__body__container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: white;
  border-radius: 4px;
}

.content__body__main {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.content__body__table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  min-width: 0;
  position: relative;
}

.table__empty-overlay {
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  z-index: 5;
}

.table-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* No special margin needed since it's a flex sibling */
</style>
