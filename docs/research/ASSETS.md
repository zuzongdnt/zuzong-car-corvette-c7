# Tài nguyên Zuzong Car — Corvette C7

Ngày chuẩn bị: 08/10/2026. Đây là các tài nguyên dùng cục bộ cho giao diện HTML/CSS/JS.

## Ảnh xe do Zuzong cung cấp

Nguồn: `output/xe_4k/xe_01_4K.png` đến `xe_18_4K.png` (18 PNG có alpha, 2160 × 3840). Bộ PNG này là kết quả xóa nền và nâng nét trước đó; chi tiết do AI xử lý có thể khác ảnh ban đầu.

Script `scripts/prepare-assets.cjs` không viết lại PNG gốc. Với từng ảnh, script tìm giới hạn điểm ảnh alpha > 8/255, thêm 24 px khoảng trống quanh nội dung, sau đó tạo WebP có alpha. Cách này bỏ khoảng nền trong suốt quá lớn nhưng giữ toàn bộ xe/chi tiết đang có trong nguồn.

| Asset giao diện | PNG nguồn | Kích thước | Dung lượng |
|---|---|---:|---:|
| `assets/hero.webp` | `xe_05_4K.png` | 1600 × 771 | 145.1 KB |
| `assets/front.webp` | `xe_07_4K.png` | 1200 × 913 | 137.0 KB |
| `assets/rear.webp` | `xe_10_4K.png` | 1200 × 631 | 93.2 KB |
| `assets/side.webp` | `xe_15_4K.png` | 1200 × 970 | 103.5 KB |
| `assets/detail-wheel.webp` | `xe_17_4K.png` | 1200 × 1308 | 178.7 KB |
| `assets/detail-tail.webp` | `xe_13_4K.png` | 1200 × 1873 | 201.1 KB |

`assets/view-01.webp` đến `assets/view-18.webp` tương ứng đủ 18 PNG nguồn, rộng 1200 px. `assets/manifest.json` ghi đường dẫn nguồn, giới hạn cắt alpha, kích thước và số byte của từng bản xuất. `assets/contact-sheet.jpg` là bản kiểm tra 18 góc ảnh trên nền tối; đã mở xem để xác minh việc cắt bỏ khoảng nền dư không cắt thêm xe.

Lưu ý bộ nguồn có những góc gần trùng nhau và một số ảnh cận cảnh. Đây là bộ ảnh trưng bày, không phải chuỗi khung hình chụp vòng 360 độ đều nhau.

Các bản xuất ban đầu cũng còn trong `assets/images/` để bảo toàn mọi file đã tạo. Giao diện dùng các asset trực tiếp trong `assets/`.

## Logo riêng của Zuzong

Header, favicon và footer dùng vector xuất trực tiếp từ `C:/Users/zuzong/OneDrive/Pictures/tkdh/Logo_PenTool_Zuzong/Tap_ve_PenTool.ai`. Các đường Pen Tool giữ nguyên hình học, chỉ đổi màu: `assets/zuzong-logo.svg` màu ivory và `assets/zuzong-logo-red.svg` màu đỏ. Favicon dùng cùng vector đỏ. Không sửa file AI gốc; SHA256 trước/sau: `9E643ACC84F45D08C9BDC50019F21F8574F087E39D66FB3063E4E3E1D982B833`.

## Chuỗi khung hình mở bạt

144 WebP cho màn lớn và 144 WebP dành cho điện thoại trong `assets/reveal/`. Chuỗi được dựng từ `hero.webp` và ảnh bạt riêng bằng mesh WebGL; thông số, nguồn và cách tái dựng tại `REVEAL_SEQUENCE.md`. Đây là ảnh đã dựng, không dùng video từ website tham khảo.

## Logo Corvette C7 thứ cấp

Asset dùng: `assets/c7-logo.webp`, 600 × 338 px, 38.4 KB, có alpha trong suốt. Nguồn PNG tải về: `assets/logos/c7-flags-original.png`, 1919 × 1081 px. Chỉ thu nhỏ và đổi sang WebP; không vẽ lại biểu tượng. Đã kiểm tra alpha góc bằng 0 và mở xem bản kết quả. Hình có crossed flags góc cạnh dạng V cùng wordmark CORVETTE, phù hợp với nhận diện C7.

- Trang nguồn: [KindPNG — Transparent Logo Chevrolet PNG / Corvette C7 Logo](https://www.kindpng.com/imgv/oJiwbb_transparent-logo-chevrolet-png-corvette-c7-logo-png/).
- Tệp PNG gốc: [kindpng_832827.png](https://www.kindpng.com/picc/b/83-832827_logo-chevrolet-png.png).
- Người đăng được trang nguồn ghi: James Booth. Trang ghi “Personal Use Only”. Logo Corvette/Chevrolet thuộc chủ sở hữu nhãn hiệu tương ứng. Asset này dùng cho bài tập/trưng bày cá nhân; nguồn không cấp quyền sử dụng thương mại.

Các tệp `assets/logos/corvette-reference.png` và `corvette-flags.svg` tải từ [Brandlogos](https://brandlogos.net/corvette-chevrolet-36231.html) chỉ để so sánh. Bản đó có vòng tròn thuộc nhận diện đời cũ, **không dùng trong giao diện C7**. `assets/logos/c7-flags.png` là preview KindPNG với nền xám trắng, cũng không dùng trong giao diện; bản dùng lấy từ tệp PNG gốc có alpha.

## Font cục bộ

Giao diện tải `assets/fonts/fonts.css`. CSS này có đủ subset Latin và Vietnamese, không cần gửi yêu cầu Google Fonts khi mở website.

- **Barlow Condensed**, weight 600, 700, 800, dùng cho tiêu đề: [Google Fonts](https://fonts.google.com/specimen/Barlow+Condensed). Sáu WOFF2 cho hai subset, ba weight.
- **Manrope**, weight 400, 500, 600, 700, dùng cho nội dung: [Google Fonts](https://fonts.google.com/specimen/Manrope). Hai WOFF2 dùng chung theo các weight trong CSS Google Fonts.
- CSS nguồn: [Google Fonts CSS2](https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap).
- URL chính xác từng WOFF2 lưu trong `assets/fonts/source.json`.
- Bản giấy phép SIL Open Font License nằm trong `assets/fonts/barlow-condensed-OFL.txt` và `assets/fonts/manrope-OFL.txt`, lấy từ [kho Google Fonts](https://github.com/google/fonts/tree/main/ofl).

## Tái tạo asset

Chạy bằng Node bundled trên máy Zuzong:

```powershell
& 'C:\Users\zuzong\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'E:\du_dan_cuoi_ky_tkdh\scripts\prepare-assets.cjs'
```

Script dùng Sharp bundled. Lần chạy cần mạng để tải CSS/font Google; ảnh WebP được tạo từ PNG cục bộ. Logo đã tải sẵn và có nguồn được ghi ở trên.
