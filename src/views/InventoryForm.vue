<template>
  <div class="content inventory-form-wrapper">
    <div class="inventory-form">
      <div class="inventory-form__header">
        <div class="header-left">
          <div class="back-icon" @click="handleBack">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="#333"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h2>{{ isEdit ? "Sửa thực đơn" : "Thêm thực đơn" }}</h2>
          <div class="item-type-badge">Loại món: Món ăn <span>▼</span></div>
        </div>
      </div>

      <div class="inventory-form__tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="tab-item"
          :class="{ active: currentTab === tab.value }"
          @click="currentTab = tab.value"
        >
          {{ tab.label }}
        </div>
      </div>

      <div class="inventory-form__content">
        <!-- Thông tin chung -->
        <div v-show="currentTab === 'general'" class="tab-content general-info">
          <div class="section-title">Thông tin cơ bản</div>
          <div class="general-grid">
            <div class="image-section">
              <div class="image-box">
                <div class="image-placeholder">
                  <img
                    :src="icons.Image_placeholder"
                    alt="image"
                    class="image-icon"
                  />
                </div>
              </div>
              <div class="image-desc">Ảnh món</div>
              <div class="image-sub">
                Chọn các ảnh có định dạng (.jpg, .jpeg, .png, .gif)
              </div>
              <div class="image-actions">
                <button class="btn-upload">Tải lên</button>
              </div>
            </div>

            <div class="fields-section">
              <div class="field-row">
                <MsInput
                  v-model="item.itemName"
                  labelFor="Tên món"
                  required
                  :error="errors.itemName"
                  ref="inputItemName"
                  @blur="validateField('itemName')"
                />
              </div>
              <div class="field-row">
                <MsInput
                  v-model="item.itemCode"
                  labelFor="Mã món"
                  required
                  :error="errors.itemCode"
                  ref="inputItemCode"
                  @blur="validateField('itemCode')"
                />
              </div>
              <div class="field-row">
                <MsInput
                  v-model="item.foreignName"
                  labelFor="Tên món theo ngôn ngữ khác"
                />
              </div>

              <div class="field-row multi-col">
                <MsSelect
                  v-model="item.itemOrderType"
                  label="Thứ tự món"
                  :options="orderTypeOptions"
                />
                <label class="checkbox-label">
                  <input type="checkbox" v-model="item.isSpecial" />
                  <span>Là món đặc trưng</span>
                </label>
              </div>

              <div class="field-row">
                <MsSelect
                  v-model="item.inventoryItemCategoryID"
                  label="Nhóm thực đơn"
                  :options="categoryOptions"
                  allowAdd
                  @add="handleAddCategory"
                />
              </div>

              <div class="field-row">
                <MsSelect
                  v-model="item.unitID"
                  label="Đơn vị tính"
                  required
                  :error="errors.unitID"
                  :options="unitOptions"
                  allowAdd
                  @add="handleAddUnit"
                  @blur="validateField('unitID')"
                />
              </div>

              <div class="field-row multi-col">
                <MsInput
                  type="number"
                  v-model="item.salePrice"
                  labelFor="Giá bán"
                  required
                  :error="errors.salePrice"
                  ref="inputSalePrice"
                  @blur="validateField('salePrice')"
                />
                <label class="checkbox-label"
                  ><input type="checkbox" /> Thay đổi theo thời giá</label
                >
                <label class="checkbox-label"
                  ><input type="checkbox" /> Điều chỉnh giá tự do</label
                >
              </div>

              <div class="field-row multi-col">
                <MsInput
                  type="number"
                  v-model="item.costPrice"
                  labelFor="Giá vốn"
                  :error="errors.costPrice"
                  @blur="validateField('costPrice')"
                />
              </div>

              <div class="field-row">
                <div class="kitchen-select-wrapper">
                  <label>Chế biến tại</label>
                  <div class="kitchen-tags-container">
                    <div
                      class="kitchen-tag"
                      v-for="kId in item.kitchenIDs"
                      :key="kId"
                    >
                      {{ getKitchenName(kId) }}
                      <span class="remove-tag" @click="removeKitchen(kId)"
                        >✕</span
                      >
                    </div>
                    <select
                      v-if="availableKitchens.length > 0"
                      class="kitchen-dropdown"
                      @change="onSelectKitchen($event)"
                    >
                      <option value="" disabled selected>Chọn bếp...</option>
                      <option
                        v-for="k in availableKitchens"
                        :key="k.kitchenID"
                        :value="k.kitchenID"
                      >
                        {{ k.kitchenName }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="field-row">
                <label class="textarea-label">Mô tả</label>
                <textarea
                  v-model="item.description"
                  class="ms-textarea"
                  placeholder="Nhập thông tin mô tả về món ăn"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Other tabs placeholders -->
        <div v-show="currentTab === 'serving'" class="tab-content serving">
          <div class="section-title">Món ăn</div>
          <div class="info-text">
            Ghi lại các sở thích của khách hàng giúp nhân viên phục vụ chọn
            nhanh order. VD: không cay/ ít hành/ thêm phomai...
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
                    <button class="btn-icon-add" @click="handleOpenServingDialog(index)">+</button>
                  </div>
                </td>
                <td>
                  <MsInput type="number" v-model="pref.price" />
                </td>
                <td class="action-cell">
                  <button class="btn-delete" @click="removeServingRow(index)">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn-add-row" @click="handleAddServingRow">+ Thêm dòng</button>
        </div>
      </div>

      <div class="inventory-form__footer">
        <MsButton type="secondary" @click="handleCancel">Hủy</MsButton>
        <div class="footer-right">
          <MsButton type="secondary" @click="handleSaveAndAdd"
            >Lưu và thêm</MsButton
          >
          <MsButton type="primary" @click="handleSave">Lưu</MsButton>
        </div>
      </div>
    </div>

    <!-- DIALOGS -->
    <CategoryDialog v-model="showCategoryDialog" @saved="onCategorySaved" />
    <UnitDialog v-model="showUnitDialog" @saved="onUnitSaved" />
    <ServingDialog v-model="showServingDialog" @saved="onServingSaved" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useInventoryItemStore } from "../stores/inventoryItemStore";
import { useCategoryStore } from "../stores/categoryStore";
import { useUnitStore } from "../stores/unitStore";
import { useKitchenStore } from "../stores/kitchenStore";
import MsInput from "../components/ms-input/MsInput.vue";
import MsSelect from "../components/ms-select/MsSelect.vue";
import MsButton from "../components/ms-button/MsButton.vue";
import CategoryDialog from "./dialogs/CategoryDialog.vue";
import UnitDialog from "./dialogs/UnitDialog.vue";
import ServingDialog from "./dialogs/ServingDialog.vue";
import { useServingStore } from "../stores/servingStore";
import { confirmDialog } from "../utils/confirm";
import { toast } from "../utils/toast";

const icons = inject("icons");
const router = useRouter();
const route = useRoute();

const inventoryStore = useInventoryItemStore();
const categoryStore = useCategoryStore();
const unitStore = useUnitStore();
const kitchenStore = useKitchenStore();
const servingStore = useServingStore();

const isEdit = computed(() => !!route.params.id);

const tabs = [
  { value: "general", label: "Thông tin chung" },
  { value: "serving", label: "Sở thích phục vụ" },
];

const currentTab = ref("general");

const item = ref({
  itemName: "",
  itemCode: "",
  foreignName: "",
  itemOrderType: "Món khai vị",
  isSpecial: false,
  inventoryItemCategoryID: "",
  unitID: "",
  salePrice: 0,
  costPrice: 0,
  kitchenIDs: [],
  description: "",
  servingPreferences: [],
});

const originalItemString = ref("");

const orderTypeOptions = [
  { value: "Món khai vị", label: "Món khai vị" },
  { value: "Món chính", label: "Món chính" },
  { value: "Tráng miệng", label: "Tráng miệng" },
  { value: "Đồ uống", label: "Đồ uống" },
];

const errors = ref({
  itemName: "",
  itemCode: "",
  unitID: "",
  salePrice: "",
  costPrice: "",
});

const inputItemName = ref(null);
const inputItemCode = ref(null);
const inputSalePrice = ref(null);

const categoryOptions = computed(() =>
  categoryStore.categories.map((c) => ({
    value: c.inventoryItemCategoryID,
    label: c.inventoryItemCategoryName,
  })),
);
const unitOptions = computed(() =>
  unitStore.units.map((u) => ({ value: u.unitID, label: u.unitName })),
);

const availableKitchens = computed(() => {
  return kitchenStore.kitchens.filter(
    (k) => !item.value.kitchenIDs.includes(k.kitchenID),
  );
});

const servingOptions = computed(() =>
  servingStore.preferences.map((p) => ({ value: p.id, label: p.name })),
);

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    unitStore.fetchUnits(),
    kitchenStore.fetchKitchens(),
    servingStore.fetchPreferences(),
  ]);

  if (isEdit.value) {
    await inventoryStore.fetchItem(route.params.id);
    // Bind to item
    item.value = {
      ...inventoryStore.item,
      kitchenIDs: inventoryStore.item.kitchenIDs || [],
    };
  }

  originalItemString.value = JSON.stringify(item.value);

  // Tab key focus trap
  window.addEventListener("keydown", handleGlobalKeydown);
});

const getKitchenName = (id) => {
  const k = kitchenStore.kitchens.find((k) => k.kitchenID === id);
  return k ? k.kitchenName : "";
};

const onSelectKitchen = (e) => {
  const id = e.target.value;
  if (id) {
    item.value.kitchenIDs.push(id);
    e.target.value = "";
  }
};

const removeKitchen = (id) => {
  item.value.kitchenIDs = item.value.kitchenIDs.filter((kId) => kId !== id);
};

const showCategoryDialog = ref(false);
const showUnitDialog = ref(false);

const handleAddCategory = () => {
  showCategoryDialog.value = true;
};

const onCategorySaved = (name) => {
  const newCat = categoryStore.categories.find(c => c.inventoryItemCategoryName === name);
  if (newCat) {
    item.value.inventoryItemCategoryID = newCat.inventoryItemCategoryID;
  }
};

const handleAddUnit = () => {
  showUnitDialog.value = true;
};

const onUnitSaved = (name) => {
  const newUnit = unitStore.units.find(u => u.unitName === name);
  if (newUnit) {
    item.value.unitID = newUnit.unitID;
  }
};

const showServingDialog = ref(false);
const currentServingIndex = ref(-1);

const handleAddServingRow = () => {
  item.value.servingPreferences.push({ preferenceID: "", price: 0 });
};

const removeServingRow = (index) => {
  item.value.servingPreferences.splice(index, 1);
};

const handleOpenServingDialog = (index) => {
  currentServingIndex.value = index;
  showServingDialog.value = true;
};

const onServingSaved = (newPref) => {
  servingStore.addPreference(newPref);
  if (currentServingIndex.value > -1) {
    item.value.servingPreferences[currentServingIndex.value].preferenceID = newPref.id;
    item.value.servingPreferences[currentServingIndex.value].price = newPref.price;
  }
};

const updateServingPrice = (index, prefID) => {
  const pref = servingStore.preferences.find(p => p.id === prefID);
  if (pref) {
    item.value.servingPreferences[index].price = pref.price;
  }
};

const isDirty = computed(
  () => JSON.stringify(item.value) !== originalItemString.value,
);

const handleBack = async () => {
  if (isDirty.value) {
    const confirmed = await confirmDialog(
      "Bạn có chắc chắn muốn hủy thay đổi không?",
      { confirmText: "Đồng ý", cancelText: "Không" },
    );
    if (!confirmed) return;
  }
  router.push("/");
};

const handleCancel = handleBack;

const validateField = (field) => {
  errors.value[field] = "";
  if (field === "itemName" && !item.value.itemName)
    errors.value.itemName = "Tên món không được để trống.";
  if (field === "itemCode" && !item.value.itemCode)
    errors.value.itemCode = "Mã món không được để trống.";
  if (field === "unitID" && !item.value.unitID)
    errors.value.unitID = "Đơn vị tính không được để trống.";
  if (field === "salePrice") {
    if (item.value.salePrice === "" || item.value.salePrice === null)
      errors.value.salePrice = "Giá bán không được để trống.";
    else if (item.value.salePrice < 0)
      errors.value.salePrice = "Giá bán không được âm.";
  }
  if (field === "costPrice" && item.value.costPrice < 0)
    errors.value.costPrice = "Giá vốn không được âm.";
};

const validateAll = () => {
  Object.keys(errors.value).forEach(validateField);
  return !Object.values(errors.value).some((err) => err);
};

const focusFirstError = () => {
  nextTick(() => {
    const errorEl = document.querySelector(".input--error");
    if (errorEl) {
      errorEl.focus();
      errorEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
};

const handleSave = async () => {
  if (!validateAll()) {
    focusFirstError();
    return;
  }
  try {
    await inventoryStore.saveItem(item.value, isEdit.value);
    toast.success("Lưu thành công!");
    originalItemString.value = JSON.stringify(item.value); // Reset dirty state
    router.push("/inventory");
  } catch (error) {
    toast.error("Có lỗi xảy ra khi lưu.");
  }
};

const handleSaveAndAdd = async () => {
  if (!validateAll()) {
    focusFirstError();
    return;
  }
  try {
    await inventoryStore.saveItem(item.value, isEdit.value);
    toast.success("Lưu thành công!");
    originalItemString.value = JSON.stringify(item.value);
    if (isEdit.value) {
      router.push("/inventory/add");
    } else {
      // Reset form
      item.value = {
        itemName: "",
        itemCode: "",
        foreignName: "",
        itemOrderType: "Món khai vị",
        isSpecial: false,
        inventoryItemCategoryID: "",
        unitID: "",
        salePrice: 0,
        costPrice: 0,
        kitchenIDs: [],
        description: "",
      };
      originalItemString.value = JSON.stringify(item.value);
    }
  } catch (error) {
    toast.error("Có lỗi xảy ra khi lưu.");
  }
};

const handleGlobalKeydown = (e) => {
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault(); // Prevent submit on enter
  }
};
</script>

<style lang="scss">
@import "../assets/styles/InventoryFormStyle.scss";
</style>
