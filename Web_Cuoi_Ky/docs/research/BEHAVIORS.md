# Hành vi giao diện VANTA được khảo sát

Nguồn: https://www.draftly.space/preset-sites/vanta. Khảo sát trực tiếp bằng Chrome qua Playwright ngày 08/10/2026. Đây là tài liệu tham khảo chuyển động cho Zuzong Car Corvette C7; không phải yêu cầu sao chép nội dung VANTA.

## 1. Mở tấm bạt khi cuộn

- Hiệu ứng bạt thực tế nằm trong video `assets/video/vanta-reveal.mp4`, không phải tấm vải được mô phỏng 3D trong trình duyệt.
- Video được pause ngay khi đọc được metadata. Giá trị scroll tiến độ 0..1 ánh xạ tới `duration - 0.05` giây.
- Vòng RAF làm mượt thời gian: `current += (target - current) * 0.18`; sau đó đặt `video.currentTime = current`. Nhờ vậy cuộn ngược sẽ phủ bạt trở lại.
- Desktop từ 901px: hero cao một viewport, pin từ `top top` đến `+=260%`, `scrub:1`. Ở viewport 1440×1000, tổng không gian hero là 3600px.
- Bên dưới video có ảnh xe trần và ảnh phủ bạt làm phương án dự phòng. Ảnh bạt dịch lên −74%, phóng 1.42, mờ tới 0, blur14px; ảnh xe scale1.06 giảm về1.00.
- Trong nửa cuối timeline, từng chữ headline dịch lên và mờ đi; kicker/description biến mất từ khoảng 0.66. Cuối hero toàn cảnh mờ xuống trước khi vào bảng thông số.
- Mobile <=900px: bỏ pin, hero khoảng một viewport; video vẫn scrub từ `top top` tới `bottom top`, `scrub:0.8`. Fallback bạt dịch −60%, scale1.3. Đây là nguyên tắc hữu ích để tránh phần mở đầu quá dài trên điện thoại.
- `prefers-reduced-motion: reduce`: bỏ các timeline dài, bạt ẩn và video dừng ở frame cuối, nội dung đọc được ngay.

## 2. Các chuyển động hỗ trợ

- Header cố định: logo trái, link section phải, CTA pill. Mobile chỉ giữ logo và CTA, không có danh sách nav dài.
- Scroll progress line cam rất mỏng chạy ngang mép trên; nhãn dọc hai cạnh ở desktop được ẩn khi màn hình hẹp.
- Chữ headline lúc mở đầu: trượt từ dưới clip mask lên, stagger nhẹ từng ký tự.
- Bảng thông số: các cột fade/translate lên khi viewport chạm section; con số đếm từ 0 tới giá trị đích.
- Drive section: pin tiếp một cảnh chạy xe, scrub video, wordmark rất lớn chuyển ngang phía sau xe; canvas occluder vẽ vùng xe lên trên chữ.
- Detail gallery desktop: pin viewport và đổi cuộn dọc thành track ảnh chạy ngang. Mobile: bỏ pin, xếp thành gallery đơn giản.
- Finish chooser: nhấn swatch đổi ảnh cùng caption/metadata; ảnh mới được mở bằng `clip-path: inset(0 0 0 100%)` về `inset(0)`, scale1.06 về1.00.
- Outro: background parallax và chữ lớn hiện lần lượt. Marquee cuối trang chạy ngang lặp vô hạn.

## 3. Gợi ý áp dụng cho Corvette C7

- Giữ bối cảnh studio tối, accent đỏ Corvette, headline rất lớn cùng một từ serif italic.
- Với 18 ảnh xe đã xóa nền, có thể scrub image sequence trong hero. Thứ tự ảnh cần chọn theo góc chụp hợp lý; không gọi đó là xoay 360 độ nếu ảnh không đủ góc.
- Nếu không có video bạt riêng cho C7, dựng layer bạt SVG/CSS trên ảnh xe rồi kéo lớp bạt theo tiến độ. Phải khớp vị trí xe trước và sau để tránh cảm giác hai xe khác nhau.
- Ưu tiên nội dung ngay cả khi JS/asset chậm tải; fallback hero vẫn hiển thị xe và headline. Với thiết bị giảm chuyển động, hiển thị xe đã mở bạt.
- Không dùng video VANTA làm chiếc Corvette: model xe trong video VANTA khác Corvette C7.

## Bằng chứng

- `../design-references/vanta-desktop.png`: hero ở scroll0.
- `../design-references/vanta-scroll-1100.png`: video bạt ở giữa timeline.
- `../design-references/vanta-scroll-1900.png`: bạt đang được nhấc lên, chữ bắt đầu biến mất.
- `../design-references/vanta-mobile.png`: viewport390×844 tải mới từ đầu.
- `vanta-script.js` và `vanta-style.css`: bản source đọc được để kiểm tra cơ chế; chỉ là tư liệu nghiên cứu.
