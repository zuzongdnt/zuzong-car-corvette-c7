# Corvette C7 studio — 24/10/2026

Giữ bố cục ngang và model Corvette C7 đang dùng. Video người dùng cung cấp chỉ làm
tham khảo cho nền tối, ánh sáng studio và điểm nhấn đỏ; không chép các hiệu ứng cắt cảnh.

## Thay đổi

- Nền charcoal có chiều sâu, chữ nền rõ hơn, chỉ số góc nhìn và nút Ngang thân.
- Ánh sáng HDR local 1024 × 512, 428.038 byte, tạo bằng `scripts/create-car-studio-light.py`.
  Không thêm yêu cầu mạng bên ngoài. Giữ nguyên GLB gốc.
- Điều chỉnh lớp sơn và phản xạ để giảm mảng sáng gắt. Vẫn có đủ 5 màu.
- Cuộn trang native; làm dịu tiến độ theo thời gian, chạy chậm ở đầu/cuối góc quay.
  Cache kích thước, không đọc layout trong vòng lặp animation.
- Kéo tay giữ góc đã chọn. Cuộn tiếp nối về đường camera với chuyển tiếp mềm.
  Tự xoay dùng cùng camera, dừng không reset góc. Zoom giữ nguyên khi cuộn.
- Ngừng vòng lặp khi ngoài màn hình/tab bị ẩn. Hỗ trợ reduced motion, touch pan-y,
  bàn phím và màn hình thấp. Thu ngắn khoảng cuộn từ 440 xuống 360svh trên desktop.

## Kiểm tra

- `node --check car-viewer.js`: đạt.
- `node scripts/build.cjs`: đạt; file source, HTTP và dist khớp byte.
- `node scripts/qa-car-studio.cjs`: đạt ở 1600×1000, 925×884, 390×844.
  Kiểm tra 4 góc, cuộn tới/lùi, zoom, 5 màu, giữ nguyên kính, kéo tay,
  chuyển tiếp từ kéo sang cuộn, tự xoay/dừng, thoát đoạn sticky và reduced motion.
- Touch vuốt dọc ở viewport điện thoại: đạt. Không phát hiện lỗi JavaScript hoặc tràn ngang.
- `node scripts/qa-car-recovery.cjs`: đạt; giả lập lỗi tải GLB rồi thử lại thành công,
  gallery hoạt động và không có request ra ngoài localhost.
- Kiểm tra ảnh thực tế desktop, tablet, mobile 360/390px, viewport 1920×900 và 844×390.
- Lần đo headless Chrome trên máy này có p95 requestAnimationFrame khoảng 7,2ms.
  Đây là nhịp callback của trình duyệt, không phải cam kết FPS WebGL trên mọi máy/điện thoại.
  Chưa kiểm tra trên điện thoại vật lý.

Ảnh và JSON QA: `../output/playwright/car-studio-20261024/` tính từ thư mục web.
Bản trước chỉnh được giữ trong thư mục `original/` cùng nơi.
