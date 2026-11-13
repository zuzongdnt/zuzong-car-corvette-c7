# ZEPHYRON — Giao diện trắng đen

Ngày cập nhật: 02/11/2026.

Giao diện dùng nền trắng, chữ đen và các cảnh xe toàn màn nền tối. Giữ nguyên màu gốc của ảnh, video và logo các hãng. Logo ZEPHYRON giữ nguyên ký hiệu, wordmark và mọi đường vector của bản gốc; chỉ đổi màu đen hoặc trắng theo nền.

- Đen: #111111. Trắng: #FFFFFF. Nền phụ: #F4F4F4. Chữ phụ: #626262.
- Chữ giao diện: Manrope, có dấu tiếng Việt, lưu cục bộ trong dự án.
- Tiêu đề chữ thường, tương phản bằng cỡ chữ và khoảng trắng. Nút chính nền đen, chữ trắng. Nút phụ nền trắng, viền đen.
- Header, footer, studio 3D, bộ sưu tập, bài viết, tài khoản, giỏ và biểu mẫu dùng cùng hệ thống.
- Ảnh, phim và logo các hãng giữ màu tự nhiên, không áp dụng grayscale. Tài nguyên gốc được giữ nguyên.
- Bảng chọn màu và model 3D giữ màu sản phẩm thật để việc phối màu vẫn chính xác. Không thay dữ liệu cấu hình, giá, tài khoản hoặc giỏ đã lưu của người dùng.
- Cảnh mở bạt vẫn có ba mốc chữ theo cuộn, tua ngược, logo hãng và năm phim cận xe. Có hỗ trợ giảm chuyển động.

## File chỉnh sửa

- `monochrome.css`: bố cục và giao diện chung, tải sau các CSS nền trên 15 trang.
- `assets/brand-monochrome/`: logo SVG dạng đường vector, biểu tượng và trang xem bộ nhận diện `identity.html`.
- `scripts/recolor-original-logo.py`: đổi màu bản SVG gốc, có kiểm tra đường vector, transform và viewBox trùng nguồn.
- `scripts/apply-monochrome.py`: chuyển màu CSS nền sang trung tính, thêm tham chiếu logo và CSS chung; không sửa ảnh/video/model gốc.
- `site.js`, `studio.js`, `campaign-config.js`: nội dung, điều hướng và nút chọn hãng có logo.

## Kiểm tra

- `node scripts/qa-monochrome.cjs`: 15 trang ở 1440, 768, 390 và 320 px; kiểm tra CSS, logo, tràn ngang, tiêu đề, lỗi trình duyệt và tài nguyên.
- `node scripts/qa-sitemap.cjs`: kéo xoay, zoom, phối màu, lưu cấu hình, giỏ, biểu mẫu yêu cầu mẫu, tài khoản và bộ ảnh.
- `node scripts/qa-unveil-five.cjs`: cảnh toàn màn, chữ theo cuộn, logo, video và giảm chuyển động.
- `node scripts/build.cjs`: tạo `dist/` và kiểm tra tài nguyên 15 trang.

Ảnh và báo cáo nằm trong `output/playwright/monochrome/`, `output/playwright/unveil-five/` và `output/sitemap-qa.json`. Kiểm tra kích thước điện thoại bằng Chrome không tương đương kiểm tra trên thiết bị thật.

Bản nguồn trước khi làm lại được giữ ở `output/backups/monochrome-redesign-20261102/`.

## Điều chỉnh theo 6 góp ý trên trình duyệt

- Cập nhật 03/11: khối chữ intro thu nhỏ, blur 14 px; giữ màu ảnh/video.
- Cập nhật 03/11: nav luôn hiện trong intro, chỉ nền header trong suốt. Khi rời intro hiện lớp kính lỏng có SVG displacement và blur 10 px. Kéo về đầu chỉ ẩn lớp nền kính, không ẩn nav. Xem `NAV_LIQUID_SPECS_20261103.md`.
- Bảng phối màu dùng nền kính mờ sáng và giữ các nút/màu sản phẩm.
- Logo trong thanh điều hướng dùng bố cục ngang. Các đường vector của ký hiệu và chữ gốc được giữ nguyên; chỉ đặt lại vị trí và tỷ lệ tương đối giữa hai khối. Logo lớn trong intro và footer giữ bố cục xếp dọc.
- Ảnh máy bay trong mục Hành trình được thay bằng Porsche 911 Carrera trên đường, nguồn ảnh chính thức Porsche; có ghi công trong `sources.html`.
- `scripts/prepare-browser-comments.py`: xuất logo ngang từ đường nét gốc, chuẩn bị ảnh và cập nhật các nguồn HTML.
- `node scripts/qa-browser-comments.cjs`: kiểm tra 6 góp ý tại 1575×884, 761×884, 390×844 và 320×640, có ảnh và báo cáo ở `output/playwright/browser-comments/`.
