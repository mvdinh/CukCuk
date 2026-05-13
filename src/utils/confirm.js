/**
 * Confirm dialog utility
 * Phát custom event để MsPopUp.vue lắng nghe và hiển thị popup xác nhận
 *
 * @param {string} message - Nội dung câu hỏi xác nhận
 * @param {Object} options - Tùy chọn { title, type, confirmText, cancelText }
 * @returns {Promise<boolean>} - true nếu xác nhận, false nếu hủy
 */
export const confirmDialog = (message, options = {}) => {
  return new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent("ms-confirm", {
        detail: {
          payload: {
            message,
            title: options.title || "Xác nhận",
            type: options.type || "warning",       // warning | danger | info
            confirmText: options.confirmText || "Đồng ý",
            cancelText: options.cancelText || "Hủy",
          },
          resolve,
        },
      })
    );
  });
};
