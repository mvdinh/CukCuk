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
          <th style="width: 300px">Thu thêm (đ)</th>
          <th style="width: 50px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pref, index) in servingPreferences" :key="index">
          <!-- Cột 1: chọn sở thích -->
          <td>
            <MsSelectCustom
              v-model="pref.preferenceID"
              :options="servingOptions"
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

          <!-- Cột 2: giá tự động điền khi chọn, cho phép sửa tay -->
          <td>
            <input
              class="price-input"
              type="number"
              :value="pref.price"
              min="0"
              @input="pref.price = Number($event.target.value)"
              @blur="pref.price = Number($event.target.value)"
            />
          </td>

          <!-- Cột 3: xóa dòng -->
          <td class="action-cell">
            <button class="btn-delete" @click="removeServingRow(index)">
              🗑️
            </button>
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
import MsInput from "../../components/ms-input/MsInput.vue";
import MsIcon from "../../components/ms-icon/MsIcon.vue";
import ServingDialog from "../dialogs/ServingDialog.vue";
import MsSelectCustom from "../../components/ms-select/MsSelectCustom.vue";

export default defineComponent({
  name: "ServingDetail",
  components: {
    MsInput,
    MsIcon,
    ServingDialog,
    MsSelectCustom,
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

    const handleAddServingRow = () => {
      if (!formState.item.value.servingPreferences) {
        formState.item.value.servingPreferences = [];
      }
      formState.item.value.servingPreferences.push({
        preferenceID: null,
        price: 0,
      });
    };

    const removeServingRow = (index) => {
      formState.item.value.servingPreferences.splice(index, 1);
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
.price-input {
  width: 100%;
  height: 32px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  padding: 0 10px;
  font-size: 14px;
  color: #111827;
  outline: none;
  box-sizing: border-box;
  background: #fff;
  transition: border-color 0.15s;
}

.price-input:focus {
  border-color: #2e90fa;
}

/* Ẩn spinner mặc định nếu muốn gọn hơn */
.price-input::-webkit-inner-spin-button,
.price-input::-webkit-outer-spin-button {
  opacity: 1;
}
</style>
