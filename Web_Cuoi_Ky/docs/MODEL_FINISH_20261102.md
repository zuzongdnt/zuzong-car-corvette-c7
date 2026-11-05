# Hoàn thiện model xe trên web – 02/11/2026

## Thay đổi

Web dùng `model-viewer`, có bộ dựng hình Three.js bên trong. Giữ bộ điều khiển và các luồng cấu hình hiện có; cải thiện trực tiếp tài nguyên glTF/PBR và ánh sáng của bộ dựng hình.

- HDR studio mới 2048 × 1024 với softbox dài, ánh sáng cạnh và màu trung tính. Không dùng mảng đèn đỏ gây ám màu lên sơn đen.
- Sơn có lớp clearcoat riêng, độ nhám và độ kim loại phù hợp hơn; Bạc Satin có thiết lập riêng.
- Mâm kim loại và heo phanh có độ bóng riêng; lốp vẫn là cao su nhám.
- Kính có một lớp trong suốt có tint, loại bỏ lớp truyền sáng chồng; giảm phản chiếu nhiễu.
- Khôi phục lưới thân sơn BMW và Corvette từ file Blender nguồn. Không giảm lưới phần có vật liệu sơn trong các lần xuất tiếp theo.
- Sửa nội thất Lamborghini: bỏ normal map vải bị alias ở tỷ lệ tựa đầu, giữ ảnh màu; giảm phản chiếu vải/da. Tách nhẹ các lớp mặt chèn/logo tựa đầu đang giao nhau; sửa UV logo để không lặp nhiều lần.
- Sửa các vật liệu đĩa phanh Lamborghini bị mất thiết lập PBR khi xuất shader nhóm từ Blender.
- Góc mặc định đổi sang 3/4 phía trước. Giữ các nút góc nhìn, xoay tự do, thu phóng, toàn màn hình, đổi màu và lưu cấu hình.
- Giới hạn giảm độ phân giải tự động: tối thiểu 75% trên desktop và 50% trên mobile, vẫn cho phép bộ dựng hình điều chỉnh khi máy chậm.

## File chính

`studio.js`, `scripts/export-studio.py`, `scripts/polish_studio_models.py`, `scripts/create-automotive-light.py`, `assets/model/studio-automotive.hdr`, `assets/model/studio/*.glb`.

File Blender nguồn vẫn giữ nguyên. Bản GLB trước chỉnh và JS trước chỉnh nằm trong `output/backup-before-model-finish-20261102/`.

## Kiểm tra và giới hạn

Ảnh cùng góc trước/sau ở `output/playwright/finish-before/` và `output/playwright/finish-polished/`. Bộ kiểm tra model kiểm tra độc lập ba nhóm màu; bộ sitemap kiểm tra kéo xoay, thu phóng, lưu/sửa cấu hình và luồng đặt trước. Kiểm tra build tĩnh để xác nhận HDR mới được đóng gói.

Đây là model tương tác thời gian thực. Chất lượng chi tiết vẫn phụ thuộc lưới và texture của tài nguyên gốc; không tương đương bản render Cycles. Model khoảng 10–31 MB mỗi xe; việc khôi phục lưới thân làm tăng dung lượng BMW và Corvette so với bản giảm lưới. Chưa đo hiệu năng trên điện thoại vật lý hoặc iOS/Safari.

Hồ sơ nguồn và giấy phép tiếp tục ở `sources.html` và `docs/STUDIO_MODEL_SOURCES.md`.

## Sửa màu nóc BMW – 05/11/2026

Vật liệu `BMW | Mai carbon` trong GLB thiếu `baseColorFactor`, khiến nóc mặc định thành trắng. Đã đặt riêng màu graphite `#17191c` và thêm vào script hoàn thiện vật liệu để không tái phát khi xuất lại. Không sửa hình học, ảnh nhúng hoặc các vật liệu còn lại. Bản gốc được giữ tại `output/backup-bmw-roof-20261105/bmw.glb`.

`node scripts/qa-bmw-roof.cjs` đã kiểm tra đủ năm màu sơn, nóc giữ màu graphite, các vật liệu ngoài thân sơn giữ nguyên và không tràn ngang ở 1500/390/320 px. Ảnh tại `output/playwright/bmw-roof/`; kiểm tra binary và vật liệu tại `output/bmw-roof-fix.json`. Build 15 trang đã đạt. Chưa kiểm tra điện thoại thật/Safari.
