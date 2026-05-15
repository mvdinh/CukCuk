<template>
  <div class="section-title">Thông tin cơ bản</div>
  <div class="general-grid">
    <div class="image-section">
      <div class="image-box">
        <div class="image-placeholder">
          <img :src="icons.Image_placeholder" alt="image" class="image-icon" />
        </div>
      </div>
      <div class="image-desc">Ảnh món</div>
      <div class="image-sub">
        Chọn các ảnh có định dạng (.jpg, .jpeg, .png, .gif)
      </div>
      <div class="btn__actions">
        <MsButton
          type="secondary"
          text="Tải lên"
          :icon="{
            url: icons.form.upload,
            color: '#e6332a',
          }"
        />
        <MsButton
          type="icon"
          :icon="{
            url: icons.form.dots,
          }"
        />
        <MsButton
          type="icon"
          :icon="{
            url: icons.form.x,
            color: '#e6332a',
          }"
        />
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
          class="price-input"
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
          class="price-input"
          :error="errors.costPrice"
          @blur="validateField('costPrice')"
        />
      </div>

      <div class="field-row">
        <div class="kitchen-select-wrapper">
          <label>Chế biến tại</label>
          <div class="kitchen-tags-container">
            <div class="kitchen-tag" v-for="kId in item.kitchenIDs" :key="kId">
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
</template>

<script>
import { defineComponent, inject } from "vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsSelect from "../../components/ms-select/MsSelect.vue";
import MsButton from "../../components/ms-button/MsButton.vue";
const icons = inject("icons");

export default defineComponent({
  name: "InventoryDetailForm",
  components: {
    MsButton,
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

<style lang="scss" scoped>
@import "./InventoryDetailForm.scss";
</style>
