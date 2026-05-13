const fieldMenu = [
  { key: "inventoryItemTypeName", label: "Loại món", type: "text" },
  { key: "itemCode", label: "Mã món", type: "text" },
  { key: "itemName", label: "Tên món", type: "text" },
  { key: "inventoryItemCategoryName", label: "Nhóm thực đơn", type: "text" },
  { key: "unitName", label: "Đơn vị tính", type: "text" },
  { key: "costPrice", label: "Giá vốn", type: "currency", align: "right" },
  { key: "salePrice", label: "Giá bán", type: "currency", align: "right" },
  { 
    label: "Phí dịch vụ đặc biệt", 
    children: [
      { key: "specialServiceFee", label: "Số tiền", type: "currency", align: "right" },
      { key: "specialServiceFeePercent", label: "Phần trăm (%)", type: "number", align: "right" }
    ]
  },
  { key: "marketPriceStatus", label: "Thay đổi theo thời giá", type: "checkbox", align: "center" },
  { key: "priceConfigType", label: "Điều chỉnh giá tự do", type: "checkbox", align: "center" },
  { key: "quantifiedStatus", label: "Định lượng NVL", type: "text" },
  { key: "isTaxExempt", label: "Món được giảm thuế", type: "checkbox", align: "center" },
  { key: "menuDisplayStatus", label: "Hiển thị trên thực đơn", type: "checkbox", align: "center" },
  { key: "sellingStatus", label: "Ngừng bán", type: "checkbox", align: "center" }
];

export default fieldMenu;
