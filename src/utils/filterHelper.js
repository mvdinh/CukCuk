/**
 * Tạo một đối tượng Filter chuẩn để gửi lên API Backend
 * @param {string} property - Tên trường cần lọc (VD: 'candidateName', 'gender')
 * @param {any} value - Giá trị lọc
 * @param {string} dataType - Kiểu dữ liệu ('string', 'number', 'date', 'boolean')
 * @param {string} operator - Toán tử (VD: '=', '>', '<', 'LIKE')
 * @returns {Object|null} - Trả về object filter hoặc null nếu không có giá trị
 */
export function buildFilterItem(property, value, dataType = "string", operator = "=") {
  // Bỏ qua nếu giá trị rỗng, null hoặc undefined
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return {
    property: property,
    value: String(value),
    dataType: dataType,
    operator: operator,
  };
}

/**
 * Hàm hỗ trợ gộp nhiều items thành một mảng filters hợp lệ (loại bỏ null)
 * @param {Array} items - Danh sách các đối tượng filter (có thể chứa null)
 * @returns {Array} - Danh sách filter đã lọc null
 */
export function buildFiltersArray(items) {
  return items.filter(item => item !== null);
}
