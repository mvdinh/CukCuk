<template>
  <div class="inventory-form__content">
    <div v-show="currentTab === 'general'" class="tab-content">
      <InventoryDetailForm />
    </div>
    <div v-show="currentTab === 'serving'" class="tab-content">
      <ServingDetail />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, inject, provide } from "vue";
import BaseForm from "../../base/BaseForm";
import ServingDetail from "./ServingDetail.vue";
import InventoryDetailForm from "./InventoryDetailForm.vue";

export default defineComponent({
  name: "InventoryDetailMain",
  components: {
    ServingDetail,
    InventoryDetailForm,
  },
  extends: BaseForm,
  props: {
    currentTab: {
      type: String,
      default: "general",
    },
    api: {
      type: String,
      default: "https://localhost:7056/api/v1/inventory",
    },
  },

  setup(props) {
    const icons = inject("icons");

    // Unified state for the entire form
    const item = ref({
      itemName: "",
      itemCode: "",
      foreignName: "",
      itemOrderType: 1,
      isSpecial: false,
      inventoryItemCategoryID: null,
      unitID: null,
      salePrice: 0,
      costPrice: 0,
      kitchenIDs: [],
      description: "",
      servingPreferences: [],
    });

    const errors = ref({
      itemName: [],
      itemCode: [],
      unitID: [],
      salePrice: [],
    });

    const orderTypeOptions = ref([
      { label: "1", value: 1 },
      { label: "2", value: 2 },
    ]);
    const categoryOptions = ref([]);
    const unitOptions = ref([]);
    const availableKitchens = ref([]);
    const servingOptions = ref([]);

    const getKitchenName = (id) => "Bếp";
    const removeKitchen = (id) => {};
    const onSelectKitchen = (e) => {};
    const validateField = (field) => {};
    const handleAddCategory = () => {};
    const handleAddUnit = () => {};
    const updateServingPrice = (index, id) => {};
    const handleOpenServingDialog = (index) => {};
    const removeServingRow = (index) => {
      item.value.servingPreferences.splice(index, 1);
    };
    const handleAddServingRow = () => {
      item.value.servingPreferences.push({
        preferenceID: null,
        price: 0,
      });
    };

    // Provide state and methods to child components
    const state = {
      item,
      errors,
      orderTypeOptions,
      categoryOptions,
      unitOptions,
      availableKitchens,
      servingOptions,
      getKitchenName,
      removeKitchen,
      onSelectKitchen,
      validateField,
      handleAddCategory,
      handleAddUnit,
      updateServingPrice,
      handleOpenServingDialog,
      removeServingRow,
      handleAddServingRow,
    };

    provide("formState", state);

    return {
      icons,
      ...state,
    };
  },
});
</script>

<style lang="scss" scoped>
.inventory-form__content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f4f5f8;
  display: flex;
  flex-direction: column;
}

.tab-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 16px;
  display: flex;
  flex-direction: column;
}
</style>
