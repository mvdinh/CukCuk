<template>
  <div class="section-title">Thông tin cơ bản</div>
  <div class="general-grid">
    <div class="image-section">
      <div class="image-box">
        <div class="image-placeholder">
          <img
            :src="item.ImgUrl || icons.Image_placeholder"
            alt="image"
            class="image-icon"
          />
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
          @click="$refs.fileInput.click()"
        />
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          accept=".jpg,.jpeg,.png,.gif"
          style="display: none"
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
          @click="clearImage"
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
          :showAllErrors="showAllErrors"
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
          :showAllErrors="showAllErrors"
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
          v-model="item.inventoryItemTypeID"
          label="Loại thực đơn"
          :options="typeOptions"
          class="price-input"
        />
        <label class="checkbox-label special-checkbox">
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
          :showAllErrors="showAllErrors"
          :options="unitOptions"
          allowAdd
          @add="handleAddUnit"
          @blur="validateField('unitID')"
        />
      </div>

      <div class="field-row multi-col">
        <MsCurrencyInput
          v-model="item.salePrice"
          labelFor="Giá bán"
          required
          class="price-input"
          :error="errors.salePrice"
          ref="inputSalePrice"
          @blur="validateField('salePrice')"
          @update:modelValue="validateField('salePrice')"
        />
        <div class="price-checkboxes">
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="item.marketPriceStatus === 0"
              @change="item.marketPriceStatus = $event.target.checked ? 0 : null"
            />
            Thay đổi theo thời giá
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="item.marketPriceStatus === 1"
              @change="item.marketPriceStatus = $event.target.checked ? 1 : null"
            />
            Điều chỉnh giá tự do
          </label>
        </div>
      </div>

      <div class="field-row multi-col">
        <MsCurrencyInput
          v-model="item.costPrice"
          labelFor="Giá vốn"
          class="price-input"
          :error="errors.costPrice"
          @blur="validateField('costPrice')"
          @update:modelValue="validateField('costPrice')"
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
import MsInput from "../../../components/common/ms-input/MsInput.vue";
import MsSelect from "../../../components/common/ms-select/MsSelect.vue";
import MsButton from "../../../components/common/ms-button/MsButton.vue";
import MsCurrencyInput from "../../../components/common/ms-currency-input/MsCurrencyInput.vue";
import axios from "axios";
import { toast } from "../../../utils/toast";

async function sha1(string) {
  const utf8 = new TextEncoder().encode(string);
  const hashBuffer = await crypto.subtle.digest("SHA-1", utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export default defineComponent({
  name: "InventoryDetailForm",
  components: {
    MsButton,
    MsInput,
    MsSelect,
    MsCurrencyInput,
  },
  setup() {
    const icons = inject("icons");
    const formState = inject("formState");

    return {
      icons,
      ...formState,
    };
  },
  methods: {
    clearImage() {
      this.item.ImgUrl = null;
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        toast.info("Đang tải ảnh lên...");

        const cloudName = import.meta.env.VITE_CLOUDINARY_NAME?.replace(/['"]/g, "");
        const apiKey = import.meta.env.VITE_CLOUDINARY_KEY?.replace(/['"]/g, "");
        const apiSecret = import.meta.env.VITE_CLOUDINARY_SECRET?.replace(/['"]/g, "");
        const timestamp = Math.round(new Date().getTime() / 1000);

        const stringToSign = `timestamp=${timestamp}${apiSecret}`;
        const signature = await sha1(stringToSign);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const response = await axios.post(uploadUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data && response.data.secure_url) {
          this.item.ImgUrl = response.data.secure_url;
          toast.success("Tải ảnh lên thành công!");
        } else {
          toast.error("Tải ảnh lên thất bại.");
        }
      } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        toast.error("Có lỗi xảy ra khi tải ảnh.");
      } finally {
        event.target.value = "";
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@import "./InventoryDetailForm.scss";
</style>
