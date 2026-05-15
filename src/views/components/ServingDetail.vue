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
          <th style="width: 300px">Thu thêm</th>
          <th style="width: 50px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pref, index) in servingPreferences" :key="index">
          <td>
            <div class="flex-row">
              <MsSelect
                v-model="pref.preferenceID"
                :options="servingOptions"
                class="flex-1"
                :allowAdd="true"
                @change="updateServingPrice(index, pref.preferenceID)"
                @add="openAddDialog(index)"
              />
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

    <button class="btn-add-row" @click="handleAddServingRow">
      + Thêm dòng
    </button>
  </div>

  <ServingSelectionDialog
    v-model="showSelectionDialog"
    :options="servingOptions"
    @select="handleSelection"
    @add="openAddDialogFromSelection"
  />

  <ServingDialog v-model="showAddDialog" @saved="handleNewPreference" />
</template>

<script>
import { defineComponent, inject, ref, computed } from "vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsSelect from "../../components/ms-select/MsSelect.vue";
import MsIcon from "../../components/ms-icon/MsIcon.vue";
import ServingSelectionDialog from "../dialogs/ServingSelectionDialog.vue";
import ServingDialog from "../dialogs/ServingDialog.vue";

export default defineComponent({
  name: "ServingDetail",
  components: {
    MsInput,
    MsSelect,
    MsIcon,
    ServingSelectionDialog,
    ServingDialog,
  },

  setup() {
    const icons = inject("icons");
    const formState = inject("formState");

    const showSelectionDialog = ref(false);
    const showAddDialog = ref(false);
    const currentEditIndex = ref(-1);
    const localSearchText = ref("");

    // ✅ Dùng computed để luôn trỏ đúng vào mảng reactive
    const servingPreferences = computed(() => {
      return formState.item.value?.servingPreferences ?? [];
    });

    const handleAddServingRow = () => {
      // ✅ Truy cập trực tiếp qua formState.item.value
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

    const openSelectionDialog = (index) => {
      currentEditIndex.value = index;
      showSelectionDialog.value = true;
    };

    const openAddDialog = (index) => {
      currentEditIndex.value = index;
      showAddDialog.value = true;
    };

    const openAddDialogFromSelection = () => {
      showAddDialog.value = true;
    };

    const handleSelection = (selectedIds) => {
      if (selectedIds.length > 0 && currentEditIndex.value > -1) {
        formState.item.value.servingPreferences[
          currentEditIndex.value
        ].preferenceID = selectedIds[0];
        formState.updateServingPrice(currentEditIndex.value, selectedIds[0]);
      }
    };

    const handleNewPreference = (newPref) => {
      if (currentEditIndex.value > -1) {
        formState.item.value.servingPreferences[
          currentEditIndex.value
        ].preferenceID = newPref.id;
        formState.item.value.servingPreferences[currentEditIndex.value].price =
          newPref.price;
      }
    };

    return {
      icons,
      servingPreferences, // ✅ dùng computed thay vì item trực tiếp
      servingOptions: formState.servingOptions,
      updateServingPrice: formState.updateServingPrice,
      showSelectionDialog,
      showAddDialog,
      localSearchText,
      handleAddServingRow,
      removeServingRow,
      openSelectionDialog,
      openAddDialog,
      openAddDialogFromSelection,
      handleSelection,
      handleNewPreference,
    };
  },
});
</script>

<style lang="scss" src="./ServingDetail.scss" />
