const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..'),out=path.join(root,'dist');
require('./assemble.cjs');fs.mkdirSync(out,{recursive:true});
for(const file of ['index.html','experience.html','films.html','gallery.html','hero.html','sections.html','styles.css','hero.css','sections.css','journal.css','editorial.css','app.js','sections.js','reveal-sequence.js','editorial.js','server.cjs','README.md','package.json'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.mkdirSync(path.join(out,'scripts'),{recursive:true});
for(const file of ['campaign.html','campaign.css','campaign.js','campaign-config.js'])fs.copyFileSync(path.join(root,file),path.join(out,file));
for(const file of ['bottom-nav.css','bottom-nav.js'])fs.copyFileSync(path.join(root,file),path.join(out,file));
for(const file of ['drive-scroll.css','drive-scroll.js'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.cpSync(path.join(root,'assets','drive'),path.join(out,'assets','drive'),{recursive:true});
fs.cpSync(path.join(root,'assets','drive-snaptik'),path.join(out,'assets','drive-snaptik'),{recursive:true});
fs.cpSync(path.join(root,'assets','drive-rollers'),path.join(out,'assets','drive-rollers'),{recursive:true});
fs.cpSync(path.join(root,'assets','drive-rollers-sharp'),path.join(out,'assets','drive-rollers-sharp'),{recursive:true});
for(const file of ['car-viewer.css','car-viewer.js'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.mkdirSync(path.join(out,'assets','model'),{recursive:true});
for(const file of ['corvette-c7.glb','manifest.json'])fs.copyFileSync(path.join(root,'assets','model',file),path.join(out,'assets','model',file));
fs.cpSync(path.join(root,'assets','vendor'),path.join(out,'assets','vendor'),{recursive:true});
for(const file of ['assemble.cjs','build.cjs','render-reveal-v2.cjs','render-reveal-v2.html','render-reveal-v2-previews.cjs'])fs.copyFileSync(path.join(root,'scripts',file),path.join(out,'scripts',file));
fs.mkdirSync(path.join(out,'assets'),{recursive:true});
for(const file of fs.readdirSync(path.join(root,'assets')))if(/\.(webp|svg)$/i.test(file))fs.copyFileSync(path.join(root,'assets',file),path.join(out,'assets',file));
fs.cpSync(path.join(root,'assets','fonts'),path.join(out,'assets','fonts'),{recursive:true});
fs.cpSync(path.join(root,'assets','reveal-studio'),path.join(out,'assets','reveal-studio'),{recursive:true});
fs.cpSync(path.join(root,'assets','editorial'),path.join(out,'assets','editorial'),{recursive:true});
fs.cpSync(path.join(root,'assets','campaign'),path.join(out,'assets','campaign'),{recursive:true});
const campaignConfig=require('../campaign-config.js');
for(const key of ['videoSrc','posterSrc','logoSrc']){const value=campaignConfig[key];if(value&&!/^(https?:|data:)/.test(value)&&!fs.existsSync(path.join(out,value)))throw Error('Campaign: missing '+key+' '+value);}
fs.mkdirSync(path.join(out,'docs','research'),{recursive:true});
for(const file of ['ASSETS.md','UPGRADE_V2_QA.md','PHOTO_RETOUCH.md','DRIVE_ALIGNMENT_QA.md','DRIVE_ROLLERS_QA.md','DRIVE_SHARP_QA.md'])if(fs.existsSync(path.join(root,'docs','research',file)))fs.copyFileSync(path.join(root,'docs','research',file),path.join(out,'docs','research',file));
if(fs.existsSync(path.join(root,'assets','retouch-manifest.json')))fs.copyFileSync(path.join(root,'assets','retouch-manifest.json'),path.join(out,'assets','retouch-manifest.json'));
for(const page of ['index.html','experience.html','films.html','gallery.html']){const html=fs.readFileSync(path.join(out,page),'utf8');for(const match of html.matchAll(/(?:src|href|poster|data-src)="([^"#]+)"/g)){if(/^(https?:|data:|mailto:)/.test(match[1]))continue;const target=match[1].split('#')[0].split('?')[0];if(target&&!fs.existsSync(path.join(out,target)))throw Error(page+': Missing asset '+target);}}
console.log('Static build OK: dist/');
