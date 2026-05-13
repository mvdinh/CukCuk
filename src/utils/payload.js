/**
 * Chuyển chuỗi camelCase thành PascalCase
 * Ví dụ: "candidateName" -> "CandidateName"
 */
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Chuyển đổi tất cả key của object từ camelCase sang PascalCase
 * Dùng khi gửi payload lên API backend (.NET)
 * @param {Object} obj
 * @returns {Object}
 */
export function toPascalCasePayload(obj) {
  if (!obj || typeof obj !== "object") return obj;

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[toPascalCase(key)] = value;
  }
  return result;
}
