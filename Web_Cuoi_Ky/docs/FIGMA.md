# Toàn website trong Figma

[Mở thiết kế](https://www.figma.com/design/mP8YcskwybL8XuwBECSwnV/Sans-titre?node-id=37-174)

[Bấm thử toàn website](https://www.figma.com/proto/mP8YcskwybL8XuwBECSwnV/Sans-titre?page-id=39%3A17&node-id=39-18&starting-point-node-id=39%3A18&scaling=scale-down&content-scaling=fixed)

- Page 01–04 chứa đủ Studio, Hành trình, Thước phim, Bộ sưu tập. Mỗi page có bản máy tính 1440px và điện thoại 390px. Chữ, ảnh, bố cục và các component chỉnh sửa được.
- Page `00 / CH?Y TH? WEBSITE` có hai luồng bấm thử: máy tính và điện thoại. Menu, liên kết chuyển trang và các nút cuộn đã nối. Thanh đầu trang và thanh điều hướng điện thoại giữ cố định khi cuộn.
- Chỉnh component `Zuzong / Full website / ...` trên page 01–04 để cập nhật instance tương ứng trong bản bấm thử. Các header, footer, nút và ảnh lặp lại có component riêng.
- Video mở qua liên kết localhost nên cần chạy `node server.cjs`. Hiệu ứng mở bạt, cuộn ảnh và xe 3D tiếp tục chạy trên website. Bộ lọc và cửa sổ phóng ảnh vẫn hoạt động đầy đủ trên web; bản Figma hiện lưu bố cục bộ ảnh.
- Code và Figma chưa tự đồng bộ hai chiều. Khi sửa website, cần cập nhật lại phần tương ứng trong Figma.

Ánh xạ file, component và prototype: `output/figma/site/connection.json`.

Đã kiểm tra đủ 8 bố cục, 8 section Studio trên mỗi thiết bị, 21 ảnh Bộ sưu tập, font Manrope và Barlow Condensed, 149 tương tác với đích hợp lệ. Ảnh chụp toàn trang và bản bấm thử nằm trong `output/figma/site/`.

N?u Figma b?o ?M?u th? ph?i bao g?m ?t nh?t m?t khung?: m? page `00 / CH?Y TH? WEBSITE`, ch?n khung `B?M CH?Y / Studio / M?y t?nh` r?i b?m ?. C?c page 01?04 ch?a component ?? ch?nh thi?t k?, kh?ng d?ng l?m trang b?t ??u Present. Ho?c d?ng li?n k?t ?B?m th? to?n website? ph?a tr?n.
