# Kiểm tra giao diện V2 — 08/10/2026

## Thay đổi

- Bốn trang: Studio, Hành trình, Thước phim và Bộ sưu tập, liên kết với nhau qua header/footer và các phần giới thiệu.
- Bạt mở từ đầu xe và gom về sau, 144 khung trên mỗi chế độ desktop/mobile, có preview nhẹ. Xe giữ cố định, cân góc hero −12,8° theo hai điểm tiếp xúc bánh xe; góc collection trước −12°, sau +32°, chính diện +2,5°. Góc chụp phối cảnh gốc vẫn được giữ.
- Ba ảnh người dùng được chuyển WebP, giữ nguyên nội dung. Hai video giữ âm thanh gốc AAC, hình H.264 và faststart; tổng ảnh/video editorial khoảng 2,42 MB.
- Bản mobile tải khung reveal lớn gần vị trí cuộn, không tải tất cả 144 khung lớn, giữ tối đa 14 bitmap. Desktop giữ tối đa 24 bitmap lớn trong cache. Reduced motion dùng ảnh xe đã cân.
- Máy chủ tĩnh hỗ trợ MIME MP4 và HTTP Range cho thao tác tua.

## Kiểm tra đã thực hiện

Chrome trên Windows, viewport desktop 1440×900, tablet 768×1024, điện thoại mô phỏng 390×844 và 360×780, ngang 844×390; thêm kiểm tra hero 320×640 và ngang 740×390.

- Không lỗi JavaScript, ảnh hỏng, tài nguyên HTTP lỗi hoặc tràn ngang trong các lượt kiểm tra.
- Mở bạt tiến/lùi, khôi phục khi đổi độ rộng và bật/tắt reduced motion; cuối chuỗi đạt frame 143. Bố cục điện thoại đã đưa câu kết lên phía trên xe. Landscape thấp hiện đủ xe trong viewport.
- Giải mã đủ 576 WebP: desktop/mobile và preview, không lỗi, 124 khung khác nhau, 18 khung giữ cuối.
- Menu điện thoại, liên kết giữa trang, chuyển góc xe và thư viện Studio 18 ảnh hoạt động.
- Hành trình desktop đổi đúng ảnh và số chương 01/02/03 khi cuộn; tablet/mobile dùng ảnh theo từng chương.
- Cả hai video phát, tạm dừng, tua và bật tiếng được; audio đã thực sự giải mã trong trình duyệt. Chỉ một video phát cùng lúc. Video còn dưới trang không được tải khi chưa vào khung nhìn.
- Thư viện mới đủ 21 ảnh; lọc ngoại cảnh 3, Studio 18. Modal chuyển ảnh bằng phím, đóng bằng Escape và trả focus. Tab/Shift+Tab nằm trong hộp thoại. Hộp thoại 844×390 không cắt phần chú thích.
- Đã xem ảnh chụp desktop/mobile của bốn trang và sửa bố cục theo ảnh, không chỉ dựa vào kiểm tra cú pháp.
- Cú pháp kiểm bằng `node --check`; build bằng `node scripts/build.cjs`, xác minh tài nguyên/liên kết trên cả bốn HTML. Node chạy trực tiếp vì npm cài trên máy đang thiếu npm-cli.js; không thay cấu hình máy.

## Bằng chứng

- `output/playwright/upgrade-results.json`, `upgrade-*.png`: tích hợp Studio và responsive.
- `output/playwright/reveal-v2-*.png`, `reveal-v2-sequence-validation.json`: chuỗi mở bạt và các chế độ màn hình.
- `output/playwright/editorial-audit-experience-films-gallery.json`, `editorial-audit-*.png`: ba trang mới, video và gallery.
- `assets/editorial/manifest.json`: nguồn, codec, thời lượng và dung lượng media.

Các kích thước điện thoại được kiểm tra trong trình duyệt mô phỏng trên PC; chưa thử trên điện thoại thật hoặc Safari iOS. Hiệu ứng bạt là chuỗi ảnh dựng từ mesh, không phải mô phỏng vật lý vải đầy đủ.
