# ROLE

Bạn là một Senior Frontend Engineer + Vibe Coder chuyên Vue 3 + Vite + Pinia + SCSS theo style MISA CukCuk.

# CONTEXT

Đọc toàn bộ source code dự án hiện tại trước khi code để giữ nguyên cấu trúc project, convention đặt tên, folder structure, style component và flow dữ liệu.

Tech stack:

- Vue 3 Composition API
- Vite
- Pinia để quản lý state
- Vue Router
- Axios call API
- SCSS/CSS module tùy theo dự án hiện tạiđọc  file 

claude.md
 và hình ảnh UI tôi cung để thực hiện yêu cầu 

Yêu cầu code sạch, chia component hợp lý, UI mượt, animation nhẹ, UX giống phần mềm desktop.

---

# YÊU CẦU CHỨC NĂNG

## 1. Chỉnh sửa Sidebar

Điều chỉnh lại sidebar:

- Thu hẹp chiều ngang sidebar nhỏ hơn hiện tại
- Khoảng cách menu compact hơn
- UI giống phong cách MISA CukCuk
- Responsive tốt
- Hover mượt
- Active menu rõ ràng
- Icon và text cân đối
- Không phá layout hiện tại

---

# 2. Chức năng thêm / sửa thực đơn

## Chỉ làm:

- Trang thêm món ăn
- Trang sửa món ăn

---

## Điều hướng

Khi nhấn:

- Nút “Thêm” → chuyển sang trang thêm món ăn
- Double click vào một dòng item trong table → mở trang sửa món ăn

---

# 3. Form thêm / sửa thực đơn

## Form fields

Bao gồm:

- Mã món
- Tên món
- Giá bán
- Giá vốn
- Nhóm thực đơn
- Đơn vị tính
- Danh sách bếp áp dụng
- Mô tả
- Trạng thái
- Hình ảnh nếu có

---

# 4. Tab navigation trong form

Khi nhấn TAB:

- Focus đúng thứ tự field
- Enter không submit form
- UX giống desktop app
- Input đang focus có highlight

---

# 5. Popup confirm khi rời form

Nếu đang:

- thêm
- sửa

và dữ liệu đã thay đổi mà:

- nhấn quay lại
- nhấn hủy
- chuyển route

thì hiển thị popup:

“Bạn có chắc chắn muốn hủy thay đổi không?”

Các nút:

- Đồng ý
- Không

---

# 6. Multi select bếp

Trong form:

- Có thể chọn nhiều bếp
- Sau khi chọn xong:
  - item đã chọn biến mất khỏi dropdown select

- Có thể remove lại bằng tag/x button
- UI dạng tag selection

Ví dụ:
[ Bếp Á ] [ Bếp Âu ] ✕

---

# 7. Thêm nhanh nhóm thực đơn và đơn vị tính

Trong form:

- Có thể thêm mới:
  - nhóm thực đơn
  - đơn vị tính

ngay tại form.

Ví dụ:

- Dropdown có nút:
  - Thêm nhóm thực đơn
  - Thêm đơn vị tính

Khi nhấn:

- mở popup nhỏ
- nhập tên
- submit API
- cập nhật realtime vào dropdown
- auto select item vừa tạo

---

# 8. Validate form

Validate giống UX MISA:

- Validate realtime
- Validate khi blur
- Validate khi submit

Các field required:

- Mã món
- Tên món
- Đơn vị tính
- Giá bán

---

## Validate rules

### Mã món

- Required
- Không được trùng

### Tên món

- Required
- Không được trùng

### Giá bán

- > = 0 , bắt lỗi giá tiền việt nam

### Giá vốn

- > = 0, bắt lỗi giá tiền việt nam

---

# 9. Focus lỗi đầu tiên

Khi submit:

- focus vào field lỗi đầu tiên
- scroll tới field lỗi
- border đỏ
- hiển thị message dưới input

Ví dụ:
“Mã món không được để trống”

---

# 10. State management bằng Pinia

Yêu cầu:

- Toàn bộ call API dùng Pinia store
- Không call API trực tiếp trong component

Tách:

- store
- service
- api layer

Ví dụ:

- inventoryItemStore
- kitchenStore
- categoryStore
- unitStore

---

# 11. API architecture

# 12. UX/UI yêu cầu

Phong cách:

- MISA CukCuk
- Minimal
- Clean
- Desktop app feeling
- Animation nhẹ
- Input height đồng đều
- Hover/focus smooth
- Popup đẹp
- Loading state đẹp
- Empty state đẹp

---

# 13. Coding requirements

Yêu cầu:

- Composition API
- Script setup
- Reusable component
- Không hardcode
- Clean code
- SOLID frontend
- Không viết logic dài trong template
- Có typing rõ ràng nếu dùng TypeScript
- Tách composable nếu cần

---

# 14. Output mong muốn

Sau khi hoàn thành:

- Hiển thị toàn bộ file đã sửa
- Hiển thị file mới được tạo
- Giải thích flow hoạt động
- Giải thích state Pinia
- Giải thích validate flow
- Giải thích route flow

Code phải chạy được ngay.
