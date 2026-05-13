<template>
  <div class="ms-input" :class="{ 'ms-input--search': isSearch }">
    <label v-if="labelFor" class="ms-input__label"
      >{{ labelFor
      }}<span v-if="required" class="ms-input__required"> *</span></label
    >

    <div class="ms-input__wrapper">
      <div
        v-if="isSearch"
        class="ms-input__icon-search"
        :class="searchIcon"
      ></div>

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
    </div>

    <ul v-if="!isSearch && showError" class="ms-input__error-list">
      <li
        v-for="(msg, index) in errorMessages"
        :key="index"
        class="ms-input__error-msg"
      >
        {{ msg }}
      </li>
    </ul>
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
const handleFocus = () => {
};

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

<style lang="scss" scoped>
.ms-input {
  display: flex;
  flex-direction: column;
  gap: 4px;

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
    height: 36px;
    padding: 0 12px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    outline: none;

    &:focus {
      border-color: #2680eb;
    }
    &.input--error {
      border-color: #ff4d4f;
    }
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

  &--search {
    .ms-input__field {
      padding-left: 36px;
      padding-right: 50px;
      border-radius: 4px;
      width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ms-input__icon-search {
      position: absolute;
      left: 10px;
    }
  }
}
</style>
