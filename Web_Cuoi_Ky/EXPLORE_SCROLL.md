# Khám Phá ZEPHYRON

Mở thư mục `C:\Web_Cuoi_Ky` trong VS Code, chạy `npm start` và mở `/explore.html` tại địa chỉ máy chủ in trong Terminal. Có thể mở qua Live Server nếu đã cài tiện ích này. Ba tệp giao diện là `explore.html`, `explore-scroll.css` và `explore-scroll.js`. Trang dùng ảnh WebP và điều hướng chung của đồ án.

## Kịch bản cuộn

| Đoạn | Tín hiệu cuộn | Hình ảnh và nội dung |
| --- | --- | --- |
| Hero | Từ đầu trang đến khi cuộn qua khoảng 48% chiều cao hero | Ảnh bộ sưu tập thu từ 114% về 100%, có dịch dọc nhẹ. Khối chữ tăng độ đậm từ 78% lên 100%. Nút bên dưới đưa thẳng tới bộ sưu tập. |
| Bộ sưu tập | Khung thẻ chạm mép dưới thanh điều hướng | Khung ghim tại chỗ. Cuộn dọc kéo đường thẻ theo chiều ngang và cập nhật thanh tiến độ. |
| Năm mốc | 0%, 25%, 50%, 75%, 100% của đoạn ghim | Mercedes-AMG SL 63 → BMW M4 G82 → Porsche 911 GT3 → Lamborghini Revuelto → Corvette C7. Ảnh, tên xe, thông điệp và bốn thông số nằm trên cùng một thẻ. |
| So sánh | Khung thẻ nhả ghim sau Corvette | Từng hàng công suất, 0–100 km/h, động cơ, hộp số và tiếng pô hiện lên khi vào vùng nhìn. Các hàng cùng vào khung chạy lệch nhau 65 ms. Dòng tiếng pô dùng mô tả chất âm. |
| Xem thêm | Cuộn qua bảng so sánh | Các lối sang Thước phim, Hành trình, Studio 3D và các trang liên quan. |

Trên điện thoại, vuốt ngang trực tiếp để chuyển thẻ. Trên desktop, khi vùng thẻ có tiêu điểm, dùng phím mũi tên trái và phải để chuyển xe. Chế độ giảm chuyển động xếp thẻ theo chiều dọc và tắt hiệu ứng cuộn.

## Công nghệ

Bản này dùng CSS thuần và JavaScript thuần. CSS sticky giữ khung, transform dịch ảnh và thẻ, requestAnimationFrame gom cập nhật trong mỗi khung hình, IntersectionObserver kích hoạt hiệu ứng từng hàng. Cuộn bằng chuột và cảm ứng giữ hành vi của trình duyệt. Liên kết nội trang dùng cuộn mượt CSS.

Nếu mở rộng sang nhiều góc quay hoặc đồng bộ mô hình 3D, GSAP + ScrollTrigger là lựa chọn phù hợp để quản lý các đoạn pin và scrub trên cùng timeline. Lenis có thể bổ sung quán tính cuộn nếu thiết kế cần nhịp đó. Framer Motion phù hợp khi trang được triển khai trong React.
