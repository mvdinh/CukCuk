<template>
  <div class="section-title">Món ăn</div>
  <div class="info-text">
    Ghi lại các sở thích của khách hàng giúp nhân viên phục vụ chọn nhanh order.
    VD: không cay/ ít hành/ thêm phomai...
  </div>
  <!-- Table with MsSelect and + button -->
  <table class="serving-table">
    <thead>
      <tr>
        <th style="width: 60%">Sở thích phục vụ</th>
        <th>Thu thêm</th>
        <th style="width: 50px"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(pref, index) in item.servingPreferences" :key="index">
        <td>
          <div class="flex-row">
            <MsSelect
              v-model="pref.preferenceID"
              :options="servingOptions"
              class="flex-1"
              @change="updateServingPrice(index, pref.preferenceID)"
            />
            <button
              class="btn-icon-add"
              @click="handleOpenServingDialog(index)"
            >
              +
            </button>
          </div>
        </td>
        <td>
          <MsInput type="number" v-model="pref.price" />
        </td>
        <td class="action-cell">
          <button class="btn-delete" @click="removeServingRow(index)">
            🗑️
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <button class="btn-add-row" @click="handleAddServingRow">+ Thêm dòng</button>
</template>
<script>
import { defineComponent, inject } from "vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsSelect from "../../components/ms-select/MsSelect.vue";
export default defineComponent({
  name: "ServingDetail",
  components: {
    MsInput,
    MsSelect,
  },

  setup() {
    const icons = inject("icons");
    const formState = inject("formState");

    return {
      icons,
      ...formState,
    };
  },
});
</script>
<style scoped>
.info-text {
  font-size: 13px;
  color: #2680eb;
  margin-bottom: 16px;
}
.serving-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;

  th {
    text-align: left;
    padding: 12px;
    border-bottom: 1px solid #e0e0e0;
    background: #f9f9f9;
  }
  td {
    padding: 8px;
    border-bottom: 1px solid #e0e0e0;
  }

  tr:hover td {
    background-color: rgba(42, 126, 252, 0.1);
  }

  .flex-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .flex-1 {
    flex: 1;
  }

  .btn-icon-add {
    width: 32px;
    height: 32px;
    border: 1px solid #d0d0d0;
    background: #fff;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #2680eb;
    font-size: 20px;
    &:hover {
      background: #f0f4ff;
    }
  }

  .table-input {
    width: 100%;
    height: 32px;
    border: 1px solid transparent;
    padding: 0 8px;
    outline: none;
    &:focus {
      border-color: #2680eb;
      border-radius: 4px;
      background: #fff;
    }
  }
  .text-right {
    text-align: right;
  }
  .action-cell {
    text-align: center;
    cursor: pointer;
    color: red;
  }
}
.btn-add-row {
  background: transparent;
  border: 1px solid #e0e0e0;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #f9f9f9;
  }
}
</style>
