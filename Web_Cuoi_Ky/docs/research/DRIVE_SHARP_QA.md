# Làm nét và khóa vị trí xe — 09/10/2026

Theo yêu cầu của Zuzong, bản hiện tại thay bộ ảnh trắng mờ bằng ảnh phục hồi built-in imagegen. Nguồn vẫn là đoạn đang chạy 44–49 từ ZIP Corvette C7 Z06, cùng cảnh đường giữa hàng cây. ZIP, 49 JPG nguồn và bộ WebP cũ được giữ.

Xe được phục hồi riêng thành PNG nền trong suốt từ ảnh 44. Sáu ảnh đường được phục hồi và xóa xe cũ để tránh bóng đôi. Đây là chỉnh ảnh bằng AI, có suy diễn chi tiết nhỏ, không phải khôi phục chính xác video gốc. PNG, prompt đầy đủ và provenance ở `output/image-retouch/drive-rollers-sharp/`. Bản web ở `assets/drive-rollers-sharp/`: nền desktop 1920×1080, mobile 1280×720, đều 16:9; xe WebP lossless giữ alpha và độ phân giải 1672×941.

Lớp xe dùng cùng một ảnh trong toàn bộ đoạn cuộn. Tâm thân xe, kích thước và đường tiếp xúc bánh được khóa; chỉ các nền đường chuyển mờ. Bảng alpha đo thành phần thân xe liên thông lớn nhất, bỏ các mảnh nền rời. Mức phóng nền giữ nguyên giữa các ảnh. Có bóng tiếp xúc dưới bánh. Cỡ xe giữ cách thu gọn hiện tại trên màn hình thấp. Theo góp ý tiếp theo, chữ CORVETTE nằm trong lớp media, phía trên nền đường và phía sau xe; chữ lớn chồng qua phần kính/nắp xe nhưng được xe che, vẫn trượt ngang theo cuộn. Ba card vẫn là kính blur 18px.

Kiểm tra bố cục bằng Chrome trên Windows ở 1920×1080, 1440×900, 820×871, 390×844, 360×780 và 320×568, gồm đủ sáu nền, cuộn tiến/lùi, ảnh 16:9, không tràn ngang/cắt chữ, đủ ba card và chân trang, chữ nằm sau xe và chồng lên vùng xe theo đúng thứ tự lớp, giảm chuyển động, intro phủ nền và CTA đỏ đặc. Điện thoại được mô phỏng trên PC. Báo cáo: `output/playwright/drive-scroll-qa.json`.

Kiểm tra độc lập bằng ảnh chụp trình duyệt ở 1440×900, 390×844 và 320×568: đo hình chữ nhật lớp xe trong viewport, so RGB phần bên trong thân xe ở sáu mốc và khi cuộn ngược. Viền trong suốt bị loại khỏi phép so vì phản chiếu nền thay đổi. Alpha thân xe do công cụ xuất chủ yếu 252–253, nên phép so cho phép tối đa 3 mức RGB trên thang 255; dịch vị trí tạo khác biệt lớn hơn nhiều. Vị trí/kích thước phải giữ nguyên dưới 0,01px khi khung đã được ghim. Báo cáo: `output/playwright/drive-sharp-stability.json`; ảnh `drive-sharp-pixel-*.png`.

Ảnh chụp desktop và điện thoại được xem trực tiếp để kiểm tra độ rõ, tâm xe, bóng bánh, chữ và card. Đây là hiệu ứng từ sáu nền ảnh tĩnh với lớp xe cố định, không phải phát video 60fps. Build: `node scripts/build.cjs`. Chạy lại QA khi localhost đang mở: `node scripts/qa-drive-scroll.cjs` và `node scripts/qa-drive-stability.cjs`.

Kết quả cuối sau khi đưa chữ ra sau xe: build thành công; QA bố cục đạt trên cả sáu viewport; QA ảnh chụp và cuộn liên tục đạt trên cả ba viewport. Trong 147–150 mẫu đo lúc cuộn liên tục ở mỗi viewport, vị trí và kích thước lớp xe thay đổi 0px; nền đầu/cuối khi cuộn ngược cho cùng bitmap. Không kiểm tra trên điện thoại vật lý.
