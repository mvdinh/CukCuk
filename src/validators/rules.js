export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const REGEX_PHONE =
  /^(0|\+84)(3[2-9]|5[6-9]|7[0-9]|8[0-9]|9[0-9])[0-9]{7}$/;
export const REGEX_HAS_UPPERCASE = /[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐƠƯ]/u;

/**
 * Bắt buộc không được để trống
 */
export function required(fieldLabel, customMessage) {
  return (value) => {
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === "string" && !value.trim());

    if (!isEmpty) return "";
    if (customMessage) return customMessage;
    if (fieldLabel) return `${fieldLabel} không được để trống`;
    return "Trường này là bắt buộc";
  };
}

/**
 * Độ dài tối thiểu
 */
export function minLength(min, customMessage) {
  return (value) => {
    if (!value) return "";
    if (String(value).trim().length < min) {
      return customMessage ?? `Tối thiểu ${min} ký tự`;
    }
    return "";
  };
}

/**
 * Độ dài tối đa
 */
export function maxLength(max, customMessage) {
  return (value) => {
    if (!value) return "";
    if (String(value).trim().length > max) {
      return customMessage ?? `Tối đa ${max} ký tự`;
    }
    return "";
  };
}

/**
 * Định dạng email
 */
export function email(customMessage) {
  return (value) => {
    if (!value || !String(value).trim()) return "";
    if (!REGEX_EMAIL.test(String(value).trim())) {
      return customMessage ?? "Email không đúng định dạng";
    }
    return "";
  };
}

/**
 * Số điện thoại Việt Nam
 */
export function phone(customMessage) {
  return (value) => {
    if (!value || !String(value).trim()) return "";
    if (!REGEX_PHONE.test(String(value).trim())) {
      return customMessage ?? "Số điện thoại không hợp lệ";
    }
    return "";
  };
}

/**
 * Phải có ít nhất một chữ hoa
 */
export function hasUppercase() {
  return (value) => {
    if (!value) return "";
    if (!REGEX_HAS_UPPERCASE.test(String(value))) {
      return "Phải có ít nhất một chữ viết hoa";
    }
    return "";
  };
}

/**
 * Khoảng giá trị số hợp lệ
 */
export function numberRange(min, max, customMessage) {
  return (value) => {
    if (value === "" || value === null || value === undefined) return "";
    const numberValue = Number(value);
    if (isNaN(numberValue)) return "Vui lòng nhập số";
    if (numberValue < min)
      return customMessage ?? `Giá trị tối thiểu là ${min}`;
    if (numberValue > max) return customMessage ?? `Giá trị tối đa là ${max}`;
    return "";
  };
}

/**
 * Ngày không được trong tương lai (Không được chọn quá ngày hôm nay)
 */
export function pastDate(customMessage) {
  return (value) => {
    if (!value) return "";
    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (inputDate > today) {
      return customMessage ?? "Ngày không được lớn hơn ngày hiện tại";
    }
    return "";
  };
}

/**
 * Regex tùy chỉnh
 */
export function pattern(regex, customMessage) {
  return (value) => {
    if (!value || !String(value).trim()) return "";
    if (!regex.test(String(value).trim())) {
      return customMessage ?? "Giá trị không hợp lệ";
    }
    return "";
  };
}
