# Nguồn V6 – garage SL63 và 5 xe

## Garage dùng lại từ dự án Mercedes của Zuzong

Scene: `E:/bmw/Mercedes_AMG_SL63/output/Mercedes_AMG_SL63_DH24TIN07_1080p.blend`.

- **Garage/Showroom**, **Matteo Pascale**, BlenderKit: https://www.blenderkit.com/asset-gallery-detail/21b2d120-9a9a-4124-8979-c394d28ac637/ . Metadata nguồn trong dự án Mercedes; bối cảnh được lấy từ industrial showroom và chỉnh sửa trong scene cũ. Điều khoản BlenderKit: https://www.blenderkit.com/docs/licenses/ . Không bán lại tài nguyên như một gói model độc lập.
- **Garage Floor**, Poly Haven: https://polyhaven.com/a/garage_floor , CC0, https://polyhaven.com/license . Giữ bộ texture sàn 2K màu, normal và roughness.
- Đèn thanh, softbox, dầm trần và camera dùng lại thiết lập trong scene Mercedes của Zuzong. V5 thay xe/biển và tạo chuyển động camera ngắn hơn dựa trên các góc gốc.

## Bạt và vải

- Bạt V6 được dựng mesh mới và mô phỏng riêng cho 5 xe bằng Blender Cloth. Mỗi tấm có 2.665 đỉnh, tự va chạm, va chạm sàn và vỏ thân xe đơn giản hóa; mép sau kéo ngang cao 8 cm. V6 không dùng lại chuyển động bake của bạt Corvette trong các phiên bản trước.
- **Crepe Satin**, Poly Haven: https://polyhaven.com/a/crepe_satin , CC0. Dùng texture 2K Diffuse/Roughness/Normal GL, nhuộm đỏ trong shader. Metadata URL tải: `../../Cloth_V4/assets/download_sources.json`.

## Xe

- **Porsche 911 GT3 (992), 2022**, Ddiaz Design; trang nguồn ghi CSR2 / GM25. https://sketchfab.com/3d-models/2022-porsche-911-gt3-992-ba01afbaf32846e598db315be3507db3 . Hồ sơ nguồn ghi **CC BY-NC-SA 4.0**: ghi công, phi thương mại, bản chỉnh sửa chia sẻ cùng giấy phép. Không coi metadata CC BY 4.0 cũ trong GLB là xác nhận quyền quảng cáo.
- **BMW M4 G82 Coupe**, Sloftm_Carz / SLBofficial. https://sketchfab.com/3d-models/bmw-m4-g82-coupe-free-high-detail-8704e302e4214c849bc607edb294be8a , CC BY 4.0 theo hồ sơ. Logo trước dùng mesh BMW từ Seatla Morake / BlenderKit, Royalty Free theo metadata dự án.
- **Chevrolet Corvette C7**, Martin Trafas. https://sketchfab.com/3d-models/chevrolet-corvette-c7-2b509d1bce104224b147c81757f6f43a , CC BY 4.0 theo manifest model. Dùng GLB đã chuyển từ FBX trong dự án ZUZONG CAR, chỉnh kính và vật liệu. Những texture thiếu của gói FBX nguồn được ghi ở manifest gốc.
- **Mersedes-Benz SL63 AMG [Free]**, Black Snow / BlackSnow02. https://sketchfab.com/3d-models/mersedes-benz-sl63-amg-free-f7a625e6f5de425e89e84ae2e92cad65 , CC BY 4.0 theo hồ sơ. Giữ nội thất kem, thay biển theo yêu cầu mới.
- **Lamborghini Revuelto super car**, AmJViZ, BlenderKit: https://www.blenderkit.com/asset-gallery-detail/4146135b-e6e7-45f5-b81b-372d4bbb74e8/ . Metadata tải miễn phí, Royalty Free. Đổi sơn trắng; texture đèn sau thiếu được thay bằng vật liệu đỏ phát sáng. Metadata đầy đủ ở `../../assets/Lamborghini_source.json`.

Tất cả 5 xe có biển sau nền đen/chữ vàng zuzong theo yêu cầu mới. Giấy phép model không tự xác nhận quyền nhãn hiệu hoặc các dữ liệu bên thứ ba. Hồ sơ này không đưa ra xác nhận sử dụng quảng cáo thương mại.


## Thay đổi V6

Tính mới 5 mô phỏng bạt Cloth, tự va chạm và va chạm sàn/vỏ thân xe riêng, kéo mép sau cao 8 cm. Mesh vải được dựng mới, chuyển động V6 không dùng lại bake Corvette cũ. Giữ texture Crepe Satin của Poly Haven. Cân lại mỗi xe theo bốn đáy lốp, sửa camera theo quỹ đạo cung tròn/dolly vận tốc đều và bỏ roll.
