<template>
  <div class="ms-select">
    <!-- LABEL -->
    <label v-if="label" class="ms-select__label">
      {{ label }}

      <span v-if="required" class="ms-select__required"> * </span>
    </label>

    <!-- SELECT GROUP -->
    <div
      class="ms-select__group"
      :class="{
        'ms-select__group--split': allowAdd,
      }"
    >
      <!-- SELECT -->
      <select
        class="ms-select__input"
        :value="modelValue"
        @change="handleChange"
      >
        <option value="" disabled hidden>
          {{ placeholder || "Chọn giá trị" }}
        </option>

        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- ADD -->
      <button
        v-if="allowAdd"
        type="button"
        class="ms-select__add"
        @click="$emit('add')"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],

  label: String,

  placeholder: String,

  options: {
    type: Array,
    default: () => [],
  },

  required: {
    type: Boolean,
    default: false,
  },

  allowAdd: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "add"]);

const handleChange = (event) => {
  emit("update:modelValue", event.target.value);
};
</script>

<style scoped>
.ms-select {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ms-select__label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.ms-select__required {
  color: red;
}

/* ================= GROUP ================= */

.ms-select__group {
  display: flex;
  align-items: center;

  width: 100%;
}

/* có split */
.ms-select__group--split {
  border: 1px solid #d0d0d0;
  border-radius: 4px;

  overflow: hidden;
}

/* ================= SELECT ================= */

.ms-select__input {
  width: 100%;
  height: 36px;

  padding: 0 12px;

  border: 1px solid #d0d0d0;
  border-radius: 4px;

  outline: none;

  font-size: 14px;
  color: #333;

  background-color: #fff;

  cursor: pointer;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image:
    linear-gradient(45deg, transparent 50%, #666 50%),
    linear-gradient(135deg, #666 50%, transparent 50%);

  background-position:
    calc(100% - 16px) 15px,
    calc(100% - 11px) 15px;

  background-size: 5px 5px;

  background-repeat: no-repeat;
}

.ms-select__input:focus {
  border-color: #8b5cf6;
}

/* khi có nút + */
.ms-select__group--split .ms-select__input {
  border: none;
  border-radius: 0;
}

/* ================= ADD ================= */

.ms-select__add {
  width: 36px;
  min-width: 36px;
  height: 36px;

  border: none;
  border-left: 1px solid #d0d0d0;

  background-color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;
  color: #666;

  cursor: pointer;

  transition: background-color 0.2s;
}

.ms-select__add:hover {
  background-color: #f5f5f5;
}
</style>
