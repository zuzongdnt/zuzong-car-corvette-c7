# Logo ZEPHYRON và bản quyền thương hiệu — 02/11/2026

Dự án: `E:/du_dan_cuoi_ky_tkdh/Web_Cuoi_Ky`.

- Dùng logo SVG Bézier đã duyệt, giữ khoảng cách biểu tượng và chữ của bản vector mới.
- Đồng bộ header, intro, các footer, biểu tượng tab và tên nhận diện hiển thị của 15 trang chính.
- Footer dùng chung thông tin bản quyền Chevrolet / Corvette, BMW, Porsche, Mercedes-Benz / AMG và Lamborghini. Tên hãng liên kết đến trang thông tin quyền chính thức của từng hãng.
- Giữ liên kết đến `sources.html` để ghi công tác giả model, hình ảnh và giấy phép tài nguyên riêng.
- Footer nêu rõ website là đồ án độc lập; phần ghi công không được diễn đạt như sự cấp phép hoặc hợp tác chính thức của các hãng.
- Giữ nguyên khóa lưu trữ trong trình duyệt, sự kiện nội bộ và tên vật liệu model để cấu hình đã lưu và chức năng đổi màu tiếp tục hoạt động.

## Tài nguyên

- `assets/zephyron-logo-red.svg`: logo đầy đủ.
- `assets/zephyron-icon.svg`: biểu tượng lấy từ cùng bản vector, dùng cho favicon.
- `site.js`: logo trên trang con, nội dung footer và danh mục bản quyền dùng chung.
- `site.css`: tỷ lệ logo, kích thước theo màn hình và bố cục mục bản quyền.

## Nguồn thông tin quyền

- General Motors: https://www.gm.com/copyright-trademark.html
- BMW: https://www.bmw.ie/en/footer/footer-section/legal-notice.html
- Porsche: https://newsroom.porsche.com/en_US/legal-notice.html
- Mercedes-Benz: https://group.mercedes-benz.com/provider/
- Lamborghini: https://www.lamborghini.com/en-en/privacy-legal

## Kiểm tra

- Build bằng `node scripts/build.cjs`: thành công; đã cập nhật `dist`.
- Kiểm tra cú pháp 13 file JS/CJS ở thư mục chính: thành công.
- Kiểm tra 15 trang trên Chrome tại độ rộng 1440, 390 và 320 px: đủ 5 hãng, mỗi trang chỉ có một mục bản quyền, logo không méo, không tràn ngang, không có lỗi JavaScript trong lần kiểm tra.
- Menu trên điện thoại vẫn mở được.
- Kết quả: `output/playwright/zephyron-brand-qa.json`; ảnh xem trước trong cùng thư mục.
- Bản sao trước sửa: `output/Logo_ZEPHYRON_20261102/Truoc_Khi_Thay_Logo.zip`.

Phạm vi xác minh là bản HTML chạy cục bộ trên Chrome. Chưa triển khai lên hosting hoặc kiểm tra trên điện thoại vật lý. Logo/chữ đã nằm sẵn trong khung hình video hoặc texture của model không được chỉnh sửa trong lần thay nhận diện HTML này.
