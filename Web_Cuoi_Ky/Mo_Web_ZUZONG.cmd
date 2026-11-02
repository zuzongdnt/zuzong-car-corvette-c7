@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -Command "try { $r = Invoke-WebRequest -UseBasicParsing 'http://localhost:4173/products.html'; if ($r.StatusCode -eq 200 -and $r.Content -match 'ZEPHYRON') { Start-Process 'http://localhost:4173/products.html'; exit 0 } } catch {}; exit 1"
if not errorlevel 1 exit /b 0
echo ZEPHYRON - http://localhost:4173/products.html
echo Giu cua so nay mo khi xem web. Bam Ctrl+C de dung server.
start "" "http://localhost:4173/products.html"
node server.cjs
pause
