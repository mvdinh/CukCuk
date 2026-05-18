import * as XLSX from "xlsx-js-style";

/**
 * Xuất dữ liệu ra file Excel với giao diện được thiết kế cực kỳ chuyên nghiệp và đẹp mắt
 * @param {Object} options Đối số cấu hình xuất Excel
 * @param {Array} options.data Danh sách dữ liệu cần xuất
 * @param {Array} options.columns Danh sách các cột hiển thị (key, label, type, etc.)
 * @param {String} options.title Tiêu đề ở dòng đầu tiên
 * @param {String} options.fileName Tên file khi tải về (không bao gồm đuôi .xlsx)
 * @param {String} options.sheetName Tên của Sheet bên trong Excel
 */
export const exportToExcel = ({
  data,
  columns,
  title = "DANH SÁCH THỰC ĐƠN",
  fileName = "Danh_sach_thuc_don",
  sheetName = "Thực đơn",
}) => {
  if (!data || data.length === 0) {
    throw new Error("Không có dữ liệu để xuất");
  }

  // 1. Tạo mảng AOA (Array of Arrays) cho cấu trúc Excel
  const aoa = [];

  // Dòng 1: Tiêu đề danh sách (sẽ được căn giữa và merge)
  const titleRow = new Array(columns.length).fill("");
  titleRow[0] = title.toUpperCase();
  aoa.push(titleRow);

  // Dòng 2: Hàng header (thead)
  const headerRow = columns.map((col) => col.label || "");
  aoa.push(headerRow);

  // Dòng 3 trở đi: Dữ liệu (data)
  data.forEach((row) => {
    const dataRow = columns.map((col) => {
      const value = row[col.key];

      // Format Boolean/Checkbox thành "Có" hoặc "Không"
      if (col.type === "checkbox" || typeof value === "boolean") {
        let isChecked = !!value;
        if (col.key === "marketPriceStatus") {
          isChecked = value === 1;
        } else if (col.key === "priceConfigType") {
          isChecked = value || row.marketPriceStatus === 0;
        }
        return isChecked ? "Có" : "Không";
      }

      // Đối với kiểu số, trả về kiểu số (number) để Excel tự căn phải và cho phép tính toán
      if (col.type === "number" || typeof value === "number") {
        if (value !== null && value !== undefined && value !== "") {
          return Number(value);
        }
        return "";
      }

      // Các kiểu dữ liệu khác
      return value !== null && value !== undefined ? String(value) : "";
    });
    aoa.push(dataRow);
  });

  // 2. Chuyển đổi mảng AOA sang worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);

  // 3. Thiết lập merge cho hàng tiêu đề đầu tiên (từ cột đầu đến cột cuối)
  if (columns.length > 0) {
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columns.length - 1 } },
    ];
  }

  // 4. Áp dụng định dạng, màu sắc, font chữ và viền cho từng ô (Styling)
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  
  for (let r = 0; r <= range.e.r; r++) {
    for (let c = 0; c <= range.e.c; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      let cell = worksheet[cellRef];
      
      if (!cell) {
        // Tạo ô rỗng để áp dụng background & border thống nhất cho toàn bộ hàng merge
        worksheet[cellRef] = { t: "s", v: "" };
        cell = worksheet[cellRef];
      }

      // Khởi tạo đối tượng style
      cell.s = {};

      if (r === 0) {
        // --- CẤU HÌNH DÒNG TIÊU ĐỀ (DÒNG 1) ---
        cell.s = {
          font: {
            name: "Arial",
            sz: 16,
            bold: true,
            color: { rgb: "029E74" }, // Màu xanh thương hiệu nổi bật
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
          },
          fill: {
            fgColor: { rgb: "E8F5E9" }, // Màu nền xanh ngọc cực nhẹ nhã nhặn
          },
          border: {
            top: { style: "thin", color: { rgb: "A5D6A7" } },
            bottom: { style: "thin", color: { rgb: "A5D6A7" } },
            left: { style: "thin", color: { rgb: "A5D6A7" } },
            right: { style: "thin", color: { rgb: "A5D6A7" } },
          },
        };
      } else if (r === 1) {
        // --- CẤU HÌNH HÀNG HEADERS/THEAD (DÒNG 2) ---
        cell.s = {
          font: {
            name: "Arial",
            sz: 11,
            bold: true,
            color: { rgb: "FFFFFF" }, // Chữ trắng nổi bật trên nền xanh
          },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          fill: {
            fgColor: { rgb: "029E74" }, // Màu nền xanh thương hiệu CukCuk sâu sắc
          },
          border: {
            top: { style: "thin", color: { rgb: "017C5B" } },
            bottom: { style: "medium", color: { rgb: "01543D" } },
            left: { style: "thin", color: { rgb: "017C5B" } },
            right: { style: "thin", color: { rgb: "017C5B" } },
          },
        };
      } else {
        // --- CẤU HÌNH CÁC DÒNG DỮ LIỆU (DÒNG 3 TRỞ ĐI) ---
        const col = columns[c];
        const isEvenRow = r % 2 === 0;

        // Xác định căn lề tự động cho dữ liệu
        let horizontalAlign = "left";
        if (col) {
          if (col.type === "checkbox" || col.align === "center" || typeof cell.v === "boolean") {
            horizontalAlign = "center";
          } else if (col.type === "number" || col.align === "right" || typeof cell.v === "number") {
            horizontalAlign = "right";
          }
        }

        cell.s = {
          font: {
            name: "Arial",
            sz: 10,
            color: { rgb: "2D3748" }, // Màu chữ xám đen dễ chịu
          },
          alignment: {
            horizontal: horizontalAlign,
            vertical: "center",
          },
          fill: {
            fgColor: { rgb: isEvenRow ? "F7FAFC" : "FFFFFF" }, // Kỹ thuật Zebra Striping tăng khả năng đọc
          },
          border: {
            top: { style: "thin", color: { rgb: "E2E8F0" } },
            bottom: { style: "thin", color: { rgb: "E2E8F0" } },
            left: { style: "thin", color: { rgb: "E2E8F0" } },
            right: { style: "thin", color: { rgb: "E2E8F0" } },
          },
        };

        // Áp dụng định dạng tiền tệ / dấu phân tách phần nghìn cho Excel
        if (col && (col.type === "number" || col.align === "right")) {
          if (cell.t === "n") {
            cell.z = "#,##0";
          }
        }
      }
    }
  }

  // 5. Tự động tính toán độ rộng tối ưu và đẹp mắt cho từng cột
  const colWidths = columns.map((col) => {
    let maxCharLength = col.label ? col.label.length : 10;

    data.forEach((row) => {
      const value = row[col.key];
      let displayString = "";

      if (col.type === "checkbox" || typeof value === "boolean") {
        displayString = value ? "Có" : "Không";
      } else if (col.type === "number" || typeof value === "number") {
        if (value !== null && value !== undefined && value !== "") {
          displayString = Number(value).toLocaleString("vi-VN");
        }
      } else {
        displayString = value !== null && value !== undefined ? String(value) : "";
      }

      maxCharLength = Math.max(maxCharLength, displayString.length);
    });

    // Cộng thêm 5 ký tự đệm để tránh hiện tượng bị thu hẹp hoặc hiện ###, tối thiểu là 14
    return { wch: Math.max(maxCharLength + 5, 14) };
  });

  worksheet["!cols"] = colWidths;

  // 6. Thiết lập chiều cao dòng thoáng đãng, sang trọng
  const rowHeights = [];
  rowHeights.push({ hpt: 38 }); // Dòng tiêu đề: cao ráo 38pt
  rowHeights.push({ hpt: 26 }); // Dòng thead: cao 26pt
  for (let r = 2; r <= range.e.r; r++) {
    rowHeights.push({ hpt: 20 }); // Dòng data: cao thoáng 20pt
  }
  worksheet["!rows"] = rowHeights;

  // 7. Tạo workbook mới, thêm worksheet vào và lưu file
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${fileName}_${Date.now()}.xlsx`);
};
