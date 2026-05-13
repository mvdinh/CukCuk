
/**
 * Validate 1 field theo danh sách rules
 * → Trả về lỗi đầu tiên gặp phải (nếu có)
 *
 * @param {*} value        Giá trị của field (input)
 * @param {Function[]} rules Danh sách rule (mỗi rule là 1 function)
 * @returns {string}       Thông báo lỗi đầu tiên hoặc '' nếu hợp lệ
 */
export function validateField(value, rules = []) {
  for (const checkRule of rules) {
    const error = checkRule(value);

    // Nếu rule trả về lỗi → dừng ngay
    if (error) {
      return error;
    }
  }

  // Không có lỗi nào
  return '';
}

/**
 * Validate toàn bộ form theo schema
 *
 * @param {Object} formData  Dữ liệu form (vd: { name: 'A', age: 20 })
 * @param {Object} schema    Schema rules (vd: { name: [rule1, rule2] })
 * @returns {{
 *   errors: Object,        // { name: 'lỗi...', age: '' }
 *   isValid: boolean       // true nếu không có lỗi
 * }}
 */
export function validateSchema(formData, schema) {
  const errors = {};     // Lưu lỗi từng field
  let isValid = true;    // Mặc định là hợp lệ

  for (const fieldName in schema) {
    const value = formData[fieldName];     // giá trị user nhập
    const rules = schema[fieldName];       // rules của field đó

    // Validate từng field
    const error = validateField(value, rules);

    // Lưu lỗi
    errors[fieldName] = error;

    // Nếu có lỗi → form không hợp lệ
    if (error) {
      isValid = false;
    }
  }

  return { errors, isValid };
}

/**
 * Tạo object errors ban đầu (tất cả = '')
 * → Dùng để khởi tạo state
 *
 * @param {Object} schema
 * @returns {Object} vd: { name: '', age: '' }
 */
export function createEmptyErrors(schema) {
  return Object.keys(schema).reduce((result, fieldName) => {
    result[fieldName] = '';
    return result;
  }, {});
}

// Ví dụ: 
// const schema = {
//   name: [
//     v => !v && 'Không được để trống',
//     v => v.length < 3 && 'Tối thiểu 3 ký tự'
//   ],
//   age: [
//     v => !v && 'Bắt buộc',
//     v => v < 18 && 'Phải >= 18'
//   ]
// };

// const formData = {
//   name: 'An',
//   age: 15
// };

// const result = validateSchema(formData, schema);

// console.log(result);
// 
// {
//   errors: {
//     name: 'Tối thiểu 3 ký tự',
//     age: 'Phải >= 18'
//   },
//   isValid: false
// }
// 