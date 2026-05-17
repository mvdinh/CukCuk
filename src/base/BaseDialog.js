import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue", "saved"],

  data() {
    return {
      formData: {},
      errors: {},
      showAllErrors: false,
    };
  },

  watch: {
    modelValue(val) {
      if (val) {
        this.resetForm();
      }
    },
  },

  methods: {
    /**
     * Đóng dialog
     */
    close() {
      this.$emit("update:modelValue", false);
    },

    /**
     * Reset form data và trạng thái lỗi (Có thể ghi đè ở component con)
     */
    resetForm() {
      this.formData = {};
      this.errors = {};
      this.showAllErrors = false;
    },

    /**
     * Validate cho từng field cụ thể (Sẽ ghi đè ở component con)
     */
    validateField(field) {
      this.errors[field] = "";
    },

    /**
     * Validate toàn bộ form trước khi lưu (Sẽ ghi đè ở component con)
     */
    validateAll() {
      return true;
    },

    /**
     * Hàm lưu dữ liệu chung: Validate trước, sau đó gọi submit()
     */
    async save() {
      this.showAllErrors = true;
      if (!this.validateAll()) return;

      try {
        await this.submit();
      } catch (error) {
        console.error("Save error in BaseDialog:", error);
      }
    },

    /**
     * Xử lý gửi dữ liệu lên API hoặc Store (BẮT BUỘC ghi đè ở component con)
     */
    async submit() {
      // Overridden in child component
    },
  },
});
