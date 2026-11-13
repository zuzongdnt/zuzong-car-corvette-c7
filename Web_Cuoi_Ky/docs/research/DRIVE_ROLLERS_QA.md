# Đoạn ảnh xe chạy mới — 09/10/2026

Nguồn: ZIP `Corvette C7 Z06 #3 _ 4k Roller Cinematic_1080p60_0001.zip` do Zuzong gửi, gồm 49 ảnh 1920×1080. Dùng 6 ảnh liên tiếp số 44–49: xe trắng đang chạy, camera nhìn chính diện và cùng đoạn đường giữa hàng cây. Không đưa cảnh đỗ xe hoặc chuyển sang góc quay khác vào phần cuộn.

Ảnh web ở `assets/drive-rollers/`: 1920×1080 cho máy tính, 1280×720 cho điện thoại, đều 16:9. Chỉ tối ưu định dạng/kích thước; không tạo ảnh hoặc chi tiết xe mới. ZIP và ảnh gốc được giữ. Bộ ảnh cũ vẫn ở thư mục riêng.

Tâm xe, chiều rộng và điểm bánh chạm đường được canh thống nhất bằng tỷ lệ đồng đều. Xe trong nguồn ở xa nên giới hạn mức phóng ảnh trên desktop; chữ CORVETTE tự thu gọn và nằm trên xe. Ba card kính giữ blur 18px, chuyển ảnh tự kết thúc khi dừng cuộn.

Kiểm tra bằng Chrome trên Windows ở 1920×1080, 1440×900, 820×871, 390×844, 360×780 và 320×568. Kích thước điện thoại được mô phỏng trên PC. Báo cáo hiện tại nằm trong `output/playwright/drive-scroll-qa.json`; ảnh chụp `drive-rollers-*.png`.

Các kiểm tra gồm đúng số ảnh nguồn 44–49, giải mã đủ WebP 16:9, không lỗi JavaScript/tài nguyên HTTP, không tràn ngang hoặc chữ bị cắt, xe và tiêu đề không bị card che, dừng giữa mốc ảnh không giữ bóng đôi, đi đến cuối rồi quay về đầu cho cùng bitmap, và chế độ giảm chuyển động hiện đủ thông số. Intro và nút đỏ được kiểm tra lại cùng lượt. Đây là chuỗi ảnh tĩnh được trích từ video, không phải video 60fps.

Chạy lại: `node scripts/qa-drive-scroll.cjs` khi localhost đang mở. Build: `node scripts/build.cjs`.
