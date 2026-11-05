# Phần thông số theo cuộn — studio 5 xe

Địa chỉ duyệt: `http://localhost:4173/#performance`.

Thay cảnh Corvette drift trước đây bằng đủ 320 ảnh của bản studio V2 đã duyệt. Nguồn là các frame render gốc 1920 × 1080 tại `E:/du_dan_cuoi_ky_tkdh/output/Blender_5_Xe_Theo_Mau_V2_20261105/Final_1080p/frames`. Không thêm âm thanh.

## Hiển thị

- Cuộn xuống xem Corvette, BMW, Porsche, Mercedes rồi Lamborghini; cuộn lên xem ngược lại.
- Canvas giữ trọn khung hình và sàn phản chiếu, không phóng cắt đầu hoặc đuôi xe trên màn hình dọc.
- Tên xe, dung tích, công suất, mô-men xoắn và liên kết chi tiết đồng bộ theo xe chiếm ưu thế trên hình.
- Đường chú thích dùng các điểm được chiếu qua camera Blender cho từng frame, không đặt điểm cố định khi xe đổi góc.
- Chuyển cảnh hoà ảnh trong vùng ngắn quanh điểm cắt; vẫn giữ đủ 64 ảnh mỗi xe.
- Có nút chọn từng xe bằng chuột hoặc bàn phím. Chế độ giảm chuyển động dùng ảnh tĩnh và vẫn cho chọn đủ 5 xe.

## Tải ảnh

`assets/studio-scroll-v2/` chứa 320 ảnh desktop 1440 × 810, 320 ảnh mobile 854 × 480 và 320 ảnh xem trước 256 × 144. Tổng khoảng 15,22 MiB. Chỉ giải mã một vùng ảnh nét quanh vị trí cuộn: tối đa 14 ảnh desktop, 10 ảnh mobile. Tất cả ảnh xem trước nhẹ được tải gần lúc đến section; ưu tiên frame đầu của mỗi xe để xử lý nhảy nhanh.

Khi ảnh nét chưa sẵn sàng, giữ ảnh xem trước của cùng xe; không xóa canvas hoặc đổi sang thông số của một xe chưa hiển thị. Nội suy ảnh và tiến độ dùng vòng requestAnimationFrame hiện có của dự án; không thêm thư viện cuộn mới.

## Thông số

Dùng chung dữ liệu `vehicleSpecs` trong `studio-specs.js`, giữ đúng bản xe và đơn vị hp / PS / CV. Riêng Lamborghini, công suất là toàn hệ hybrid, 725 Nm chỉ riêng động cơ V12; ghi rõ trên chú thích. Mỗi xe có liên kết nguồn thông số.

## Tái tạo và kiểm tra

- `scripts/prepare-studio-scroll.py`: tạo đủ ba cỡ ảnh từ bản render đã duyệt.
- `scripts/export-studio-scroll-anchors.py`: xuất 320 nhóm điểm bám từ camera Blender.
- `scripts/qa-studio-scroll.cjs`: kiểm tra dữ liệu ảnh, đồng bộ xe/thông số, từng frame trong trình duyệt, cuộn ngược, nhảy nhanh, tải chậm, bố cục và giảm chuyển động.
- Kết quả và ảnh chụp: `output/playwright/studio-scroll/`.
- Build tĩnh sao chép module, CSS và toàn bộ bộ ảnh vào `dist`.

Bộ ảnh drift cũ và video/render gốc được giữ nguyên. Kiểm tra trình duyệt giả lập kích thước màn hình không thay thế kiểm tra hiệu năng trên điện thoại thật.
