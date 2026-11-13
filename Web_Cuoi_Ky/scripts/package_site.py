from pathlib import Path
import zipfile
root = Path(__file__).resolve().parent.parent
folder = root / 'dist'
archive = root / 'output' / 'Zuzong_Car_Corvette_C7.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as bundle:
    for file in sorted(folder.rglob('*')):
        if file.is_file():
            bundle.write(file, Path('Zuzong_Car_Corvette_C7') / file.relative_to(folder))
with zipfile.ZipFile(archive) as bundle:
    assert bundle.testzip() is None
print(f'ZIP verified: {archive}, {archive.stat().st_size} bytes')
