import { defineComponent } from "vue";
import { validateSchema, createEmptyErrors } from "../validators/validate";

export default defineComponent({
  props: {
    selectedRecord: {
      type: Object,
      default: () => ({}),
    },
  },

  emits: ["close", "save"],

  data() {
    return {
      formData: {},
      validationErrors: {},
      hasSubmitted: false,
      loading: false,
    };
  },

  watch: {
    selectedRecord: {
      immediate: true,
      handler(newVal) {
        this.syncFormData(newVal);
      },
    },
    // Theo dõi sự thay đổi của formData để validate real-time
    formData: {
      deep: true,
      handler() {
        this.validate();
      },
    },
  },

  methods: {
    syncFormData(record) {
      const formattedRecord = { ...record };
      
      // Chuẩn hóa định dạng chuỗi ngày tháng từ API (VD: 2000-12-31T00:00:00 -> 2000-12-31) để thẻ input type="date" nhận đúng
      for (const key in formattedRecord) {
        if (typeof formattedRecord[key] === 'string' && formattedRecord[key].includes('T')) {
          const dateTest = new Date(formattedRecord[key]);
          if (!isNaN(dateTest.getTime())) {
            formattedRecord[key] = formattedRecord[key].split('T')[0];
          }
        }
      }

      this.formData = formattedRecord;
      this.validationErrors = createEmptyErrors(this.schema || {});
      this.hasSubmitted = false;
    },

    async validate() {
      const { errors, isValid } = validateSchema(this.formData, this.schema);
      this.validationErrors = errors;
      return isValid;
    },

    async onSubmit() {
      this.hasSubmitted = true;

      const isValid = await this.validate();
      if (!isValid) return;

      this.$emit("save", { ...this.formData });
    },

    handleClose() {
      this.$emit("close");
    },
  },
});
