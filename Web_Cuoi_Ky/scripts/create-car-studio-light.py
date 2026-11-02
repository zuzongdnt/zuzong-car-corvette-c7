"""Local Radiance lighting map generated from analytic studio softboxes."""
from pathlib import Path
import numpy as np
import cv2

root = Path(__file__).resolve().parents[1]
width, height = 1024, 512
u, v = np.meshgrid(np.linspace(0, 1, width, endpoint=False), np.linspace(0, 1, height))
sky = .09 + .15 * np.maximum(0, np.cos(v * np.pi))
sky += .30 * np.exp(-((v - .47) / .15) ** 2)
rgb = np.stack([sky * .96, sky, sky * 1.04], axis=-1)

def panel(x, y, sx, sy, power, color):
    dx = np.minimum(np.abs(u - x), 1 - np.abs(u - x)) / sx
    dy = np.abs(v - y) / sy
    rgb[:] += np.exp(-2 * (dx ** 6 + dy ** 6))[..., None] * power * np.array(color)

panel(.16, .30, .095, .105, 2.5, (1.0, .97, .93))
panel(.67, .27, .12, .075, 3.0, (.91, .95, 1.0))
panel(.43, .40, .028, .17, 1.9, (1.0, 1.0, 1.0))
panel(.88, .43, .06, .13, .65, (1.0, .55, .48))
panel(.12, .49, .16, .12, .7, (.94, .97, 1.0))
panel(.60, .49, .15, .10, .7, (1.0, .96, .92))
panel(.50, .10, .35, .05, .65, (1.0, 1.0, 1.0))
out = root / 'assets' / 'model' / 'studio-softbox.hdr'
cv2.imwrite(str(out), rgb[..., ::-1].astype(np.float32))
print(f'Created {out.name}: {out.stat().st_size:,} bytes')
