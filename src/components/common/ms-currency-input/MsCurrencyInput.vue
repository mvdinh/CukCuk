<template>
  <div class="ms-currency-input">
    <label v-if="labelFor" class="ms-currency-input__label">
      {{ labelFor }}
      <span v-if="required" class="ms-currency-input__required"> *</span>
    </label>

    <div class="ms-currency-input__wrapper" :class="{ 'wrapper--error': error }">
      <input
        ref="inputRef"
        type="text"
        class="ms-currency-input__field"
        :placeholder="placeholder"
        :value="displayValue"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
      />
      <span class="ms-currency-input__suffix">đ</span>
    </div>

    <!-- ERROR TOOLTIP -->
    <div v-if="error" class="ms-currency-input__error-tooltip">
      <div class="tooltip-arrow"></div>
      <div class="tooltip-content">
        <span>{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: null,
  },
  labelFor: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "0",
  },
  required: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "blur", "focus"]);

const inputRef = ref(null);

const formatNumber = (val) => {
  if (val === null || val === undefined || val === "") return "";
  const numStr = String(val).replace(/[^0-9]/g, "");
  if (!numStr) return "";
  return Number(numStr).toLocaleString("en-US");
};

const parseNumber = (valStr) => {
  if (!valStr) return null;
  const cleaned = valStr.replace(/,/g, "");
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? null : num;
};

const displayValue = computed(() => {
  return formatNumber(props.modelValue);
});

const onInput = (event) => {
  const inputEl = event.target;
  const originalValue = inputEl.value;

  const cursorPosition = inputEl.selectionStart;
  const commasBefore = (originalValue.substring(0, cursorPosition).match(/,/g) || []).length;

  const rawNum = parseNumber(originalValue);
  emit("update:modelValue", rawNum);

  const formatted = formatNumber(rawNum);

  setTimeout(() => {
    if (!inputEl) return;
    inputEl.value = formatted;

    const commasAfter = (formatted.substring(0, cursorPosition).match(/,/g) || []).length;
    const diff = commasAfter - commasBefore;
    let newCursorPosition = cursorPosition + diff;

    newCursorPosition = Math.max(0, Math.min(newCursorPosition, formatted.length));
    inputEl.setSelectionRange(newCursorPosition, newCursorPosition);
  }, 0);
};

const onBlur = (event) => {
  emit("blur", event);
};

const onFocus = (event) => {
  emit("focus", event);
};
</script>

<style scoped lang="scss">
.ms-currency-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  width: 100%;

  &__label {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    user-select: none;
  }

  &__required {
    color: #ff4d4f;
    font-weight: 700;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
    height: 32px;
    padding: 0 12px;
    transition: all 0.2s ease-in-out;

    &:focus-within {
      border-color: #2680eb;
    }

    &.wrapper--error {
      border-color: #ff4d4f;
    }
  }

  &__field {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    text-align: right;
    padding-right: 8px;
    color: #1f1f1f;
    background: transparent;
    font-weight: 500;
    width: 100%;

    &::placeholder {
      color: #b0b0b0;
    }
  }

  &__suffix {
    font-size: 14px;
    color: #717680;
    font-weight: 600;
    user-select: none;
  }

  &__error-tooltip {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
    pointer-events: none;

    .tooltip-arrow {
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #ff4d4f;
      margin: 0 auto;
    }

    .tooltip-content {
      background: #ff4d4f;
      color: #fff;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }
  }
}
</style>
