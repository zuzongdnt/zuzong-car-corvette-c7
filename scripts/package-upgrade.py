from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
folder = root / 'dist'
archive = root / 'output' / 'Zuzong_Car_Corvette_V2.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as bundle:
    for file in sorted(folder.rglob('*')):
        if not file.is_file():
            continue
        relative = file.relative_to(folder)
        # Keep the previous sequence on disk, but ship the active sequence only.
        if relative.parts[:2] == ('assets', 'reveal'):
            continue
        if relative.parts[0] == 'scripts' and relative.name not in {
            'assemble.cjs', 'build.cjs', 'render-reveal-v2.cjs',
            'render-reveal-v2.html', 'render-reveal-v2-previews.cjs'
        }:
            continue
        if relative.parts[:2] == ('docs', 'research') and relative.name not in {'ASSETS.md', 'UPGRADE_V2_QA.md'}:
            continue
        bundle.write(file, Path('Zuzong_Car_Corvette_V2') / relative)
with zipfile.ZipFile(archive) as bundle:
    assert bundle.testzip() is None
    for page in ('index.html', 'experience.html', 'films.html', 'gallery.html'):
        assert f'Zuzong_Car_Corvette_V2/{page}' in bundle.namelist()
print(f'ZIP verified: {archive}, {archive.stat().st_size} bytes')
