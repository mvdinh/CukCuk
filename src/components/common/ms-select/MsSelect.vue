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
      <div
        class="select__container"
        :class="{
          'select__container--split': allowAdd && !iconsInside,
        }"
      >
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

        <!-- Icons at the end of the input -->
        <div class="select__icons">
          <div class="select__arrow"></div>
          <MsIcon
            v-if="allowSearch"
            :webkitMaskImage="icons.table.trash"
            :size="16"
            class="icon-action"
            @click.stop="$emit('search')"
          />
          <MsIcon
            v-if="allowAdd && iconsInside"
            :webkitMaskImage="icons.form.plus"
            :size="16"
            class="icon-action icon-plus"
            @click.stop="$emit('add')"
          />
        </div>
      </div>

      <button
        v-if="allowAdd && !iconsInside"
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
import { inject } from "vue";

const icons = inject("icons");

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

  allowSearch: {
    type: Boolean,
    default: false,
  },

  iconsInside: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "add", "search"]);

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

/* có nút add */
.ms-select__group--split {
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  overflow: hidden;
}

/* ================= CONTAINER ================= */

.select__container {
  width: 100%;
  height: 32px;

  display: flex;
  align-items: center;

  /* border nằm ở container */
  border: 1px solid #d0d0d0;
  border-radius: 8px;

  background-color: #fff;

  padding: 0;
}

.select__icons {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 8px;
}

.icon-action {
  cursor: pointer;
  color: #666;
  &:hover {
    color: #2680eb;
  }
}

.icon-plus {
  color: #0072bc;
  &:hover {
    color: #005a96;
  }
}

.select__arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 5px solid #666;
  margin: 0 4px;
}

.select__container:focus-within {
  border-color: #8b5cf6;
}

/* khi có nút add: bỏ border, bỏ border-radius (group đã xử lý) */
.select__container--split {
  border: none;
  border-radius: 0;
}

/* ================= SELECT ================= */

.ms-select__input {
  width: 100%;
  height: 18px;

  padding: 0 4px 0 12px;

  /* bỏ border — container đã xử lý */
  border: none;
  outline: none;
  background: transparent;

  font-size: 14px;
  color: #333;

  cursor: pointer;
}

/* ================= ADD ================= */

.ms-select__add {
  width: 32px;
  min-width: 32px;
  height: 32px;

  border: none;
  border-left: 1px solid #d0d0d0;

  /* chỉ bo góc trên phải và dưới phải */
  border-radius: 0 8px 8px 0;

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
