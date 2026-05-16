const fieldMenu = [
  { key: "inventoryItemTypeName", label: "Loại món", type: "text" },
  { key: "itemCode", label: "Mã món", type: "text" },
  { key: "itemName", label: "Tên món", type: "text" },
  { key: "inventoryItemCategoryName", label: "Nhóm thực đơn", type: "text" },
  { key: "unitName", label: "Đơn vị tính", type: "text" },
  { key: "costPrice", label: "Giá vốn", type: "number", align: "right" },
  { key: "salePrice", label: "Giá bán", type: "number", align: "right" },
  {
    key: "isSpecial",
    label: "Là món đặc trưng",
    type: "checkbox",
    align: "center",
  },
  {
    key: "marketPriceStatus",
    label: "Thay đổi theo thời giá",
    type: "checkbox",
    align: "center",
  },
  {
    key: "priceConfigType",
    label: "Điều chỉnh giá tự do",
    type: "checkbox",
    align: "center",
  },
  {
    key: "menuDisplayStatus",
    label: "Hiển thị trên thực đơn",
    type: "checkbox",
    align: "center",
  },
  {
    key: "sellingStatus",
    label: "Ngừng bán",
    type: "checkbox",
    align: "center",
  },
];

export default fieldMenu;
