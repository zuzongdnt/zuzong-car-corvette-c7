# Bật / tắt đèn xe 3D

Nút **Bật đèn xe** trong bảng cấu hình điều khiển đèn trước và đèn hậu trên cả năm mẫu xe.

## Cách dựng

- Dùng vật liệu emissive của chính cụm đèn trong model; không thêm ảnh ánh sáng, sprite, nón sáng hoặc hình dán lên xe.
- Ánh sáng chuyển dần theo thời gian, khoảng nửa giây. Cài đặt giảm chuyển động của hệ thống làm chuyển trạng thái ngay.
- Selective bloom trong bộ dựng hình Three.js tạo quầng sáng quanh đúng mesh đèn. Thân xe, kính, mâm, lốp, màn hình nội thất và biển số không được chọn vào bloom.
- Đèn trước trắng hơi lạnh, đèn hậu đỏ. Các mức phát sáng được cân riêng với từng nhóm đèn.
- Porsche có nhiều chi tiết dùng chung một atlas. Phần đèn trước được tách theo chỉ mục tam giác và dùng mặt nạ phát sáng lấy từ vùng projector / LED trong ảnh gốc. Không thay vị trí đỉnh hoặc hình dáng model.
- Khi đổi hãng, nút chờ model tải xong và giữ lựa chọn bật/tắt; không giữ tham chiếu vật liệu của xe cũ.

## File chính

`car-lights.js`, `studio.js`, `studio.css`, `scripts/prepare-car-lights.py`, `scripts/qa-car-lights.cjs`.

Thư viện cục bộ: model-viewer 4.4.0 (module build), Three.js 0.183.0 và model-viewer-effects 1.5.0. Dùng chung một Three.js để tránh xung đột bộ dựng hình. Giấy phép nằm trong từng thư mục `assets/vendor/`.

## Kiểm tra

Kết quả: `output/car-lights-qa.json`; ảnh bật/tắt phía trước/phía sau: `output/playwright/car-lights/`.

Kiểm tra đủ năm xe: vật liệu đèn phát sáng, chỉ mesh đèn được bloom, màu sơn/vật liệu khác không đổi, sáng dần, tắt về 0, giữ trạng thái khi đổi xe, bấm nhanh, giảm chuyển động và màn hình 390 px. Kiểm tra thêm luồng cấu hình và build tĩnh.

## Phạm vi mô phỏng

Đây là phát sáng emissive và mô phỏng quầng sáng quang học thời gian thực, không phải ray tracing hoặc mô phỏng photometric của đèn pha hãng xe. Không dựng thêm chùm sáng hình nón, không thêm hiệu ứng chiếu đường. Chưa đo hiệu năng trên điện thoại vật lý/iOS. Bộ bloom cần thêm lượt dựng hình; mobile giảm MSAA để tiết kiệm GPU.

Bản sao GLB và JS trước sửa nằm trong `output/backup-before-car-lights-20261102/`. Các file Blender gốc không bị chỉnh sửa.
