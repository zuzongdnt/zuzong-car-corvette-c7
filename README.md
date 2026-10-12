# Zuzong Car — The visual collection

Website HTML, CSS và JavaScript thuần. Font, ảnh và video được lưu trong dự án; không cần npm install hay API.

## Mở website

Chạy `node server.cjs` trong thư mục dự án rồi mở http://localhost:4173.
Cũng có thể mở trực tiếp `index.html` bằng Chrome/Edge; máy chủ cục bộ hỗ trợ tua video bằng HTTP Range.

## Bốn trang

- `index.html` — Studio: lời giới thiệu xuất hiện trước; cuộn tiếp mới hiện xe phủ bạt, sau đó mở bạt bằng cuộn tiến/lùi. Phía dưới là hiệu năng, chi tiết, đổi góc xe và lối vào các trang mới.
- `experience.html` — Hành trình: ba ảnh được kể thành ba chương; ảnh giữ vị trí khi cuộn trên desktop, bố cục dọc trên điện thoại.
- `films.html` — Thước phim: hai video người dùng cung cấp, giữ khung hình ngang, âm thanh gốc và bộ điều khiển. Mặc định tắt tiếng; video chỉ tải gần vị trí xem hoặc khi bấm phát.
- `gallery.html` — Bộ sưu tập: ba ảnh mới và 18 ảnh studio, mở lớn, chuyển bằng phím trái/phải, đóng bằng Escape.

## Intro video và đổi chủ đề

Intro đầu trang dùng video `assets/campaign/intro-fullbleed.mp4`, được xuất từ `D:/tải xuống/snaptik.vn_7601037660601273613.mp4`. Bản web cắt hai dải đen có sẵn trong video để phủ kín phía sau thanh điều hướng trong suốt. Bản gốc và bản `intro.mp4` giữ nguyên. Video nền tự phát không tiếng, lặp lại, có nút phát/tạm dừng, tự dừng khi ra ngoài màn hình; nếu bật giảm chuyển động thì dùng poster cho tới khi người xem chủ động phát. Cuộn hết intro thì thanh điều hướng trở lại nền kính tối. Bên dưới intro là banner mở bạt riêng.

**Chỉ sửa `campaign-config.js` để đổi nội dung intro**, rồi tải lại trang:

- `videoSrc`, `posterSrc`: đường dẫn video và ảnh dự phòng, nên đặt trong `assets/campaign/` để được chép vào bản build.
- `logoSrc`, `logoAlt`: logo xuất hiện trước tên chủ đề và cạnh tiêu đề trong thẻ; để trống `logoSrc` để ẩn.
- `brandName`, `intro`: tiêu đề lớn và lời giới thiệu bên trái.
- `badge`, `title`, `subtitle`, `description`: nội dung thẻ kính bên phải.
- `ctaText`, `ctaHref`: nhãn và liên kết nút. Hiện dùng `#unveil` để đi tới mở bạt. Nếu để trống liên kết, banner hiện ghi chú cần điền và ẩn nút.
- `stats`: tối đa hai mục `{ value, label }`. Mặc định `[]` vì không có số liệu đầu vào; không tự thêm thông số.
- `accentColor`: màu nhấn; `message`: thông điệp góc dưới bên phải.
- `videoPosition`: vị trí chủ thể, ví dụ `'50% 50%'`, hoặc `{ desktop: '50% 50%', mobile: '55% 50%' }`.

Mẫu dùng HTML/CSS/JavaScript thuần trong `campaign.html`, `campaign.css`, `campaign.js`. Font và video tải tại máy; không cần thư viện ngoài. Trên điện thoại, thẻ kính nằm dưới tiêu đề và nội dung, chiều cao banner tự tăng nếu chữ dài. Cấu hình đổi nội dung chỉ tác động intro; phần Studio bên dưới là nội dung riêng của website hiện tại.

Sau khi chỉnh, chạy `node scripts/build.cjs` để cập nhật `dist/`. Kiểm tra intro bằng `node scripts/qa-campaign.cjs`, các góp ý mới bằng `node scripts/qa-review-comments.cjs`; ảnh chụp và báo cáo nằm trong `output/playwright/`. Tiêu đề Studio trên desktop dùng chữ lớn hai dòng phủ lên vùng ảnh theo ảnh tham chiếu Zuzong cung cấp; trên điện thoại chữ nhỏ lại.

## Mở bạt và responsive

Phần `#performance` dùng cảnh đường từ 6 ảnh liên tiếp số 44–49 trong ZIP `D:/tải xuống/Corvette C7 Z06 #3 _ 4k Roller Cinematic_1080p60_0001.zip`. Đây là đoạn cuối xe C7 Z06 màu trắng đang chạy, nhìn chính diện giữa hàng cây; bỏ các cảnh đỗ xe và đổi góc quay. ZIP có 49 ảnh 1920×1080, bản giải nén được giữ trong `output/drive-roller-source/`. Theo yêu cầu làm nét, bản hiện tại được phục hồi bằng built-in imagegen: tách xe thành một lớp nền trong suốt, phục hồi sáu ảnh đường và xóa xe nhỏ trong các nền này. Chi tiết nhỏ bị mất được AI suy diễn; đây không phải khôi phục chính xác dữ liệu video gốc. Ảnh nền web giữ 16:9: 1920×1080 cho máy tính, 1280×720 cho điện thoại.

`assets/drive-rollers-sharp/alignment.json` lưu tâm thân xe và điểm bánh chạm đường đo từ alpha của ảnh phục hồi. Lớp xe dùng cùng một ảnh ở mọi mốc, khóa tâm, chiều rộng và điểm bánh chạm đường; chuyển mờ chỉ tác động cảnh đường phía sau. Nền đường dùng cùng mức phóng ở cả sáu ảnh. Xe rộng tối đa 500px trên desktop và tự thu gọn để chừa tiêu đề trên màn hình thấp. Bóng tiếp xúc dưới bánh giữ xe bám mặt đường. Chữ CORVETTE nằm phía sau xe, chồng qua vùng kính/nắp xe và được xe che; ba card giữ blur 18px. Tiến độ cuộn làm dịu 75ms, đổi nền chuyển mờ 110ms rồi kết thúc ở một ảnh. Sáu nền được giữ trong bộ đệm để cuộn ngược trả lại cùng bitmap. Đây là chuỗi ảnh tĩnh kết hợp lớp xe cố định, không phải video 60fps. Bản điện thoại chừa thanh điều hướng; giảm chuyển động dùng cảnh tĩnh với đủ thông số.

- `drive-scroll.css`, `drive-scroll.js`: bố cục và chuyển ảnh theo cuộn.
- `assets/drive-rollers-sharp/manifest.json`: ZIP nguồn, SHA-256, số ảnh được chọn, nguồn ảnh phục hồi và kích thước bản web.
- `output/image-retouch/drive-rollers-sharp/`: PNG phục hồi, prompt, provenance và bảng đo alpha. `scripts/prepare-drive-sharp.cjs` tạo bản web từ những PNG này; không gọi lại AI. Cấu hình chiều rộng xe ở `sections.html`.
- Bộ ảnh trắng trước phục hồi vẫn ở `assets/drive-rollers/`; `scripts/prepare-drive-rollers.cjs` vẫn tạo riêng bộ cũ từ ảnh gốc.
- Bộ ảnh đen trước đó vẫn nằm ở `assets/drive-snaptik/`, 11 PNG đã chỉnh và kết quả imagegen giữ trong `output/image-retouch/snaptik-drive/`; công cụ cũ `scripts/prepare-snaptik-drive.cjs` vẫn được giữ. Bộ Seedance nằm ở `assets/drive/`.
- `node scripts/qa-drive-scroll.cjs`: kiểm tra desktop, điện thoại và giảm chuyển động, đủ sáu nền, cuộn tiến/lùi và chữ nằm sau xe; ảnh chụp ở `output/playwright/drive-sharp-*.png`.
- `node scripts/qa-drive-stability.cjs`: so pixel thân xe trên ảnh chụp thật của trình duyệt ở desktop/điện thoại khi cuộn tiến và lùi. Hồ sơ: `docs/research/DRIVE_SHARP_QA.md`.

Video intro dùng `assets/campaign/intro-fullbleed.mp4` và ảnh dự phòng tương ứng để bỏ viền đen của nguồn, với `object-fit:cover` phủ nền màn hình. Nút “Khám phá C7” màu đỏ đặc, không có blur. Bản `intro.mp4` trước đó được giữ lại.

Bộ mở bạt hiện tại dùng 10 ảnh JPG do Zuzong cung cấp trong thư mục `Corvette_C7_mo_bat_studio_10s_0001`, chuyển sang WebP và chuyển mờ theo tiến độ cuộn. Đây là chuỗi ảnh tĩnh, không phải video 10 giây. Ba mốc nội dung Ẩn mình, Hé lộ, Bứt phá thay đổi cùng thao tác cuộn tiến/lùi. Bản điện thoại dùng ảnh có độ phân giải riêng, giữ nguyên tỷ lệ và toàn bộ khung hình nguồn.

Trang tôn trọng `prefers-reduced-motion`: xếp lời giới thiệu trước ảnh xe đã mở bạt theo bố cục tĩnh. Điện thoại dùng cuộn dọc tự nhiên, menu gọn, nút thao tác đủ lớn; video không tự bật âm thanh. Chữ tự xuống dòng; desktop đặt ảnh xe phía sau tiêu đề lớn, điện thoại xếp ảnh và chữ thành các khối riêng. Studio không có nút hoặc hiệu ứng âm thanh.

Ô Thước phim ở cuối trang chủ tự phát `assets/editorial/film-road.mp4` không tiếng khi xuất hiện trên màn hình, có nút phát/tạm dừng và tự dừng khi ra khỏi vùng xem. Với giảm chuyển động, người xem chủ động bấm phát. Nút “Xem phim” dẫn sang trang video đầy đủ.

## Chỉnh sửa

- `car-viewer.js`, `car-viewer.css`: sân khấu 3D trong `#collection`, ghim cả xe và bảng điều khiển trong một section cuộn riêng. Khoảng cuộn `--car-travel:440svh` cho xe quay chậm từ chính diện 0° qua thân xe đến phía sau 180°, dừng nhẹ ở hai đầu rồi mới rời section. Tăng biến này để quay chậm hơn. Cuộn ngược để xem lại; mức zoom được giữ nguyên khi cuộn. Kéo để xoay thủ công, chỉ dùng nút +/− để thu phóng. Cuộn tiếp sẽ trở lại hành trình trước–sau; các nút góc nhìn đưa trang đến mốc tương ứng trong section. Năm màu sơn tác động riêng vật liệu `Car Paint`, mặc định đen. Bật giảm chuyển động sẽ bỏ ghim và chuyển thành khung xe tĩnh có điều khiển thủ công. Kiểm tra bằng `node scripts/qa-car-pinned.cjs`.
- `assets/model/corvette-c7.glb`: model chạy trên web, giữ toàn bộ khoảng 1,07 triệu tam giác. Nguồn FBX và texture giải nén nằm trong `assets/model/corvette-c7/`; bản ZIP gốc không thay đổi. `assets/model/manifest.json` ghi nguồn, giấy phép và các chỉnh sửa. Model và thư viện đều phục vụ từ localhost, không cần CDN khi mở web.
- `scripts/prepare-corvette.py`: chuyển FBX bằng Blender 4.5 qua Python, nối lại texture và dựng lại kính/đèn từ các vật liệu FBX. Chạy bằng `E:/CodexHome/tools/python311/python.exe scripts/prepare-corvette.py` trên máy này. Bốn texture tham chiếu bị thiếu trong ZIP được thay bằng thông số vật liệu, ghi trong manifest. Model ghi công Martin Trafas và CC BY ngay dưới sân khấu.
- `scripts/prepare-intro-fullbleed.py`: tạo bản video bỏ dải đen và poster tương ứng.
- `scripts/qa-car-viewer.cjs`: kiểm tra model thật tải được, đổi màu, bảo toàn màu kính, đổi góc, kéo xoay, thu phóng, giảm chuyển động và header trong suốt. Kết quả tại `output/playwright/model-*`.

- `bottom-nav.js`, `bottom-nav.css`: thanh điều hướng dưới màn hình cho cả bốn trang ở chiều rộng tối đa 760px; nền kính tối, biểu tượng nét mảnh, chữ sáng và mục hiện tại màu đỏ theo tông website. Nhãn và liên kết chỉnh trong mảng `items`.
- `hero.html`, `hero.css`, `app.js`, `reveal-sequence.js`: Studio và bạt.
- `sections.html`, `sections.css`, `sections.js`, `journal.css`: các phần dưới Studio và liên kết sang trang mới.
- `experience.html`, `films.html`, `gallery.html`, `editorial.css`, `editorial.js`: các trang mới.
- `assets/editorial/`: ảnh/video đã nén; `manifest.json` ghi nguồn và thông số.
- `assets/reveal-studio/`: chuỗi mở bạt đang sử dụng. Các bộ cũ được giữ trong dự án.
- `scripts/import-studio-sequence.cjs`: nhập lại 10 ảnh nguồn khi cần.
- `scripts/assemble.cjs`: ghép hero + sections thành index.html. Sau khi sửa hai nguồn này, chạy `node scripts/assemble.cjs`.

## Build và kiểm tra

- `node --check app.js` (tương tự cho `sections.js`, `reveal-sequence.js`, `editorial.js`, `server.cjs`): kiểm tra cú pháp JavaScript.
- `node scripts/build.cjs`: tạo website tĩnh trong `dist/` và xác minh liên kết/tài nguyên của cả bốn trang.
- `output/playwright/`: ảnh chụp và kết quả kiểm tra trên Chrome.
- `docs/research/UPGRADE_V2_QA.md`: phạm vi kiểm tra phiên bản mới.

Ảnh studio và ảnh nhà chứa máy bay đã được chỉnh ánh sáng/chi tiết bằng imagegen; bản gốc giữ trong output/image-retouch/originals. Hồ sơ thay đổi: docs/research/PHOTO_RETOUCH.md. Hai ảnh road/dusk chỉ chuyển WebP. Hai MP4 dùng H.264/AAC với faststart. Video thứ nhất có cả Corvette C7 và C8; hình ở nhà chứa máy bay nằm trong bộ ảnh cảm hứng Corvette, không dùng làm bằng chứng thông số C7. Các thông số Studio là tham khảo Stingray tiêu chuẩn, không phải đo từ xe trong ảnh. Website là đồ án trưng bày; không có dịch vụ đặt mua hay thanh toán.

Nguồn tài nguyên có sẵn và logo: `docs/research/ASSETS.md`.
