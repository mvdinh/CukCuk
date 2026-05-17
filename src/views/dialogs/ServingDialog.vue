<template>
  <div class="ms-dialog-overlay" v-if="modelValue">
    <div class="ms-dialog serving-dialog">
      <div class="ms-dialog__header">
        <h3 class="ms-dialog__title">Thêm Sở thích phục vụ</h3>
        <div class="ms-dialog__close" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      
      <div class="ms-dialog__content">
        <div class="dialog-field-row">
          <label class="dialog-label">Sở thích phục vụ <span class="required">*</span></label>
          <div class="dialog-control">
            <MsInput v-model="formData.name" :error="errors.name" @blur="validateField('name')" />
          </div>
        </div>
        <div class="dialog-field-row">
          <label class="dialog-label">Thu thêm</label>
          <div class="dialog-control">
            <MsInput type="number" v-model="formData.price" />
          </div>
        </div>
        <div class="dialog-field-row align-start">
          <label class="dialog-label">Diễn giải</label>
          <div class="dialog-control">
            <textarea class="dialog-textarea" v-model="formData.description" placeholder="Nhập diễn giải..."></textarea>
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

<script setup>
import { ref, watch } from "vue";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsButton from "../../components/ms-button/MsButton.vue";
import { useServingStore } from "../../stores/servingStore";
import { toast } from "../../utils/toast";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue", "saved"]);

const servingStore = useServingStore();

const formData = ref({
  name: "",
  price: 0,
  description: ""
});

const errors = ref({
  name: ""
});

watch(() => props.modelValue, (val) => {
  if (val) {
    formData.value = { name: "", price: 0, description: "" };
    errors.value = { name: "" };
  }
});

const close = () => {
  emit("update:modelValue", false);
};

const validateField = (field) => {
  errors.value[field] = "";
  if (field === "name" && !formData.value.name) {
    errors.value.name = "Sở thích phục vụ không được để trống.";
  }
};

const validateAll = () => {
  validateField("name");
  return !errors.value.name;
};

const save = async () => {
  if (!validateAll()) return;
  try {
    const payload = {
      additionName: formData.value.name,
      extraPrice: Number(formData.value.price) || 0,
      description: formData.value.description
    };
    
    const newPref = await servingStore.addPreference(payload);
    if (newPref) {
      emit("saved", newPref);
      toast.success("Thêm sở thích phục vụ thành công!");
      close();
    } else {
      toast.error("Có lỗi xảy ra khi lưu.");
    }
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
