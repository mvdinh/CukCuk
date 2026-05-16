<template>
  <div class="ms-dialog-overlay" v-if="modelValue">
    <div class="ms-dialog category-dialog">
      <div class="ms-dialog__header ms-dialog__header--blue">
        <h3 class="ms-dialog__title">Thêm Nhóm thực đơn</h3>
        <div class="ms-dialog__close" @click="close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div class="ms-dialog__content">
        <!-- Mã nhóm -->
        <div class="dialog-field-row">
          <label class="dialog-label">Mã nhóm <span class="required">(*)</span></label>
          <div class="dialog-control">
            <MsInput v-model="formData.categoryCode" :error="errors.categoryCode" :showAllErrors="showAllErrors" @blur="validateField('categoryCode')" />
          </div>
        </div>

        <!-- Tên nhóm -->
        <div class="dialog-field-row">
          <label class="dialog-label">Tên nhóm <span class="required">(*)</span></label>
          <div class="dialog-control">
            <MsInput v-model="formData.categoryName" :error="errors.categoryName" :showAllErrors="showAllErrors" @blur="validateField('categoryName')" />
          </div>
        </div>

        <!-- Tiếng Anh -->
        <div class="dialog-field-row">
          <label class="dialog-label">Tên nhóm Tiếng Anh</label>
          <div class="dialog-control">
            <MsInput v-model="formData.nameEn" />
          </div>
        </div>

        <!-- Tiếng Hàn -->
        <div class="dialog-field-row">
          <label class="dialog-label">Tên nhóm Tiếng Hàn</label>
          <div class="dialog-control">
            <MsInput v-model="formData.nameKo" />
          </div>
        </div>

        <!-- Tiếng Trung -->
        <div class="dialog-field-row">
          <label class="dialog-label">Tên nhóm Tiếng Trung</label>
          <div class="dialog-control">
            <MsInput v-model="formData.nameZh" />
          </div>
        </div>

        <!-- Tiếng Nhật -->
        <div class="dialog-field-row">
          <label class="dialog-label">Tên nhóm Tiếng Nhật</label>
          <div class="dialog-control">
            <MsInput v-model="formData.nameJa" />
          </div>
        </div>

        <!-- Thuộc loại -->
        <div class="dialog-field-row">
          <label class="dialog-label">Thuộc loại <span class="required">(*)</span></label>
          <div class="dialog-control">
            <MsSelect v-model="formData.type" :options="typeOptions" :error="errors.type" :showAllErrors="showAllErrors" @blur="validateField('type')" />
          </div>
        </div>

        <!-- Chế biến tại -->
        <div class="dialog-field-row">
          <label class="dialog-label">Chế biến tại</label>
          <div class="dialog-control flex-row">
            <MsSelect v-model="formData.kitchenID" :options="kitchenOptions" class="flex-1" />
            <button class="btn-icon-add">+</button>
          </div>
        </div>

        <!-- Diễn giải -->
        <div class="dialog-field-row align-start">
          <label class="dialog-label">Diễn giải</label>
          <div class="dialog-control">
            <textarea class="dialog-textarea" v-model="formData.description"></textarea>
          </div>
        </div>
      </div>

      <div class="ms-dialog__footer split-footer">
        <div class="footer-left">
          <button class="btn btn-help">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 4px;">
              <circle cx="12" cy="12" r="10" stroke="#2680eb" stroke-width="2"/>
              <path d="M12 16V16.01M12 8C12 8 15 8 15 11C15 13 12 14 12 14" stroke="#2680eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Giúp
          </button>
        </div>
        <div class="footer-right">
          <button class="btn btn-primary" @click="save">Cất</button>
          <button class="btn btn-secondary" @click="close">Hủy bỏ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsSelect from "../../components/ms-select/MsSelect.vue";
import { useCategoryStore } from "../../stores/categoryStore";
import { useKitchenStore } from "../../stores/kitchenStore";
import { toast } from "../../utils/toast";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue", "saved"]);

const categoryStore = useCategoryStore();
const kitchenStore = useKitchenStore();

const typeOptions = [
  { value: 1, label: "Món ăn" },
  { value: 2, label: "Đồ uống" },
  { value: 3, label: "Khác" }
];

const kitchenOptions = computed(() => {
  return kitchenStore.kitchens.map(k => ({ value: k.kitchenID, label: k.kitchenName }));
});

const formData = ref({
  categoryCode: "",
  categoryName: "",
  nameEn: "",
  nameKo: "",
  nameZh: "",
  nameJa: "",
  type: 1,
  kitchenID: "",
  description: ""
});

const errors = ref({
  categoryCode: "",
  categoryName: "",
  type: ""
});

const showAllErrors = ref(false);

watch(() => props.modelValue, (val) => {
  if (val) {
    formData.value = {
      categoryCode: `CAT-${Date.now()}`,
      categoryName: "",
      nameEn: "",
      nameKo: "",
      nameZh: "",
      nameJa: "",
      type: 1,
      kitchenID: "",
      description: ""
    };
    errors.value = { categoryCode: "", categoryName: "", type: "" };
    showAllErrors.value = false;
  }
});

const close = () => {
  emit("update:modelValue", false);
};

const validateField = (field) => {
  errors.value[field] = "";
  if (field === "categoryCode" && !formData.value.categoryCode) {
    errors.value.categoryCode = "Mã nhóm không được để trống.";
  }
  if (field === "categoryName" && !formData.value.categoryName) {
    errors.value.categoryName = "Tên nhóm không được để trống.";
  }
  if (field === "type" && !formData.value.type) {
    errors.value.type = "Thuộc loại không được để trống.";
  }
};

const validateAll = () => {
  validateField("categoryCode");
  validateField("categoryName");
  validateField("type");
  return !errors.value.categoryCode && !errors.value.categoryName && !errors.value.type;
};

const save = async () => {
  showAllErrors.value = true;
  if (!validateAll()) return;
  try {
    // In actual implementation, we might send more fields.
    // For now, based on previous categoryStore structure, it takes the name and generates code.
    await categoryStore.addCategory(formData.value.categoryName);
    toast.success("Thêm nhóm thực đơn thành công!");
    emit("saved", formData.value.categoryName);
    close();
  } catch (error) {
    toast.error("Có lỗi xảy ra khi lưu.");
  }
};
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
  border-radius: 4px;
  width: 550px;
  max-width: 95vw;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.ms-dialog__header {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &--blue {
    background-color: #2680eb;
    color: #fff;
  }

  .ms-dialog__title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: inherit;
  }

  .ms-dialog__close {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 28px;
    height: 28px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.ms-dialog__content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog-field-row {
  display: flex;
  align-items: center;
  gap: 16px;

  &.align-start {
    align-items: flex-start;
  }

  .dialog-label {
    width: 150px;
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
      height: 60px;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      padding: 8px 12px;
      outline: none;
      resize: none;
      font-family: inherit;

      &:focus {
        border-color: #2680eb;
      }
    }
    
    &.flex-row {
      display: flex;
      gap: 8px;
      align-items: center;
      
      .flex-1 {
        flex: 1;
      }
      
      .btn-icon-add {
        width: 36px;
        height: 36px;
        border: 1px solid #d0d0d0;
        background: #fff;
        border-radius: 4px;
        font-size: 20px;
        cursor: pointer;
        color: #2680eb;
        
        &:hover {
          background: #f0f4ff;
        }
      }
    }
  }
}

.ms-dialog__footer {
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background: #f9f9f9;
  border-top: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;

  &.split-footer {
    justify-content: space-between;
  }

  .footer-right {
    display: flex;
    gap: 8px;
  }

  .btn {
    height: 32px;
    padding: 0 16px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-help {
    background: transparent;
    border: none;
    color: #2680eb;
    padding: 0;
  }

  .btn-secondary {
    background: #fff;
    border-color: #d0d0d0;
    color: #333;
    
    &:hover {
      background: #f0f0f0;
    }
  }

  .btn-primary {
    background: #2680eb;
    color: #fff;

    &:hover {
      background: #1a6bd4;
    }
  }
}
</style>
