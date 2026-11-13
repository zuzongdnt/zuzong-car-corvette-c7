"""Neutral HDR photography rig: long softboxes, side fill and a dark floor."""
from pathlib import Path
import numpy as np
import cv2

root=Path(__file__).resolve().parents[1]
width,height=2048,1024
u,v=np.meshgrid(np.linspace(0,1,width,endpoint=False),np.linspace(0,1,height))
ambient=.065+.15*np.maximum(0,np.cos(v*np.pi))+.10*np.exp(-((v-.47)/.17)**2)
rgb=np.repeat(ambient[...,None],3,axis=2)
def panel(x,y,sx,sy,power,tint=(1,1,1)):
    dx=np.minimum(abs(u-x),1-abs(u-x))/sx
    dy=abs(v-y)/sy
    rgb[:]+=np.exp(-2*(dx**8+dy**8))[...,None]*power*np.array(tint)
panel(.12,.28,.12,.065,3.8,(1,.985,.96))
panel(.63,.25,.15,.055,4.3,(.96,.98,1))
panel(.39,.40,.022,.16,2.3)
panel(.88,.38,.025,.17,2.6,(.97,.985,1))
panel(.10,.48,.17,.10,.65)
panel(.60,.49,.18,.08,.85)
panel(.50,.10,.30,.045,1.5)
output=root/'assets/model/studio-automotive.hdr'
assert cv2.imwrite(str(output),rgb[...,::-1].astype(np.float32))
print('Neutral automotive HDR:',output.stat().st_size,'bytes')
