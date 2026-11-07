# Đồng bộ điều hướng với trang chủ

Tất cả 15 trang dùng cùng bộ `navigation.js` và `navigation.css`, gọi từ `site.js`.

- PC: cùng logo ngang gốc, chiều cao header, khoảng cách liên kết, gạch chân mục hiện tại, nút giỏ có số lượng và tài khoản. Ở màn hình 761–1100 px, thu gọn logo và khoảng cách để giữ đủ các mục.
- Mobile từ 760 px trở xuống: cùng thanh dưới gồm Trang chủ, Studio 3D, Khám phá, Bộ sưu tập. Nút menu trên cùng cho truy cập các liên kết bổ sung, gồm tài khoản và giỏ.
- Trang chủ giữ nav trong suốt trên intro và nền kính sau intro. Các trang con dùng cùng nền kính của trang chủ khi cuộn.
- Trang chi tiết xe chọn mục Sản phẩm/Studio 3D. Hành trình, thước phim, tin tức và bài viết chọn nhóm Khám phá. Menu bổ sung vẫn đánh dấu đúng trang cụ thể.
- Menu đóng khi chọn liên kết, bấm ngoài, nhấn Escape, chuyển focus ra ngoài hoặc đổi giữa chế độ mobile/desktop. Escape trả focus về nút menu.
- Bỏ các bộ xử lý menu riêng trong `app.js`/`editorial.js`; dùng chung một bộ, tránh một lần bấm bị mở/đóng hai lần.
- `bottom-nav.js` chống tạo trùng khi cùng được tải từ trang cũ và module chung.
- Không đổi ảnh/video/model hoặc nội dung các trang.

## Kiểm tra

- `node scripts/qa-navigation.cjs`: so sánh hình học, font, mục nav, nút giỏ giữa 15 trang tại 1440/1024/768/761/760/390/320 px; kiểm tra menu, Escape/focus, số lượng thanh nav, mục hiện tại và tràn ngang.
- `node scripts/qa-navigation-interactions.cjs`: chuyển trang qua menu, giỏ và bộ đếm, đóng khi bấm ngoài/resize, intro trong suốt và kính khi cuộn.
- `node scripts/qa-monochrome.cjs`: toàn bộ 15 trang tại bốn kích thước vẫn đạt, không lỗi tải tài nguyên hoặc lỗi JavaScript.
- `node scripts/build.cjs`: đóng gói module/CSS và build 15 trang đạt.
- Ảnh và báo cáo: `output/playwright/navigation/`.

Đã kiểm tra bằng Chrome trên máy tính với kích thước màn hình giả lập. Chưa kiểm tra điện thoại thật hoặc Safari.
