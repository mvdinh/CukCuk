<template>
  <div class="inventory-form__content">
    <div v-show="currentTab === 'general'" class="tab-content">
      <InventoryDetailForm />
    </div>
    <div v-show="currentTab === 'serving'" class="tab-content">
      <ServingDetail />
    </div>
    <CategoryDialog v-model="isCategoryDialogOpen" />
    <UnitDialog v-model="isUnitDialogOpen" />
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  inject,
  provide,
  onMounted,
  computed,
  watch,
} from "vue";
import BaseForm from "../../../base/BaseForm";
import ServingDetail from "./ServingDetail.vue";
import InventoryDetailForm from "./InventoryDetailForm.vue";
import CategoryDialog from "../dialogs/CategoryDialog.vue";
import UnitDialog from "../dialogs/UnitDialog.vue";

import { useCategoryStore } from "../../../stores/categoryStore";
import { useUnitStore } from "../../../stores/unitStore";
import { useKitchenStore } from "../../../stores/kitchenStore";
import { useInventoryItemStore } from "../../../stores/inventoryItemStore";
import { useTypeStore } from "../../../stores/typeStore";
import { useServingStore } from "../../../stores/servingStore";
import { useRoute } from "vue-router";
import { toast } from "../../../utils/toast";

export default defineComponent({
  name: "InventoryDetailMain",
  components: {
    ServingDetail,
    InventoryDetailForm,
    CategoryDialog,
    UnitDialog,
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
    const route = useRoute();

    const categoryStore = useCategoryStore();
    const unitStore = useUnitStore();
    const kitchenStore = useKitchenStore();
    const inventoryItemStore = useInventoryItemStore();
    const typeStore = useTypeStore();
    const servingStore = useServingStore();

    const isEdit = computed(() => !!route.params.id);

    // Unified state for the entire form
    const item = ref({
      itemName: "",
      itemCode: "",
      foreignName: "",
      inventoryItemTypeID: null,
      isSpecial: false,
      isMarketPrice: false,
      inventoryItemCategoryID: null,
      marketPriceStatus: null,
      unitID: null,
      salePrice: 0,
      costPrice: 0,
      kitchenIDs: [],
      description: "",
      servingPreferences: [],
    });

    const errors = ref({
      itemName: "",
      itemCode: "",
      unitID: "",
      salePrice: "",
    });

    const isCategoryDialogOpen = ref(false);
    const isUnitDialogOpen = ref(false);
    const showAllErrors = ref(false);

    watch(
      () => item.value.itemName,
      () => {
        validateField("itemName");
      },
    );
    watch(
      () => item.value.itemCode,
      () => {
        validateField("itemCode");
      },
    );

    onMounted(async () => {
      try {
        await Promise.allSettled([
          categoryStore.fetchCategories(),
          unitStore.fetchUnits(),
          kitchenStore.fetchKitchens(),
          typeStore.fetchTypes(),
          servingStore.fetchPreferences(),
        ]);

        if (isEdit.value) {
          await inventoryItemStore.fetchItem(route.params.id);
          const fetchedItem = inventoryItemStore.item;
          Object.assign(item.value, fetchedItem);

          // Map kitchens
          if (fetchedItem.kitchens && Array.isArray(fetchedItem.kitchens)) {
            item.value.kitchenIDs = fetchedItem.kitchens.map(
              (k) => k.kitchenID || k,
            );
          } else if (fetchedItem.kitchenIDs) {
            item.value.kitchenIDs = Array.isArray(fetchedItem.kitchenIDs)
              ? fetchedItem.kitchenIDs
              : [fetchedItem.kitchenIDs];
          } else if (fetchedItem.kitchenID) {
            item.value.kitchenIDs = [fetchedItem.kitchenID];
          } else {
            item.value.kitchenIDs = [];
          }

          // Map additions to servingPreferences
          if (fetchedItem.additions && Array.isArray(fetchedItem.additions)) {
            item.value.servingPreferences = fetchedItem.additions.map((a) => ({
              preferenceID:
                a.inventoryItemAdditionID || a.additionID || a.preferenceID,
              price: a.extraPrice ?? a.price ?? 0,
            }));
          } else if (fetchedItem.servingPreferences) {
            item.value.servingPreferences = Array.isArray(
              fetchedItem.servingPreferences,
            )
              ? fetchedItem.servingPreferences
              : [];
          } else {
            item.value.servingPreferences = [];
          }

          item.value.imageUrl =
            fetchedItem.imageUrl ||
            fetchedItem.imagePath ||
            fetchedItem.picture ||
            fetchedItem.image ||
            null;
        }
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu");
      }
    });

    const servingOptions = computed(() => servingStore.preferences || []);

    const categoryOptions = computed(() => {
      return categoryStore.categories.map((c) => ({
        label: c.categoryName,
        value: c.inventoryItemCategoryID,
      }));
    });

    const typeOptions = computed(() => {
      return typeStore.types.map((t) => ({
        label: t.typeName,
        value: t.inventoryItemTypeID,
      }));
    });

    const unitOptions = computed(() => {
      return unitStore.units.map((u) => ({
        label: u.unitName,
        value: u.unitID,
      }));
    });

    const allKitchens = computed(() => kitchenStore.kitchens);

    const availableKitchens = computed(() => {
      return allKitchens.value.filter(
        (k) => !item.value.kitchenIDs.includes(k.kitchenID),
      );
    });

    const getKitchenName = (id) => {
      const kitchen = allKitchens.value.find((k) => k.kitchenID === id);
      return kitchen ? kitchen.kitchenName : "Bếp";
    };

    const removeKitchen = (id) => {
      item.value.kitchenIDs = item.value.kitchenIDs.filter((k) => k !== id);
    };

    const onSelectKitchen = (e) => {
      const selectedId = e.target.value;
      if (selectedId && !item.value.kitchenIDs.includes(selectedId)) {
        item.value.kitchenIDs.push(selectedId);
      }
      e.target.value = "";
    };

    const validateField = (field) => {
      errors.value[field] = "";
      if (field === "itemName" && !item.value.itemName) {
        errors.value.itemName = "Tên món không được để trống.";
      }
      if (field === "itemCode" && !item.value.itemCode) {
        errors.value.itemCode = "Mã món không được để trống.";
      }
    };

    const validateAll = () => {
      showAllErrors.value = true;
      validateField("itemName");
      validateField("itemCode");

      return !errors.value.itemName && !errors.value.itemCode;
    };

    const saveData = async () => {
      try {
        await inventoryItemStore.saveItem(item.value, isEdit.value);
        return true;
      } catch (err) {
        return false;
      }
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        alert("Vui lòng chọn ảnh dung lượng dưới 5MB");
        return;
      }
      try {
        // Fake upload locally, directly use URL.createObjectURL
        item.value.imageUrl = URL.createObjectURL(file);
      } catch (err) {
        alert("Tải ảnh thất bại");
      }
      event.target.value = "";
    };

    const handleAddCategory = () => {
      isCategoryDialogOpen.value = true;
    };

    const handleAddUnit = () => {
      isUnitDialogOpen.value = true;
    };

    const updateServingPrice = (index, id) => {
      const opt = servingOptions.value.find(
        (o) => o.inventoryItemAdditionID === id,
      );
      if (opt && item.value.servingPreferences[index]) {
        item.value.servingPreferences[index].price = opt.extraPrice || 0;
      }
    };
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
      typeOptions,
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
      showAllErrors,
      handleFileUpload,
      saveData,
    };

    provide("formState", state);

    return {
      icons,
      ...state,
      isCategoryDialogOpen,
      isUnitDialogOpen,
      validateAll,
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
