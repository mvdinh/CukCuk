<template>
  <div class="ms-input" :class="{ 'ms-input--search': isSearch }">
    <label v-if="labelFor" class="ms-input__label"
      >{{ labelFor
      }}<span v-if="required" class="ms-input__required"> *</span></label
    >

    <div class="ms-input__wrapper">
      <div v-if="isSearch" class="ms-input__icon-search" :class="searchIcon">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 14L10 10M2 6.66667C2 7.2795 2.12071 7.88634 2.35523 8.45252C2.58975 9.01871 2.93349 9.53316 3.36683 9.9665C3.80018 10.3998 4.31462 10.7436 4.88081 10.9781C5.447 11.2126 6.05383 11.3333 6.66667 11.3333C7.2795 11.3333 7.88634 11.2126 8.45252 10.9781C9.01871 10.7436 9.53316 10.3998 9.9665 9.9665C10.3998 9.53316 10.7436 9.01871 10.9781 8.45252C11.2126 7.88634 11.3333 7.2795 11.3333 6.66667C11.3333 6.05383 11.2126 5.447 10.9781 4.88081C10.7436 4.31462 10.3998 3.80018 9.9665 3.36683C9.53316 2.93349 9.01871 2.58975 8.45252 2.35523C7.88634 2.12071 7.2795 2 6.66667 2C6.05383 2 5.447 2.12071 4.88081 2.35523C4.31462 2.58975 3.80018 2.93349 3.36683 3.36683C2.93349 3.80018 2.58975 4.31462 2.35523 4.88081C2.12071 5.447 2 6.05383 2 6.66667Z"
            stroke="#717680"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        class="ms-input__field"
        :class="{ 'input--error': showError }"
      />

      <div
        v-if="showError"
        class="ms-input__icon-error"
        :title="errorMessages[0]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#ff4d4f" />
          <path
            d="M12 7V13M12 17H12.01"
            stroke="#fff"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <div v-if="!isSearch && showError" class="ms-input__error-tooltip">
      <div class="tooltip-arrow"></div>
      <div class="tooltip-content">
        <span v-for="(msg, index) in errorMessages" :key="index">
          {{ msg }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: [String, Number],
  labelFor: String,
  placeholder: String,
  type: { type: String, default: "text" },
  error: [String, Array],
  isSearch: { type: Boolean, default: false },
  searchIcon: { type: String, default: "" },
  showAllErrors: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
});

const emit = defineEmits(["update:modelValue"]);

const isTouched = ref(false);

/**
 * Xử lý khi focus vào input
 */
const handleFocus = () => {};

/**
 * Xử lý khi blur khỏi input (click ra ngoài)
 */
const handleBlur = () => {
  isTouched.value = true;
};

/**
 * Xử lý khi người dùng đang nhập
 */
const handleInput = (event) => {
  emit("update:modelValue", event.target.value);
  // Bật isTouched để báo lỗi ngay lập tức trong quá trình gõ
  isTouched.value = true;
};

/**
 * Kiểm tra xem có lỗi hay không
 */
const hasError = computed(() => {
  if (!props.error) return false;
  return Array.isArray(props.error) ? props.error.length > 0 : !!props.error;
});

/**
 * Điều kiện hiển thị lỗi: form đã submit HOẶC trường này đã được touch
 */
const showError = computed(() => {
  if (!hasError.value) return false;
  if (props.showAllErrors) return true;
  return isTouched.value;
});

/**
 * Trả về danh sách chuỗi lỗi
 */
const errorMessages = computed(() => {
  if (!props.error) return [];
  return Array.isArray(props.error) ? props.error : [props.error];
});
</script>

<style lang="scss">
.ms-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;

  &__label {
    font-size: 13px;
    font-weight: 600;
    color: #333;
  }

  &__required {
    color: #ff4d4f;
    font-weight: 600;
  }

  &__wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__field {
    width: 100%;
    padding: 0 12px;
    border: none;
    outline: none;

    &.input--error {
      padding-right: 36px;
    }
  }

  &__icon-error {
    position: absolute;
    right: 8px;
    display: flex;
    align-items: center;
    cursor: help;
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

  &__counter {
    font-size: 11px;
    color: #888;
    text-align: right;
  }

  &__error-list {
    margin: 4px 0 0 0;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__error-msg {
    color: #ff4d4f;
    font-size: 11px;
    font-weight: 500;
    list-style-type: none;
  }

  &:not(.ms-input--search) {
    .ms-input__wrapper {
      border: none;
    }

    .ms-input__field {
      height: 36px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;

      &:focus {
        border-color: #2680eb;
      }

      &.input--error {
        border-color: #ff4d4f;
        padding-right: 36px;
      }
    }
  }

  &--search {
    .ms-input__field {
      padding-left: 36px;
      padding-right: 12px;
      border-radius: 4px;
      width: 100%;
      border: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ms-input__icon-search {
      position: absolute;
      left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
