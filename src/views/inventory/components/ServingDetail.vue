<template>
  <div class="section-title">Món ăn</div>

  <div class="info-text">
    <MsIcon
      :color="'#2E90FA'"
      :size="16"
      :webkitMaskImage="icons.form.info"
      class="icon-info"
    />
    <div class="info-text__content">
      Ghi lại các sở thích của khách hàng giúp nhân viên phục vụ chọn nhanh
      order. VD: không cay/ ít hành/ thêm phomai...
    </div>
  </div>

  <div class="serving-table-container">
    <div class="table-toolbar__search">
      <MsInput
        v-model="localSearchText"
        :isSearch="true"
        placeholder="Tìm kiếm"
      />
    </div>

    <table class="serving-table">
      <thead>
        <tr>
          <th style="width: calc(100% - 350px)">Sở thích phục vụ</th>
          <th style="width: 300px" class="price-header-cell">Thu thêm (đ)</th>
          <th style="width: 50px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pref, index) in servingPreferences" :key="index">
          <!-- Cột 1: chọn sở thích -->
          <td>
            <MsSelectCustom
              v-model="pref.preferenceID"
              :options="getAvailableOptions(index)"
              :valueField="'inventoryItemAdditionID'"
              :labelField="'additionName'"
              :priceField="'extraPrice'"
              colLabelTitle="Tên sở thích"
              colPriceTitle="Thu thêm (đ)"
              :allowAdd="true"
              @change="(id) => onSelectChange(index, id)"
              @add="openAddDialog(index)"
            />
          </td>

          <!-- Cột 2: Thu thêm -->
          <td class="price-display-cell">
            <MsCurrencyInput
              v-model="pref.price"
              placeholder="0"
            />
          </td>

          <!-- Cột 3: xóa dòng -->
          <td class="action-cell">
            <div class="btn-delete" @click="removeServingRow(index)">
              <MsIcon
                :size="18"
                :isImage="true"
                :webkitMaskImage="icons.table.trash"
                color="red"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <button class="btn-add-row" @click="handleAddServingRow">
      + Thêm dòng
    </button>
  </div>

  <ServingDialog v-model="showAddDialog" @saved="handleNewPreference" />
</template>

<script>
import { defineComponent, inject, ref, computed } from "vue";
import MsInput from "../../../components/common/ms-input/MsInput.vue";
import MsIcon from "../../../components/common/ms-icon/MsIcon.vue";
import ServingDialog from "../dialogs/ServingDialog.vue";
import MsSelectCustom from "../../../components/common/ms-select/MsSelectCustom.vue";
import MsCurrencyInput from "../../../components/common/ms-currency-input/MsCurrencyInput.vue";
import { confirmDialog } from "../../../utils/confirm";

export default defineComponent({
  name: "ServingDetail",
  components: {
    MsInput,
    MsIcon,
    ServingDialog,
    MsSelectCustom,
    MsCurrencyInput,
  },

  setup() {
    const icons = inject("icons");
    const formState = inject("formState");

    const showAddDialog = ref(false);
    const currentEditIndex = ref(-1);
    const localSearchText = ref("");

    const servingPreferences = computed(() => {
      return formState.item.value?.servingPreferences ?? [];
    });

    // Khi chọn option từ dropdown:
    // 1. ghi preferenceID (đã do v-model xử lý)
    // 2. tự tìm extraPrice trong servingOptions và điền vào pref.price
    const onSelectChange = (index, id) => {
      const opt = formState.servingOptions.value.find(
        (o) => o.inventoryItemAdditionID === id,
      );
      formState.item.value.servingPreferences[index].price =
        opt?.extraPrice ?? 0;

      console.log("[ServingDetail] onSelectChange →", {
        index,
        id,
        price: opt?.extraPrice,
      });
    };

    const getAvailableOptions = (currentIndex) => {
      const selectedInOthers = (formState.item.value?.servingPreferences || [])
        .filter((pref, idx) => idx !== currentIndex && pref.preferenceID)
        .map((pref) => pref.preferenceID);

      return (formState.servingOptions.value || []).filter(
        (opt) => !selectedInOthers.includes(opt.inventoryItemAdditionID)
      );
    };

    const handleAddServingRow = () => {
      if (!formState.item.value.servingPreferences) {
        formState.item.value.servingPreferences = [];
      }
      formState.item.value.servingPreferences.push({
        preferenceID: null,
        price: 0,
      });
    };

    const removeServingRow = async (index) => {
      const pref = formState.item.value.servingPreferences[index];
      let additionName = "";
      if (pref && pref.preferenceID) {
        const option = formState.servingOptions.value?.find(
          (o) => o.inventoryItemAdditionID === pref.preferenceID
        );
        if (option) {
          additionName = option.additionName;
        }
      }

      const message = additionName
        ? `Bạn có chắc chắn muốn xóa sở thích phục vụ "${additionName}" khỏi danh sách không?`
        : "Bạn có chắc chắn muốn xóa dòng sở thích phục vụ này không?";

      const confirmed = await confirmDialog(message, {
        title: "Xóa sở thích phục vụ",
        type: "danger",
        confirmText: "Xóa",
        cancelText: "Hủy",
      });

      if (confirmed) {
        formState.item.value.servingPreferences.splice(index, 1);
      }
    };

    const openAddDialog = (index) => {
      currentEditIndex.value = index;
      showAddDialog.value = true;
    };

    // Khi thêm mới xong từ ServingDialog
    const handleNewPreference = (newPref) => {
      if (currentEditIndex.value > -1) {
        formState.item.value.servingPreferences[
          currentEditIndex.value
        ].preferenceID = newPref.inventoryItemAdditionID || newPref.id;
        formState.item.value.servingPreferences[currentEditIndex.value].price =
          newPref.extraPrice ?? newPref.price ?? 0;
      }
    };

    return {
      icons,
      servingPreferences,
      servingOptions: formState.servingOptions,
      getAvailableOptions,
      showAddDialog,
      localSearchText,
      currentEditIndex,
      onSelectChange,
      handleAddServingRow,
      removeServingRow,
      openAddDialog,
      handleNewPreference,
    };
  },
});
</script>

<style lang="scss" src="./ServingDetail.scss" />

<style scoped>
.price-display-cell {
  text-align: left !important;
  padding-left: 12px !important;
  font-size: 13.5px;
  color: #1f2937;
  font-weight: 500;

  :deep(.ms-currency-input) {
    width: 100%;
    max-width: 200px;
  }
}

.price-header-cell {
  text-align: left !important;
  padding-left: 12px !important;
}

.btn-delete {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  margin: 0 auto;
}

.btn-delete:hover {
  background-color: #fff0f0 !important;
  border-color: #ffccc7 !important;
}
</style>
