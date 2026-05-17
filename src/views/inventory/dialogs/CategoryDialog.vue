<template>
  <div class="ms-dialog-overlay" v-if="modelValue">
    <div class="ms-dialog category-dialog">
      <div class="ms-dialog__header">
        <h3 class="ms-dialog__title">Thêm Nhóm thực đơn</h3>
        <div class="ms-dialog__close" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="#666"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <div class="ms-dialog__content">
        <!-- Mã nhóm -->
        <div class="dialog-field-row">
          <label class="dialog-label"
            >Mã nhóm <span class="required">*</span></label
          >
          <div class="dialog-control">
            <MsInput
              v-model="formData.categoryCode"
              :error="errors.categoryCode"
              :showAllErrors="showAllErrors"
              @blur="validateField('categoryCode')"
              @update:modelValue="validateField('categoryCode')"
            />
          </div>
        </div>

        <!-- Tên nhóm -->
        <div class="dialog-field-row">
          <label class="dialog-label"
            >Tên nhóm <span class="required">*</span></label
          >
          <div class="dialog-control">
            <MsInput
              v-model="formData.categoryName"
              :error="errors.categoryName"
              :showAllErrors="showAllErrors"
              @blur="validateField('categoryName')"
              @update:modelValue="validateField('categoryName')"
            />
          </div>
        </div>

        <!-- Thuộc loại -->
        <div class="dialog-field-row">
          <label class="dialog-label"
            >Thuộc loại <span class="required">*</span></label
          >
          <div class="dialog-control">
            <MsSelect
              v-model="formData.type"
              :options="typeOptions"
              :error="errors.type"
              :showAllErrors="showAllErrors"
              @blur="validateField('type')"
              @update:modelValue="validateField('type')"
            />
          </div>
        </div>

        <!-- Chế biến tại -->
        <div class="dialog-field-row">
          <label class="dialog-label">Chế biến tại</label>
          <div class="dialog-control">
            <MsSelect
              v-model="formData.kitchenID"
              :options="kitchenOptions"
              allowAdd
              @add="openKitchenDialog"
            />
          </div>
        </div>

        <!-- Diễn giải -->
        <div class="dialog-field-row align-start">
          <label class="dialog-label">Diễn giải</label>
          <div class="dialog-control">
            <textarea
              class="dialog-textarea"
              v-model="formData.description"
              placeholder="Nhập diễn giải..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="ms-dialog__footer">
        <MsButton type="secondary" @click="close">Hủy</MsButton>
        <MsButton type="primary" @click="save">Lưu</MsButton>
      </div>
    </div>

    <KitchenDialog v-model="isKitchenDialogOpen" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import MsInput from "../../../components/common/ms-input/MsInput.vue";
import MsSelect from "../../../components/common/ms-select/MsSelect.vue";
import KitchenDialog from "./KitchenDialog.vue";
import MsButton from "../../../components/common/ms-button/MsButton.vue";
import { useCategoryStore } from "../../../stores/categoryStore";
import { useKitchenStore } from "../../../stores/kitchenStore";
import { useTypeStore } from "../../../stores/typeStore";
import { toast } from "../../../utils/toast";
import BaseDialog from "../../../base/BaseDialog";

export default defineComponent({
  name: "CategoryDialog",

  components: {
    MsInput,
    MsSelect,
    KitchenDialog,
    MsButton,
  },

  extends: BaseDialog,

  setup() {
    const categoryStore = useCategoryStore();
    const kitchenStore = useKitchenStore();
    const typeStore = useTypeStore();
    return { categoryStore, kitchenStore, typeStore };
  },

  data() {
    return {
      isKitchenDialogOpen: false,
    };
  },

  computed: {
    typeOptions() {
      return this.typeStore.types.map((t) => ({
        value: t.inventoryItemTypeID,
        label: t.typeName,
      }));
    },

    kitchenOptions() {
      return this.kitchenStore.kitchens.map((k) => ({
        value: k.kitchenID,
        label: k.kitchenName,
      }));
    },
  },

  methods: {
    openKitchenDialog() {
      this.isKitchenDialogOpen = true;
    },

    /**
     * Ghi đè hàm reset form
     */
    async resetForm() {
      this.formData = {
        categoryCode: "",
        categoryName: "",
        nameEn: "",
        nameKo: "",
        nameZh: "",
        nameJa: "",
        type: "",
        kitchenID: "",
        description: "",
      };
      this.errors = {
        categoryCode: "",
        categoryName: "",
        type: "",
      };
      this.showAllErrors = false;

      // Fetch types if empty
      if (this.typeStore.types.length === 0) {
        await this.typeStore.fetchTypes();
      }
    },

    /**
     * Validate trường cụ thể
     */
    validateField(field) {
      this.errors[field] = "";
      if (field === "categoryCode" && !this.formData.categoryCode) {
        this.errors.categoryCode = "Mã nhóm không được để trống.";
      }
      if (field === "categoryName" && !this.formData.categoryName) {
        this.errors.categoryName = "Tên nhóm không được để trống.";
      }
      if (field === "type" && !this.formData.type) {
        this.errors.type = "Thuộc loại không được để trống.";
      }
    },

    /**
     * Validate toàn bộ form
     */
    validateAll() {
      this.validateField("categoryCode");
      this.validateField("categoryName");
      this.validateField("type");
      return (
        !this.errors.categoryCode &&
        !this.errors.categoryName &&
        !this.errors.type
      );
    },

    /**
     * Ghi đè hàm submit dữ liệu
     */
    async submit() {
      try {
        const payload = {
          inventoryItemTypeID: this.formData.type,
          kitchenID: this.formData.kitchenID,
          categoryCode: this.formData.categoryCode,
          categoryName: this.formData.categoryName,
        };
        await this.categoryStore.addCategory(payload);
        toast.success("Thêm nhóm thực đơn thành công!");
        this.$emit("saved", payload);
        this.close();
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lưu.");
      }
    },
  },
});
</script>

<style scoped lang="scss">
.ms-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ms-dialog {
  background: #fff;
  border-radius: 8px;
  width: 500px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.ms-dialog__header {
  height: 56px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;

  .ms-dialog__title {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
    color: #1f1f1f;
  }

  .ms-dialog__close {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 32px;
    height: 32px;

    &:hover {
      background: #f0f0f0;
    }
  }
}

.ms-dialog__content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dialog-field-row {
  display: flex;
  align-items: center;
  gap: 16px;

  &.align-start {
    align-items: flex-start;
  }

  .dialog-label {
    width: 120px;
    font-size: 13px;
    color: #333;
    flex-shrink: 0;

    .required {
      color: red;
    }
  }

  .dialog-control {
    flex: 1;

    .dialog-textarea {
      width: 100%;
      height: 80px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      padding: 8px 12px;
      outline: none;
      resize: none;
      font-family: inherit;

      &:focus {
        border-color: #2b78ff;
      }
    }
  }
}

.ms-dialog__footer {
  height: 56px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e0e0e0;
  background: #f9f9f9;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;

  :deep(.ms-button) {
    border-radius: 8px !important;
  }
}
</style>
