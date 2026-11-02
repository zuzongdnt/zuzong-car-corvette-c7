# Cảnh mở bạt Corvette từ video của Zuzong

Ngày cập nhật: 24/10/2026.

- Video nguồn: `../output/Blender_Cloth_Reveal_2K/Zuzong_Corvette_Cloth_Reveal_2K.mp4` (tính từ thư mục gốc website).
- Trích đủ 160 khung hình gốc, 24 hình/giây, thời lượng 6,67 giây. Không tạo thêm khung hình bằng AI.
- Tài nguyên: `assets/reveal-cloth-2k/`; desktop 1920 × 1080, mobile 960 × 540, kèm ảnh xem trước nhẹ.
- Dung lượng: desktop 8.981.042 byte; mobile 3.449.916 byte. Mỗi bản có 160 ảnh WebP.
- Cuộn xuôi/ngược điều khiển toàn bộ cảnh. Hai khung liền nhau được hòa theo vị trí cuộn; chuyển động được làm dịu theo thời gian, không phụ thuộc tần số màn hình.
- Bộ nhớ ảnh lớn giới hạn ở 18 khung desktop / 12 khung mobile. Bản xem trước xử lý các bước nhảy khi cuộn nhanh.
- Tôn trọng chế độ giảm chuyển động; hiện ảnh xe đã mở bạt. Nếu tải chuỗi ảnh thất bại, ảnh tĩnh vẫn hiển thị.
- Chữ và hình đã được bố trí riêng cho desktop, tablet dọc, điện thoại và màn hình ngang.

## Chạy tại máy

Mở terminal ở thư mục `Web_Cuoi_Ky`, chạy `node server.cjs`, truy cập `http://localhost:4173/#unveil`.

## Kiểm tra đã chạy

- `node scripts/qa-cloth-reveal.cjs`: PASS trên Chrome tại 1440 × 900, 390 × 844, 320 × 640, 768 × 1024 và 844 × 390.
- Đã kiểm tra ảnh đầu/cuối, giữa cảnh, cuộn ngược, cuộn liên tục 300 mẫu ở desktop và mobile, đổi kích thước, bật/tắt giảm chuyển động, lỗi tải ảnh giả lập.
- Không phát hiện lỗi JavaScript, HTTP 404 hoặc tràn ngang. Khung đầu đạt 0, khung cuối đạt 159 ở chất lượng đầy đủ; bộ nhớ nằm trong giới hạn.
- Đây là kiểm tra viewport mobile trên Chrome của máy tính, chưa đo trên điện thoại vật lý.
- `node scripts/build.cjs`: PASS; bản `dist` có đủ ảnh desktop/mobile và manifest trùng nguồn.
- `node --check app.js`, `node --check reveal-sequence.js`: PASS.
- Báo cáo chi tiết và ảnh kiểm tra: `output/playwright/cloth-reveal/results.json` và các PNG cùng thư mục.

## Tạo lại ảnh

Chạy `python scripts/import-cloth-reveal.py` (cần Pillow và imageio-ffmpeg). SHA-256 của video và cấu hình xuất được ghi trong `assets/reveal-cloth-2k/manifest.json`.

Bản sao các file trước khi sửa: `../output/Cloth_Reveal_Web_Backup_20261024/`.
