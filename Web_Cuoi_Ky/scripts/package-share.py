"""Package the current static runtime without old renders or development backups."""
from pathlib import Path
from datetime import datetime, timezone, timedelta
import hashlib
import json
import shutil
import zipfile

root = Path(__file__).resolve().parents[1]
build = root / 'dist'
out = root.parent / 'output'
stamp = datetime.now(timezone(timedelta(hours=7))).strftime('%Y-%m-%d_%H%M%S')
name = f'ZUZONG_CAR_Web_{stamp}'
folder = out / name
folder.mkdir(exist_ok=False)

for p in build.iterdir():
    if p.is_file() and p.suffix in {'.html', '.css', '.js'}:
        shutil.copy2(p, folder / p.name)
shutil.copy2(root / 'server.cjs', folder / 'server.cjs')
(folder / 'assets').mkdir()
for p in (build / 'assets').iterdir():
    if p.is_file() and p.suffix in {'.webp', '.svg'}:
        shutil.copy2(p, folder / 'assets' / p.name)
for name_ in ['fonts', 'vendor', 'reveal-cloth-2k', 'drive-rollers-sharp', 'editorial', 'campaign']:
    shutil.copytree(build / 'assets' / name_, folder / 'assets' / name_,
                    ignore=shutil.ignore_patterns('manifest.json', 'source.json', 'alignment.json'))
shutil.copy2(build / 'assets/drive-rollers-sharp/alignment.json', folder / 'assets/drive-rollers-sharp/alignment.json')
(folder / 'assets/model').mkdir()
for name_ in ['corvette-c7.glb', 'studio-softbox.hdr', 'manifest.json']:
    shutil.copy2(build / 'assets/model' / name_, folder / 'assets/model' / name_)
(folder / 'package.json').write_text(json.dumps({
    'name': 'zuzong-car-web-share', 'private': True,
    'scripts': {'start': 'node server.cjs'}
}, indent=2) + '\n', encoding='utf-8')
(folder / 'HUONG_DAN_MO_WEB.txt').write_text('''ZUZONG CAR — BẢN WEB CHIA SẺ

Bản này có đủ 4 trang, video, chuỗi mở bạt, xe 3D, đổi màu và hiệu ứng chữ.

1. XEM TRÊN MÁY TÍNH
   Giải nén ZIP. Máy cần có Node.js.
   Mở Terminal tại thư mục có index.html rồi chạy:

   node server.cjs

   Mở trình duyệt tại: http://localhost:4173
   Giữ Terminal hoạt động trong lúc xem. Không cần npm install.
   Nếu cổng 4173 đang được dùng, mở địa chỉ trên trước để kiểm tra.

2. ĐƯA LÊN HOSTING CHO NGƯỜI KHÁC XEM
   Đây là website tĩnh, đã build sẵn; không cần bước build trên hosting.
   Tải toàn bộ nội dung thư mục giải nén lên thư mục public của hosting.
   index.html phải nằm ngay ở thư mục gốc và giữ nguyên cấu trúc assets/.
   Nếu dịch vụ nhận ZIP trực tiếp, chọn ZIP này (index.html nằm ngay trong gốc ZIP).
   Hosting cần phục vụ được .js, .css, .webp, .woff2, .mp4, .glb và .hdr.
   Sau khi tải lên, chia sẻ đường link HTTPS do hosting cung cấp.

3. LƯU Ý KHI GỬI FILE
   localhost chỉ mở trên máy đang chạy server; không phải link công khai.
   Không mở index.html bằng cách nhấp đúp: trình duyệt có thể chặn model 3D
   và việc tải chuỗi ảnh từ đường dẫn file://. Hãy dùng localhost hoặc hosting.
   Đợi model tải lần đầu rồi mới dùng nút đổi màu/góc nhìn.

Model Corvette C7: Martin Trafas, giấy phép CC BY 4.0.
Nguồn và ghi công được giữ trong web và assets/model/manifest.json.
''', encoding='utf-8-sig')

archive = out / f'{name}.zip'
with zipfile.ZipFile(archive, 'x', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
    for p in sorted(folder.rglob('*')):
        if p.is_file(): z.write(p, p.relative_to(folder).as_posix())
with zipfile.ZipFile(archive) as z:
    bad = z.testzip()
    assert bad is None, bad
    files = z.namelist()
    assert 'index.html' in files
    assert z.read('car-viewer.js') == (root / 'car-viewer.js').read_bytes()
    assert z.read('car-viewer.css') == (root / 'car-viewer.css').read_bytes()
    assert z.read('index.html') == (root / 'index.html').read_bytes()
    assert len([n for n in files if n.startswith('assets/reveal-cloth-2k/') and n.endswith('.webp')]) == 640
report = {'folder': str(folder), 'zip': str(archive), 'fileCount': len(files),
          'bytes': archive.stat().st_size, 'zipCRC': 'PASS',
          'current3DAndTextEffect': True, 'sha256': hashlib.sha256(archive.read_bytes()).hexdigest()}
(out / f'{name}_verification.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report))
