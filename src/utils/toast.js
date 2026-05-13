/**
 * Toast notification utility
 * Phát custom event để MsNotification.vue lắng nghe và hiển thị
 */
export const toast = {
  /**
   * Hiển thị toast thành công
   * @param {string} msg - Nội dung thông báo
   * @param {number} duration - Thời gian hiển thị (ms), mặc định 3000
   */
  success: (msg, duration = 3000) => {
    window.dispatchEvent(
      new CustomEvent("ms-toast", {
        detail: { message: msg, type: "success", duration },
      }),
    );
  },

  /**
   * Hiển thị toast lỗi
   */
  error: (msg, duration = 4000) => {
    window.dispatchEvent(
      new CustomEvent("ms-toast", {
        detail: { message: msg, type: "error", duration },
      }),
    );
  },

  /**
   * Hiển thị toast cảnh báo
   */
  warning: (msg, duration = 3500) => {
    window.dispatchEvent(
      new CustomEvent("ms-toast", {
        detail: { message: msg, type: "warning", duration },
      }),
    );
  },

  /**
   * Hiển thị toast thông tin
   */
  info: (msg, duration = 3000) => {
    window.dispatchEvent(
      new CustomEvent("ms-toast", {
        detail: { message: msg, type: "info", duration },
      }),
    );
  },
};
