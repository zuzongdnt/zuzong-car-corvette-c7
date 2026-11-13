# Thanh điều hướng kính lỏng và thông số theo xe

Ngày: 03/11/2026. Các yêu cầu mới thay thế cách ẩn toàn bộ header trước đó.

## Giao diện

- Trong intro, nav và logo luôn hiện, tương tác bàn phím bình thường. Nền header trong suốt, không có lớp kính/blur. Chữ và logo đổi trắng để đọc trên video.
- Khi rời intro, header có lớp kính lỏng sáng. SVG `feTurbulence`, `feGaussianBlur` và `feDisplacementMap` làm méo điểm ảnh của nền phía sau; chỉ lớp nền bị khúc xạ, chữ điều hướng vẫn rõ. Có blur dự phòng khi trình duyệt không hỗ trợ SVG backdrop filter.
- Khối chữ intro rộng tối đa 560 px thay vì 820 px, tiêu đề tối đa 60 px thay vì 96 px. Trên điện thoại giảm tương ứng, giữ đủ khoảng trống với logo.

## Thông số và count-up

`studio-specs.js` tạo bảng ngay dưới studio, cập nhật theo xe đang chọn trên trang chủ, trang sản phẩm và trang chi tiết. Hiển thị động cơ, dung tích, kW, mã lực và mô-men xoắn.

Số tăng từ 0 đến giá trị cuối trong 1,1 giây bằng requestAnimationFrame và easing cubic. Chỉ chạy khi bảng vào vùng nhìn; đổi xe nhanh hủy chuyển động cũ. Đổi màu sơn không chạy lại số. Chế độ giảm chuyển động hiển thị giá trị cuối ngay. Screen reader nhận mô tả giá trị cuối, không đọc từng bước đếm.

| Xe tham khảo | Động cơ | kW | Mã lực theo nguồn | Nm |
| --- | --- | --- | --- | --- |
| C7 Stingray tiêu chuẩn 2019 | V8 LT1 6.2L | 339 | 455 hp | 624 |
| M4 G82 tiêu chuẩn 2021 | I6 S58 3.0L | 353 | 480 PS | 550 |
| 911 GT3 992.1 2021 | Boxer 6 4.0L | 375 | 510 PS | 470 |
| AMG SL 63 R232 V8 | V8 4.0L biturbo | 430 | 577 hp | 800 |
| Revuelto 2023 | V12 6.5L + 3 mô-tơ | 747 | 1.015 CV | 725 riêng V12 |

Ký hiệu hp, PS và CV giữ theo nguồn; không coi các đơn vị này là đồng nhất. kW và Nm của C7/SL63 được làm tròn từ số liệu hp và lb-ft, dùng 1 hp = 0,745699872 kW và 1 lb-ft = 1,355817948 Nm. Với Revuelto, công suất là toàn hệ hybrid; mô-men 725 Nm chỉ riêng V12.

Nguồn hãng/ấn phẩm do hãng phát hành:

- [Chevrolet — brochure Corvette 2019](https://cdn.dealereprocess.org/cdn/brochures/chevrolet/2019-corvette.pdf), bản Stingray tiêu chuẩn 455 hp/460 lb-ft. [Bản mirror của cùng brochure](https://www.corvsport.com/wp-content/uploads/2019/09/2019-Corvette-Sales-Brochure_compressed.pdf).
- [BMW — thông số M4 Coupé 03/2021](https://www.press.bmwgroup.com/global/article/detail/T0326324EN/specifications-of-the-bmw-m4-coupe-and-the-bmw-m4-competition-coupe-valid-from-03/2021), và [thông cáo ra mắt động cơ S58](https://www.press.bmwgroup.com/brazil/article/detail/T0317665PT/bmw-apresenta-os-novos-m3-sedan-e-m4-coup%C3%A9?language=pt).
- [Porsche — press kit 911 GT3 992.1](https://newsroom.porsche.com/dam/jcr%3Afb50dab0-0b3d-4b2d-b4d7-70e42fc381cf/PAG_992_GT3_EN.pdf).
- [Mercedes-Benz — SL R232, thông cáo và bảng kỹ thuật](https://media.mbusa.com/news/the-new-mercedes-amg-sl-the-new-edition-of-an-icon).
- [Lamborghini — Revuelto](https://www.lamborghini.com/en-en/models/revuelto-models/revuelto), [brochure kỹ thuật, trang 31](https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/revuelto/brochure/LB744_REVUELTO_DIGITAL_BROCHURE_ITA.pdf).

Đây là thông số của các phiên bản ghi rõ, không khẳng định đo từ model 3D hay bộ phận tùy chỉnh trong đồ án. Mỗi bảng có liên kết tới nguồn tham khảo.

## Kiểm tra

- `node scripts/qa-liquid-specs.cjs`: bốn kích thước màn hình, nav luôn hiện, intro trong suốt, khúc xạ SVG, số cuối của đủ năm xe, số trung gian khi đếm, đổi nhanh và giảm chuyển động.
- `output/playwright/liquid-specs/refraction-enabled.png` và `refraction-disabled.png`: cùng một mẫu sọc cố định phía sau header, so khi bật/tắt SVG displacement để xác minh có khác biệt điểm ảnh.
- `node scripts/qa-sitemap.cjs`: các tương tác studio, giỏ đặt trước, tài khoản và thư viện ảnh.
- Chrome đã quan sát; điện thoại thật và Safari chưa được kiểm tra.
