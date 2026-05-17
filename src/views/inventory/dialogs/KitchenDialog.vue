<template>
  <div class="ms-dialog-overlay" v-if="modelValue">
    <div class="ms-dialog kitchen-dialog">
      <div class="ms-dialog__header">
        <h3 class="ms-dialog__title">Thêm Bếp/Nơi pha chế</h3>
        <div class="ms-dialog__close" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div class="ms-dialog__content">
        <div class="dialog-field-row">
          <label class="dialog-label">Tên <span class="required">*</span></label>
          <div class="dialog-control">
            <MsInput v-model="formData.kitchenName" :error="errors.kitchenName" :showAllErrors="showAllErrors" :maxLength="25" @blur="validateField('kitchenName')" />
          </div>
        </div>
        <div class="dialog-field-row align-start">
          <label class="dialog-label">Mô tả</label>
          <div class="dialog-control">
            <textarea class="dialog-textarea" v-model="formData.description" placeholder="Nhập mô tả..."></textarea>
          </div>
        </div>
      </div>

      <div class="ms-dialog__footer">
        <MsButton type="secondary" @click="close">Hủy</MsButton>
        <MsButton type="primary" @click="save">Lưu</MsButton>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import MsInput from "../../../components/common/ms-input/MsInput.vue";
import MsButton from "../../../components/common/ms-button/MsButton.vue";
import { useKitchenStore } from "../../../stores/kitchenStore";
import { toast } from "../../../utils/toast";
import BaseDialog from "../../../base/BaseDialog";

export default defineComponent({
  name: "KitchenDialog",

  components: {
    MsInput,
    MsButton,
  },

  extends: BaseDialog,

  setup() {
    const kitchenStore = useKitchenStore();
    return { kitchenStore };
  },

  methods: {
    /**
     * Ghi đè hàm reset form
     */
    resetForm() {
      this.formData = {
        kitchenName: "",
        description: "",
      };
      this.errors = {
        kitchenName: "",
      };
      this.showAllErrors = false;
    },

    /**
     * Validate trường cụ thể
     */
    validateField(field) {
      this.errors[field] = "";
      if (field === "kitchenName" && !this.formData.kitchenName) {
        this.errors.kitchenName = "Tên không được để trống.";
      }
    },

    /**
     * Validate toàn bộ form
     */
    validateAll() {
      this.validateField("kitchenName");
      return !this.errors.kitchenName;
    },

    /**
     * Ghi đè hàm submit dữ liệu
     */
    async submit() {
      try {
        const payload = {
          kitchenName: this.formData.kitchenName,
          description: this.formData.description,
        };
        await this.kitchenStore.addKitchen(payload);
        toast.success("Thêm Bếp/Nơi pha chế thành công!");
        this.$emit("saved", this.formData.kitchenName);
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
}
</style>
