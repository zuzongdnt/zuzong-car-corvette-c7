# Cấu trúc trang tham khảo VANTA

Khảo sát desktop1440×1000 và mobile390×844 trong Chrome. Chiều dài desktop khoảng17435px, mobile khoảng8050px do các vùng pin chuyển thành luồng trang thường.

| Vùng | Layout / nội dung | Chiều dài desktop khảo sát |
| --- | --- | --- |
| Header | Logo nhỏ trái, nav section phải, Reserve pill, nền trong suốt | Fixed |
| Reveal | Fullscreen studio; ảnh/video phủ bạt; headline trắng ở đáy trái; edge stats; scroll cue | 3600px gồm pin2600px |
| Specs | Kicker+headline+paragraph; bốn cột số liệu lớn, index nhỏ, đường phân cách | ~868px |
| Drive | Fullscreen cảnh xe chạy; wordmark khổng lồ dưới xe; ba thông tin bên cảnh | 4200px gồm pin3200px |
| Gallery | Heading trái; bốn slab ảnh landscape chạy ngang theo scroll | ~2826px |
| Finish | Heading; ảnh xe16:9 có corner frame; bốn swatch; mô tả và thông tin màu | ~1524px |
| Outro | Fullscreen silhouette tối; chữ UNBREAKABLE lớn; parallax background | 3200px gồm pin2200px |
| Reserve | Headline lớn, paragraph, CTA ngang rộng, ba metadata | ~841px |
| Marquee / footer | Dải chữ chạy ngang; logo; ba cột model/contact/legal | ~377px |

## Hệ thị giác

- Background: black `#000000`; surfaces `#0A0A0B`, `#101013`, `#17171B`.
- Accent: ember `#FF4D14`; trắng chính `#F4F4F2`; xám chữ `#A9A9A6` và `#8B8B88`.
- Display: Anton400, uppercase, line-height.86-.9, letter-spacing−.015em.
- Hero title: `clamp(3.1rem,11.2vw,10.6rem)`, tạo hai dòng lớn; từ nối italic Instrument Serif.
- Body: Inter300,16px,line-height1.55. Nav/kicker/metadata: Archivo500-700, tracking lớn, chữ uppercase.
- Gutters: `clamp(20px,4vw,64px)`; content max1560px.
- Chrome trực tiếp nhận diện title Anton, text Inter, nav Archivo; serif được dùng cho `<em>`.
- Ảnh/video hero dùng cover nên chiếc xe cắt đáng kể hai bên ở portrait mobile. Bản C7 nên cân nhắc layer xe contain độc lập để giữ silhouette.

## Topology nên có cho Zuzong Car

1. Hero C7 có scrub mở bạt hoặc image sequence, headline thương hiệu Zuzong Car.
2. Mốc thông số lấy theo đúng phiên bản C7 được chọn; tránh dùng số liệu hư cấu VANTA.
3. Một fullwidth gallery cảnh xe, typography lớn, parallax nhẹ.
4. Detail gallery bằng ảnh người dùng: đèn, mâm, góc xe, thân xe.
5. Màu xe hoặc gallery selector chỉ thay đổi giao diện local.
6. CTA xem bộ sưu tập hoặc trải nghiệm, footer Zuzong Car.

Đây là website giao diện theo yêu cầu, không tự tạo hệ thống bán xe, gửi form hoặc thanh toán.
