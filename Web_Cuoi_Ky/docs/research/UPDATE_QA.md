# Kiểm tra bản cập nhật logo, footer và mở bạt

Ngày 08/10/2026, Chrome trên máy Zuzong.

- Logo xuất đúng đường vector của `Tap_ve_PenTool.ai`; SHA256 file AI giữ nguyên. Header, favicon, footer dùng cùng biểu tượng.
- Các góc xe được cân lại: chính diện +2,5°, góc nghiêng −5°, phía sau +16°. Chuyển tab, phím End và chế độ giảm chuyển động đã kiểm tra.
- Footer đã kiểm tra trực tiếp ở 1440×900, 739×871, 390×844: không tràn ngang; các liên kết đúng; nút thư viện mở đủ 18 ảnh; Escape đóng và trả focus về nút.
- Giải mã đủ 576 WebP gồm 144 khung màn lớn, 144 khung điện thoại và preview tương ứng: đúng kích thước/alpha, không ảnh hỏng. Mỗi chuỗi có 123 ảnh khác nhau và 18 khung cuối giữ xe.
- Camera/xe giữ cố định. Đệm trái và đệm trên cho điện thoại loại bỏ đường cắt bạt giữa trang; đã xem ảnh tại nhiều mốc cuộn.
- Runtime đã kiểm tra cuộn tiến/lùi, thay viewport qua mốc 760px, bật/tắt reduced motion và mở `index.html` trực tiếp qua file URL. Không lỗi JavaScript.
- Bản cuối kiểm tra tại 1440×900, 768×1024, 390×844, 360×780: không ảnh hỏng, không 404, không tràn ngang. Frame mở 143, cuộn ngược về 0, menu và thư viện 18 ảnh đều hoạt động.
- Thử cuộn liên tục 180 lần cập nhật: độ lệch trung bình 1,42 khung so với tiến độ nội suy; các mốc dừng khớp khung hình. Tối đa 24 bitmap lớn và 144 preview nhỏ. Khi giảm chuyển động, cả hai cache giải mã đều rỗng.

Ảnh bằng chứng nằm trong `output/playwright/sequence-*.png`, `footer-*.png`, `leveled-after-*.png`. Các số đo chi tiết nằm trong `sequence-runtime-results.json`, `footer-qa.json`, `reveal-sequence-validation.json`.

Gói `dist/index.html` đã mở trực tiếp bằng Chrome: chuỗi ảnh lên đúng frame 143, ảnh lớn đã sẵn sàng, nút footer mở đủ 18 ảnh; không lỗi hoặc tràn ngang. ZIP đã kiểm tra CRC bằng `zipfile.testzip()`.

Chuỗi bạt là mesh có texture dựng từ ảnh, không phải video quay thật hay mô phỏng vật lý vải hoàn chỉnh. Kết quả hiệu năng được đo trên Chrome máy này; tốc độ ban đầu còn phụ thuộc thiết bị và kết nối.
