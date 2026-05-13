<template>
  <div class="form" id="formContent">
    <div class="form__bg" id="form__bg" @click="handleClose"></div>

    <div class="form__container">
      <div class="form__header">
        <div class="form__header__title">
          {{ selectedRecord?.candidateID ? "Sửa ứng viên" : "Thêm ứng viên" }}
        </div>
        <div
          class="btn__close"
          @click="handleClose"
          style="cursor: pointer"
        ></div>
      </div>

      <form id="candidateForm" @submit.prevent="onSubmit" class="form__layout">
        <div class="form__content">
          <div class="form__content__header">
            <div class="form__content__header__title">
              Kéo thả hoặc bấm vào đây để tải CV lên
            </div>
            <div class="form__content__header__note">
              Chấp nhận file .doc, .docx,.jpg, .jpeg, .png (Dung lượng nhỏ hơn
              15Mb)
            </div>
            <input
              type="file"
              id="fileInput"
              accept=".doc,.docx,.jpg,.jpeg,.png"
              style="display: none"
            />
          </div>

          <div class="form__content__body">
            <div class="form__content__body__left">
              <div
                class="avatar"
                @click="triggerAvatarUpload"
                style="cursor: pointer"
              >
                <img
                  v-if="previewAvatar || formData.urlAvatar"
                  :src="previewAvatar || formData.urlAvatar"
                  alt="Avatar"
                  class="avatar-img"
                />
                <span v-else>{{ candidateInitial }}</span>
              </div>
              <input
                type="file"
                ref="avatarInput"
                @change="handleAvatarChange"
                accept="image/*"
                style="display: none"
              />
            </div>

            <div class="form__content__body__right">
              <template v-for="(row, rowIndex) in formRows" :key="rowIndex">
                <template v-if="row.type === 'section'">
                  <div class="form__section-title">{{ row.label }}</div>
                </template>

                <template v-else-if="row.type === 'divider'">
                  <div class="form__divider"></div>
                </template>

                <template v-else-if="row.isDouble">
                  <div class="item__double">
                    <div
                      v-for="(field, fIndex) in row.fields"
                      :key="fIndex"
                      class="form__content__body__right__item"
                    >
                      <MsInput
                        v-if="field.type === 'text'"
                        :labelFor="field.label"
                        v-model="formData[field.field]"
                        :error="validationErrors[field.field]"
                        :showAllErrors="hasSubmitted"
                        :placeholder="field.placeholder"
                        :required="field.required"
                      />

                      <MsInput
                        v-else-if="field.type === 'date'"
                        :labelFor="field.label"
                        v-model="formData[field.field]"
                        :error="validationErrors[field.field]"
                        :showAllErrors="hasSubmitted"
                        :placeholder="field.placeholder"
                        :type="field.mode === 'month' ? 'month' : 'date'"
                        :required="field.required"
                      />

                      <MsSelect
                        v-else-if="field.type === 'select'"
                        :label="field.label"
                        v-model="formData[field.field]"
                        :options="getOptions(field.options)"
                        :placeholder="field.placeholder"
                        :required="field.required"
                      />

                      <MsSelect
                        v-else-if="field.type === 'select-add'"
                        :label="field.label"
                        v-model="formData[field.field]"
                        :options="getOptions(field.options)"
                        :placeholder="field.placeholder"
                        :required="field.required"
                        :allowAdd="true"
                      />

                      <div
                        v-else-if="field.type === 'textarea'"
                        class="ms-textarea-wrap"
                      >
                        <label class="ms-input__label">{{ field.label }}</label>
                        <textarea
                          class="ms-textarea"
                          v-model="formData[field.field]"
                          :placeholder="field.placeholder"
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div class="form__content__body__right__item">
                    <MsInput
                      v-if="row.type === 'text'"
                      :labelFor="row.label"
                      v-model="formData[row.field]"
                      :error="validationErrors[row.field]"
                      :showAllErrors="hasSubmitted"
                      :placeholder="row.placeholder"
                      :required="row.required"
                    />

                    <MsInput
                      v-else-if="row.type === 'date'"
                      :labelFor="row.label"
                      v-model="formData[row.field]"
                      :error="validationErrors[row.field]"
                      :showAllErrors="hasSubmitted"
                      :placeholder="row.placeholder"
                      :type="row.mode === 'month' ? 'month' : 'date'"
                      :required="row.required"
                    />

                    <MsSelect
                      v-else-if="row.type === 'select'"
                      :label="row.label"
                      v-model="formData[row.field]"
                      :options="getOptions(row.options)"
                      :placeholder="row.placeholder"
                      :required="row.required"
                    />

                    <MsSelect
                      v-else-if="row.type === 'select-add'"
                      :label="row.label"
                      v-model="formData[row.field]"
                      :options="getOptions(row.options)"
                      :placeholder="row.placeholder"
                      :required="row.required"
                      :allowAdd="true"
                    />

                    <div
                      v-else-if="row.type === 'textarea'"
                      class="ms-textarea-wrap"
                    >
                      <label class="ms-input__label">{{ row.label }}</label>
                      <textarea
                        class="ms-textarea"
                        v-model="formData[row.field]"
                        :placeholder="row.placeholder"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>

        <div class="form__footer">
          <button type="button" class="btn btn__cancel" @click="handleClose">
            Hủy
          </button>
          <button type="submit" class="btn btn__save">Lưu</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive } from "vue";
import BaseForm from "../../base/BaseForm";
import MsInput from "../../components/ms-input/MsInput.vue";
import MsSelect from "../../components/ms-select/MsSelect.vue";
import { candidateFields, options } from "../../assets/data/candidate";
import {
  required,
  email,
  phone,
  pastDate,
  minLength,
  hasUppercase,
} from "../../validators/rules";

const allOptions = reactive({
  ...options,
  cityOptions: [],
  districtOptions: [],
});

export default defineComponent({
  name: "CandidateForm",

  components: { MsInput, MsSelect },

  extends: BaseForm,

  props: {
    selectedRecord: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    candidateInitial() {
      const name = this.formData.candidateName || "";
      if (!name.trim()) return "A";
      const parts = name.trim().split(" ");
      return parts[parts.length - 1].charAt(0).toUpperCase();
    },

    /**
     * Xử lý candidateFormFields thành các dòng (rows) để render
     * - fullWidth: 1 field trên 1 dòng
     * - halfWidth: gom 2 field halfWidth liên tiếp thành 1 dòng (isDouble: true)
     * - section / divider: giữ nguyên
     */
    formRows() {
      const rows = [];
      let i = 0;

      while (i < candidateFields.length) {
        const field = candidateFields[i];

        if (field.type === "section" || field.type === "divider") {
          rows.push(field);
          i++;
          continue;
        }

        if (field.halfWidth) {
          const next = candidateFields[i + 1];
          if (
            next &&
            next.halfWidth &&
            next.type !== "section" &&
            next.type !== "divider"
          ) {
            rows.push({ isDouble: true, fields: [field, next] });
            i += 2;
          } else {
            rows.push(field);
            i++;
          }
          continue;
        }

        rows.push(field);
        i++;
      }

      return rows;
    },
  },

  data() {
    return {
      schema: {
        candidateName: [required("Họ và tên"), minLength(5), hasUppercase()],
        phoneNumber: [required("Số điện thoại"), phone()],
        email: [required("Email"), email("Email không đúng định dạng")],
        dateOfBirth: [pastDate("Ngày không được vượt quá hôm nay")],
        gender: [required("Giới tính")],
      },
      provincesData: [], // Lưu trữ danh sách tỉnh/thành gốc
      previewAvatar: null, // Lưu link ảnh tạm để xem trước khi chọn
      selectedFileBase64: null,
      selectedFileName: null,
    };
  },

  watch: {
    "formData.city": function (newCityCode) {
      this.fetchDistricts(newCityCode);
    },
  },

  mounted() {
    this.fetchProvinces();
  },

  methods: {
    /**
     * Lấy options từ allOptions theo tên key
     */
    getOptions(optionsKey) {
      if (!optionsKey) return [];
      return allOptions[optionsKey] || [];
    },

    triggerAvatarUpload() {
      this.$refs.avatarInput.click();
    },

    handleAvatarChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.previewAvatar = URL.createObjectURL(file);
        this.formData.urlAvatar = `/uploads/${file.name}`;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedFileBase64 = e.target.result;
          this.selectedFileName = file.name;
        };
        reader.readAsDataURL(file);
      }
    },

    async fetchProvinces() {
      try {
        const res = await fetch("https://provinces.open-api.vn/api/?depth=2");
        const data = await res.json();
        this.provincesData = data;
        allOptions.cityOptions = data.map((p) => ({
          value: p.name,
          label: p.name,
        }));
      } catch (err) {
        console.error("Lỗi lấy danh sách tỉnh thành", err);
      }
    },

    fetchDistricts(cityName) {
      if (!cityName) {
        allOptions.districtOptions = [];
        this.formData.district = null;
        return;
      }

      const province = this.provincesData.find((p) => p.name === cityName);
      if (province && province.districts) {
        allOptions.districtOptions = province.districts.map((d) => ({
          value: d.name, // Lưu tên trực tiếp
          label: d.name,
        }));
      } else {
        allOptions.districtOptions = [];
      }
      const districtExists = allOptions.districtOptions.find(
        (d) => d.value === this.formData.district,
      );
      if (!districtExists) {
        this.formData.district = null;
      }
    },
  },
});
</script>

<style scoped>
@import url("../../assets/styles/form.css");

.form__layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* Section title */
.form__section-title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  color: #333;
  padding: 20px 0 8px;
  letter-spacing: 0.5px;
}

/* Divider */
.form__divider {
  border-top: 1px solid #e0e0e0;
  margin: 16px 0;
}

/* Textarea */
.ms-textarea-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ms-textarea-wrap .ms-input__label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.ms-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.ms-textarea:focus {
  border-color: #2680eb;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #757575;
  overflow: hidden;
  border: 2px solid #ccc;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
