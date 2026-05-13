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
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
                      stroke="#B0B0B0"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
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
          <!-- Simple mockup table for UI -->
          <table class="serving-table">
            <thead>
              <tr>
                <th>Sở thích phục vụ</th>
                <th>Thu thêm</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="text" class="table-input" /></td>
                <td>
                  <input
                    type="text"
                    class="table-input text-right"
                    value="0,00"
                  />
                </td>
                <td class="action-cell">🗑️</td>
              </tr>
            </tbody>
          </table>
          <button class="btn-add-row">+ Thêm dòng</button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useInventoryItemStore } from "../stores/inventoryItemStore";
import { useCategoryStore } from "../stores/categoryStore";
import { useUnitStore } from "../stores/unitStore";
import { useKitchenStore } from "../stores/kitchenStore";
import MsInput from "../components/ms-input/MsInput.vue";
import MsSelect from "../components/ms-select/MsSelect.vue";
import MsButton from "../components/ms-button/MsButton.vue";
import { confirmDialog } from "../utils/confirm";
import { toast } from "../utils/toast";

const router = useRouter();
const route = useRoute();

const inventoryStore = useInventoryItemStore();
const categoryStore = useCategoryStore();
const unitStore = useUnitStore();
const kitchenStore = useKitchenStore();

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

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchCategories(),
    unitStore.fetchUnits(),
    kitchenStore.fetchKitchens(),
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

const handleAddCategory = async () => {
  const name = prompt("Nhập tên nhóm thực đơn mới:");
  if (name) {
    try {
      const res = await categoryStore.addCategory(name);
      toast.success("Thêm nhóm thực đơn thành công!");
      // Auto select logic needs the response ID, mock for now
    } catch (e) {
      toast.error("Thêm nhóm thực đơn thất bại");
    }
  }
};

const handleAddUnit = async () => {
  const name = prompt("Nhập tên đơn vị tính mới:");
  if (name) {
    try {
      const res = await unitStore.addUnit(name);
      toast.success("Thêm đơn vị tính thành công!");
    } catch (e) {
      toast.error("Thêm đơn vị tính thất bại");
    }
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
