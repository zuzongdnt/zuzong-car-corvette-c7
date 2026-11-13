# Bộ ảnh chi tiết 5 xe và logo hãng tại footer — 02/11/2026

## Nội dung

Phần `#details` đổi từ ba ảnh Corvette sang năm khung hình:

1. Chevrolet Corvette C7: mâm đen và phanh vàng, ảnh Cool Classic Club.
2. BMW M4 G82: đèn trước và lưới tản nhiệt, ảnh BMW Group PressClub.
3. Porsche 911 GT3 (992): cánh gió và đèn hậu trên đường đua, ảnh Porsche AG / Porsche Newsroom.
4. Mercedes-AMG SL Roadster: nội thất sáng màu và đường chỉ may, ảnh Mercedes-Benz USA.
5. Lamborghini Revuelto: đầu xe và đèn chữ Y, ảnh Automobili Lamborghini.

Ảnh tham khảo có thể khác màu hoặc phiên bản cấu hình trong studio. Không tạo chi tiết bằng AI hoặc đổi màu ảnh. Mỗi ảnh có bản WebP 1536 × 1024 và 768 × 512. Tổng dung lượng 10 ảnh khoảng 793 KiB.

Nguồn, URL ảnh gốc, SHA256 và thao tác xử lý nằm trong `assets/details-five/sources.json`; trang `sources.html` có ghi công và liên kết nguồn. Chưa xác minh giấy phép mở cho các ảnh; không tuyên bố quyền sử dụng thương mại.

## Hiệu ứng và tương tác

- Giữ hiệu ứng ghim màn hình, chuyển ngang theo cuộn, phóng nhẹ khi rê chuột, nút trước/sau và phím trái/phải.
- Bộ đếm 01–05. Thanh tiến trình rộng 20%, di chuyển hết thanh ở khung cuối.
- Tăng chiều dài vùng cuộn từ 235svh lên 370svh trên desktop để năm khung có nhịp xem tương đương bản ba khung.
- Ảnh và tên từng xe mở đúng trang `product.html?car=...`.
- Điện thoại tiếp tục xếp ảnh dọc; chế độ giảm chuyển động tiếp tục dùng lưới tĩnh.

## Footer

Đủ logo Chevrolet, BMW, Porsche, Mercedes-Benz và Lamborghini bên cạnh tên, chủ thể quyền và liên kết chính thức. Ảnh logo lưu cục bộ trong `assets/brands`; nguồn tại `assets/brands/sources.json`.

Chevrolet, Mercedes-Benz và Lamborghini dùng tài nguyên từ website chính thức. BMW và Porsche dùng bộ logo VehicleSpecs; riêng Porsche bỏ hình chữ nhật trắng phía sau để hiển thị trên nền tối, giữ nguyên đường nét và màu huy hiệu.

## Xác minh

- Build `node scripts/build.cjs` thành công và sao chép hai thư mục tài nguyên mới vào `dist`.
- Kiểm tra thực tế trên Chrome: cuộn đến cả năm khung, vị trí ghim, bộ đếm, điểm cuối thanh tiến trình, nút, phím, liên kết sản phẩm, logo footer và chế độ giảm chuyển động.
- Kiểm tra lại 15 trang ở 1440, 390 và 320 px: 45 lượt kiểm tra đều đạt, không có lỗi JavaScript hoặc tràn ngang.
- Ảnh QA trong `output/playwright/five-*`; kết quả `five-car-details-qa.json` và `zephyron-brand-qa.json`.
- Bản sao trước sửa: `output/Five_Car_Details_20261102/Truoc_Khi_Them_5_Xe.zip`.

Kiểm tra ở trình duyệt cục bộ; chưa triển khai hosting hoặc quan sát trên điện thoại vật lý.
