# Kiểm tra giao diện Zuzong Car

Kiểm tra Chrome trên `http://127.0.0.1:4173`, ngày 08/10/2026. Các viewport: desktop1440×900, tablet768×1024, mobile390×844. Chỉ kiểm tra giao diện và tương tác; không sửa implementation. Screenshot từng viewport riêng, không suy luận khoảng trống từ fullpage screenshot sticky.

## Kết quả tốt

- Không có horizontal overflow ở ba kích thước; không có lỗi JavaScript trong quá trình khảo sát.
- Logo Corvette C7 nhỏ phía trên bên phải đã đúng tỷ lệ, không chen vào header.
- Headline, thông số, detail gallery, collection và contact đọc được; không thấy text/nút bị chồng nhau.
- Detail gallery pin desktop/tablet, mobile chuyển thành stack ảnh phù hợp. Clip ảnh ở track ngang là hành vi chủ động, không phải lỗi page overflow.
- Studio xe phía sau và collection giữ trọn silhouette, hình ảnh nổi bật trên nền tối.
- Gallery modal desktop/mobile giữ ảnh chính trong khung, nút đóng và điều hướng dễ nhận ra, không có overflow ngang.
- Nội dung tiếng Việt hiển thị đúng trong trình duyệt. Các số đếm trong screenshot sớm có thể còn trong animation; không coi đó là sai dữ liệu.

## Xác minh lại hero sau sửa

Agent chính đã sửa opacity xe theo tiến độ, căn bạt theo cạnh dưới, giảm chiều rộng layer xe và đưa tâm về giữa hơn. Đã reload và kiểm tra riêng trạng thái phủ, giữa chuyển động và mở ở cả ba viewport.

- **Đạt:** scroll0 chỉ thấy bạt, xe trần opacity0; cabin/hood/bánh không lộ phía sau bạt. Khi mở xong, xe opacity1 và bạt opacity0.
- **Đạt:** silhouette xe mở nằm trọn viewport. Desktop x316.8..1353.6 trên1440; tablet x92.2..737.3 trên768; mobile x19.5..370.5 trên390.
- **Đạt:** bạt desktop và mobile nằm trong viewport; chuyển động kéo lên và fade không làm hiện hai xe trần ở scroll0.
- **Chi tiết nhỏ:** phần đuôi vải bạt tablet tràn mép phải khoảng9px ở trạng thái phủ; đây là mép vải, không phải thân xe. Không có overflow ngang và không chặn giao diện.
- Khoảng trống phía trên xe mobile sau khi chữ mờ là nhịp cinematic; không có overlap hoặc nội dung bị che.

Không còn lỗi hero cần sửa để hoàn tất giao diện. Các lỗi vòng đầu bên dưới được giữ làm lịch sử QA và đã xử lý.

## Lỗi vòng đầu đã gửi về agent chính

1. **Hero khớp bạt với xe:** snapshot đầu tiên desktop để lộ cabin. Sau khi agent chính đổi `transform-origin` về cạnh dưới, cabin đã kín hơn nhưng tại scroll0 vẫn thấy một phần hood phía phải và bánh sau phía trái dưới bạt. Nên ẩn xe trần ở progress0 và fade lên khi bạt bắt đầu nhấc, hoặc căn lại silhouette/scale để phủ kín.
2. **Hero clipping:** mũi xe trong trạng thái mở sát/cắt mép phải trên cả ba viewport. Đo DOM vòng đầu: desktop right1455 trên1440, tablet right797 trên768, mobile right418 trên390. Bạt mobile bị cắt cả hai mép. Có thể giảm chiều rộng hoặc dịch tâm layer xe về trái/giữa; cần xác minh lại sau chỉnh.
3. **Mobile khoảng trống ở hero mở:** khi headline đã biến mất, phía trên xe là một vùng trống khá lớn. Đây là lựa chọn cinematic có thể chấp nhận, nhưng nếu rút chiều dài hero hoặc đưa xe lên nhẹ thì nhịp cuộn sẽ gọn hơn.

Các điểm1 và2 đã được sửa và xác minh ở trên. Mục3 là đề xuất, không chặn giao diện.

## Bằng chứng

- `../../output/playwright/review-desktop-hero-latest.png`: bạt sau chỉnh transform-origin.
- `../../output/playwright/review-*-hero-verified-closed.png`, `half.png`, `open.png`: snapshot bản sau sửa cuối cùng ở ba viewport.
- `../../output/playwright/review-hero-verified.json`: opacity và số đo hero bản đã xác minh.
- `../../output/playwright/review-mobile-hero-latest.png`: hero mobile.
- `../../output/playwright/review-*-hero-revealed.png`: xe sau mở bạt.
- `../../output/playwright/review-*-performance.png`, `studio.png`, `details.png`, `collection.png`, `contact.png`: từng section riêng.
- `../../output/playwright/review-desktop-gallery.png`, `review-mobile-gallery.png`: modal bộ ảnh.
- `../../output/playwright/review-metrics.json`: số đo viewport/section/hero vòng đầu. Trường images là ảnh lazy chưa được tải tại đầu trang, không phải kết luận ảnh hỏng.
