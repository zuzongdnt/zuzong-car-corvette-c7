const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 try{
  const results=[];
  for(const [width,height] of [[1183,871],[1440,900],[390,844],[320,568]]){
   const page=await browser.newPage({viewport:{width,height}}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://localhost:4173/index.html');
   await page.evaluate(()=>document.fonts.ready);
   const sample=async(progress,name)=>{
    await page.evaluate(p=>{const hero=document.querySelector('#unveil'),stage=hero.querySelector('.hero-stage');scrollTo({top:scrollY+hero.getBoundingClientRect().top+p*(hero.offsetHeight-stage.offsetHeight),behavior:'instant'})},progress);
    await page.waitForTimeout(950);
    const state=await page.evaluate(()=>({
     title:document.querySelector('#studio-title').textContent,
     lines:[...document.querySelector('#studio-title').children].map(e=>({opacity:+getComputedStyle(e).opacity,transform:getComputedStyle(e).transform,top:e.getBoundingClientRect().top,bottom:e.getBoundingClientRect().bottom})),
     overflow:document.documentElement.scrollWidth>innerWidth,
     captionBottom:document.querySelector('.studio-traits').getBoundingClientRect().bottom,
     footerTop:document.querySelector('.hero-footer').getBoundingClientRect().top
    }));
    if(name)await page.screenshot({path:`output/playwright/caption-${name}-${width}.png`});
    return state;
   };
   const entering=await sample(-.12,'enter'),shown=await sample(.14,'shown');
   const outgoing=await sample(.05+.8*.39),incoming=await sample(.05+.8*.445);
   const second=await sample(.05+.8*.6,'second'),third=await sample(.88,'third');
   const reverse=await sample(-.12);
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(350);
   const reduced=await page.locator('#studio-title span').first().evaluate(e=>({opacity:getComputedStyle(e).opacity,transform:getComputedStyle(e).transform}));
   const pass=!errors.length&&[entering,shown,outgoing,incoming,second,third,reverse].every(s=>!s.overflow)&&entering.lines[0].opacity>entering.lines[1].opacity&&shown.lines.every(l=>l.opacity===1)&&outgoing.lines[0].opacity<.6&&incoming.lines[0].opacity<.6&&second.lines.every(l=>l.opacity===1)&&third.lines.every(l=>l.opacity===1)&&Math.abs(reverse.lines[0].opacity-entering.lines[0].opacity)<.015&&reduced.opacity==='1'&&reduced.transform==='none';
   results.push({width,pass,errors,entering,shown,outgoing,incoming,second,third,reverse,reduced});console.log(JSON.stringify({width,pass,errors}));await page.close();
  }
  fs.writeFileSync('output/playwright/caption-qa.json',JSON.stringify(results,null,2));if(results.some(r=>!r.pass))process.exitCode=1;
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
