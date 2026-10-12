# Chỉnh ảnh xe ngày 08/10/2026

Localhost: http://localhost:4173.

## Phạm vi

- Tám góc studio được chỉnh bằng công cụ imagegen tích hợp: chính diện, hai góc trước, góc sau, góc bên, cận bánh, cận đuôi, cận nắp capo.
- Ảnh nhà chứa máy bay được chỉnh ánh sáng theo hướng hoàng hôn bên trái, phản chiếu trên sơn/kính và bóng tiếp xúc mặt đất.
- Hai ảnh ngoài trời `road.webp`, `dusk.webp` và hai video giữ nguyên.
- Những khung studio gần trùng nhau sử dụng cùng bản chỉnh của góc tương ứng: 01–03, 04–06, 07–08, 10–12, 13–14, 15–16, 17–18. Đây là tám góc ảnh riêng, không phải 18 ảnh chụp mới.
- Ảnh vẫn là sản phẩm có xử lý AI, không được mô tả là ảnh chụp nguyên bản. Các chi tiết nhỏ có thể khác nguồn.

## File

- Bản cũ: `output/image-retouch/originals/assets/`.
- PNG sau chỉnh: `output/image-retouch/generated/`.
- Ảnh so sánh trước: `output/image-retouch/before/`.
- Các file đang dùng: `assets/hero.webp`, `front.webp`, `rear.webp`, `side.webp`, `detail-wheel.webp`, `detail-tail.webp`, `view-01.webp` đến `view-18.webp`, `assets/editorial/hangar.webp`.
- Ánh xạ và kích thước thực tế: `assets/retouch-manifest.json`. `assets/manifest.json` là hồ sơ xuất ảnh ban đầu, không phải kích thước phiên bản đã chỉnh.
- Script `scripts/apply-photo-retouch.cjs` chỉ chuyển các PNG đã duyệt sang WebP quality 95, không dùng sharpening hoặc vẽ lại bằng mã.

## Prompt dùng để chỉnh

Studio: chỉnh chính ảnh Corvette có sẵn; giữ graphite, kiểu xe, bánh đen, cùm phanh đỏ, góc máy và khung hình; thay các vùng sáng loang bằng ánh sáng studio khuếch tán mềm, phản chiếu kính hợp lý, khôi phục chi tiết lốp/lưới tản nhiệt; tránh bề mặt nhựa, HDR gắt, viền sáng và lens flare; giữ nền alpha. Các ảnh cận cảnh giữ kiểu crop của nguồn.

Ngoài trời: giữ xe, nhà chứa máy bay và khung cảnh; ánh sáng ấm từ bầu trời bên trái, ánh sáng bù lạnh dịu, bóng tiếp xúc dưới bánh, phản chiếu hợp lý trên sơn và kính; tránh CGI, HDR gắt, chi tiết bịa thêm và chữ.

Prompt nguyên văn và đường dẫn ảnh đầu ra từng lần nằm ở `output/image-retouch/generation-record.json`.

## Tái xuất

Chạy lần lượt bằng Node: `scripts/apply-photo-retouch.cjs`, `scripts/render-reveal-v2.cjs`, `scripts/render-reveal-v2-previews.cjs`, `scripts/build.cjs`.
