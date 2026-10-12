const sharp=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
sharp('C:/Users/zuzong/.codex/generated_images/01a1192e-5df8-71f1-8c97-544d29591119/exec-578c1fce-36a7-44ba-900e-4ef6978a7954.png').trim({threshold:12}).resize({width:1800}).webp({quality:90,effort:5}).toFile('E:/du_dan_cuoi_ky_tkdh/assets/cover.webp').then(i=>console.log(i));
