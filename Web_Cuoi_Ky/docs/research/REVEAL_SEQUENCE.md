# Corvette C7 — chuỗi khung hình mở bạt

Chuỗi này do renderer của dự án tạo từ `assets/hero.webp` và `assets/cover.webp`. Không lấy video hay chiếc xe của trang tham khảo. Ảnh nguồn được giữ nguyên.

## Giao thức tài nguyên

- Desktop: 144 ảnh WebP RGBA, 1600 × 720, `assets/reveal/frame-000.webp` đến `frame-143.webp`.
- Mobile: 144 ảnh WebP RGBA, 800 × 960, cùng tên trong `assets/reveal/mobile/`.
- Preview desktop: 144 ảnh 400 × 180 trong `assets/reveal/preview/`. Preview mobile: 144 ảnh 200 × 240 trong `assets/reveal/mobile/preview/`. Cả hai giữ đúng số thứ tự/ảnh nguồn, WebP quality 65, alpha quality 90.
- `assets/reveal/manifest.json` cung cấp URL tương đối từ thư mục gốc của website, kích thước, dung lượng, số ảnh và các mốc camera.
- Camera cố định. Khung xe cố định ở `{ x: 460, y: 210, width: 1000, height: 481.875 }` trong canvas desktop.
- Canvas có thêm 320 pixel trống phía trái, toàn bộ xe/bạt dịch cùng 320 pixel; vị trí và tỷ lệ xe trong website giữ nguyên. Khoảng trống này cho bạt đi ra ngoài viewport trước khi chạm mép canvas.
- Mobile được render riêng ở 1600 × 1920 rồi giảm còn 800 × 960, có thêm 1200 pixel nguồn phía trên. Xe và bạt cùng dịch 1200 pixel xuống; chuyển động dùng cùng tọa độ cục bộ/timing desktop. Vùng đệm giúp bạt không bị cắt ngang giữa màn hình khi bay lên. Không tạo mobile bằng cách kéo giãn ảnh desktop đã cắt.
- Poster là ảnh 000, kết thúc là ảnh 143. Thời gian quy ước 6 giây ở 24 fps; website điều khiển bằng tiến độ cuộn.

## Cách tạo chuyển động

Một mesh WebGL 72 × 36 ô mang texture bạt thật. Tension bắt đầu ở phần trước xe rồi lan đến nóc và phần sau. Mỗi đỉnh được kéo về phía trên bên trái, thu gom và tạo sóng khác nhau theo vị trí. Tính toán chiều sâu và ánh sáng theo đỉnh làm các nếp gấp thay đổi liên tục.

Xe được vẽ nguyên vẹn bên dưới ở cùng vị trí trong mọi khung hình. Bạt che xe bằng alpha của texture và chuyển động mesh, không dùng fade để làm nó biến mất. Tấm bạt rời viewport hiển thị ở 88% tiến độ; đoạn cuối giữ nguyên chiếc xe để người xem quan sát. Ảnh mobile có thể còn bạt trong vùng đệm ngoài viewport bên trái; đây là chuyển động ra khỏi màn hình, không phải lớp phủ bị xóa bằng opacity.

Đây là chuyển động bạt được dựng từ mesh có texture, không phải mô phỏng vật lý vải hoàn chỉnh hoặc video quay thật. Không thay đổi chi tiết xe giữa các khung hình.

## Tái tạo và kiểm tra

Chạy `node scripts/render-reveal.cjs`. Script dùng Chrome headless, Playwright và sharp từ runtime đã có trong máy; không cần cài thêm package hay API key.

`--prototype` chỉ xuất chín khung hình mẫu. Bản đầy đủ xuất cả desktop và mobile. Script tự tìm thời điểm bạt đã rời khỏi khung qua chênh lệch pixel so với ảnh cuối, rồi chuẩn hóa chuyển động về 88% timeline.

`--mobile-only` tạo lại mobile và giữ nguyên desktop đã xuất. `--mobile-only --proof-only` dựng lại contact sheet/manifest từ các ảnh đã có, không render lại ảnh.

Chạy `node scripts/render-reveal-previews.cjs` sau khi xuất full để tạo preview bằng Sharp, không render lại mesh. Manifest có `preview` và `mobile.preview` chứa URL, kích thước và tổng dung lượng. Website có thể giải mã trước toàn bộ preview để mỗi vị trí cuộn hiển thị đúng khung ngay, rồi dùng ảnh full khi giải mã xong. Preview giữ đúng hình chuyển động; chỉ giảm chi tiết ảnh.

Contact sheet chín mốc được lưu tại `output/playwright/reveal-sequence-proof.jpg`. `reveal-sequence-mobile-proof.jpg` cho chín mốc nhìn qua viewport 390 × 844 với đúng bố trí canvas mobile. Nó xác nhận trạng thái phủ kín, nâng bạt, lộ dần mũi xe, lộ thân xe và xe trần ở cùng camera. Việc kiểm tra tương tác cuộn và tốc độ giải mã trên website thuộc kiểm tra giao diện sau tích hợp.
