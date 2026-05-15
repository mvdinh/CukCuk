<template>
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
                  <span class="remove-tag" @click="removeKitchen(kId)">✕</span>
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
        Ghi lại các sở thích của khách hàng giúp nhân viên phục vụ chọn nhanh
        order. VD: không cay/ ít hành/ thêm phomai...
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
      <button class="btn-add-row" @click="handleAddServingRow">
        + Thêm dòng
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, inject, computed } from "vue";
import BaseForm from "../../base/BaseForm";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsSelect from "../../components/ms-select/MsSelect.vue";

export default defineComponent({
  name: "InventoryDetailForm",
  components: {
    MsInput,
    MsSelect,
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

    // Mock data to prevent crashes
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
    const removeServingRow = (index) => {};
    const handleAddServingRow = () => {};

    return {
      icons,
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
  },
});
</script>

<style lang="scss" scoped>
@import "./InventoryDetailForm.scss";
</style>
