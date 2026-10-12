# Canh khung xe khi cuộn — 09/10/2026

Phần `#performance` dùng 5 ảnh nguồn số 1, 3, 5, 8, 9. Những ảnh lệch góc nhiều và hai ảnh qua gầm cầu không tham gia trình chiếu; toàn bộ ảnh gốc và bản xuất vẫn được giữ.

Tâm xe, chiều rộng và điểm bánh chạm đường được chuẩn hóa bằng tỷ lệ đồng đều, không kéo méo thân xe. Nền cùng ảnh được làm mờ để nối phần ngoài mép; chuyển ảnh trong 110ms tự kết thúc ở một ảnh khi dừng cuộn. Ba card giữ blur 18px.

Chrome trên Windows đã kiểm tra các viewport 1920×1080, 1440×900, 820×871, 390×844, 360×780, 320×568:

- Đủ 5 ảnh, không tải hai ảnh gầm cầu; không lỗi JavaScript, tài nguyên HTTP lỗi hoặc tràn ngang.
- Dừng tại bốn mốc giữa ảnh không giữ trạng thái chồng hai ảnh. Đi tới cuối rồi quay lại đầu cho cùng bitmap ở cả 6 viewport.
- Điểm bánh chạm đường đo độc lập từ pixel ở 1440×900 và 390×844 lệch tối đa 1px giữa 5 ảnh.
- Xe không bị card đè lên; chữ trong card và footer vừa khung. Chế độ giảm chuyển động hiện đủ thông số.
- Intro vẫn phủ nền màn hình; nút Khám phá C7 vẫn đỏ đặc, không blur.

Kích thước điện thoại được mô phỏng bằng trình duyệt trên PC. Đây là chuỗi ảnh tĩnh có góc chụp gần nhau; các chi tiết phối cảnh vẫn theo ảnh nguồn.

Bằng chứng: `output/playwright/drive-scroll-qa.json`, `audit-align-v2-independent.json`, `audit-native-rewind.json`, ảnh `drive-aligned-*.png` và `audit-align-v2-*.png`. Chạy lại bằng `node scripts/qa-drive-scroll.cjs` khi localhost đang mở.
