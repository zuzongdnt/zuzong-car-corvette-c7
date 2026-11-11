export const cars = [
  {id:'corvette', brand:'Chevrolet', name:'Corvette C7', series:'STINGRAY / C7', price:4500000000, text:'Dáng thấp, vai rộng và những đường gân dứt khoát. Một dấu ấn đậm chất Mỹ.', engine:'V8 6.2L', layout:'Coupé thể thao', character:'Mạnh mẽ · Sắc cạnh'},
  {id:'bmw', brand:'BMW', name:'M4 G82 Coupé', series:'M4 COUPÉ / G82', price:5500000000, text:'Tỉ lệ coupé thể thao cùng lưới tản nhiệt đặc trưng. Cá tính hiện diện từ mọi góc nhìn.', engine:'I6 3.0L tăng áp', layout:'Coupé thể thao', character:'Hiện đại · Táo bạo'},
  {id:'porsche', brand:'Porsche', name:'911 GT3 (992)', series:'911 GT3 / 992', price:15000000000, text:'Đường cong quen thuộc của 911, kết hợp tinh thần đường đua và cánh gió nổi bật.', engine:'Boxer 6 4.0L', layout:'Coupé thể thao', character:'Tinh gọn · Chính xác'},
  {id:'mercedes', brand:'Mercedes-Benz', name:'AMG SL63', series:'AMG / SL63', price:12000000000, text:'Mui trần thanh lịch, nội thất sáng và những chi tiết AMG. Thể thao theo cách riêng.', engine:'V8 4.0L tăng áp', layout:'Roadster', character:'Thanh lịch · Uy lực'},
  {id:'lamborghini', brand:'Lamborghini', name:'Revuelto', series:'REVUELTO / V12', price:44000000000, text:'Đường nét góc cạnh, dáng nêm thấp và chữ ký ánh sáng khác biệt. Một hình dung táo bạo về tốc độ.', engine:'V12 hybrid 6.5L', layout:'Siêu xe hybrid', character:'Tương lai · Quyết liệt'}
];
export const palettes = {
  body:[
    {id:'obsidian',name:'Đen Obsidian',hex:'#111216',surcharge:0},
    {id:'pearl',name:'Trắng Pearl',hex:'#e7e7e2',surcharge:180000000},
    {id:'racing',name:'Đỏ Racing',hex:'#ad101c',surcharge:280000000},
    {id:'velocity',name:'Xanh Velocity',hex:'#164ea1',surcharge:650000000,limited:true},
    {id:'satin',name:'Bạc Satin',hex:'#9298a1',surcharge:420000000},
    {id:'british',name:'Xanh British',hex:'#164537',surcharge:450000000},
    {id:'yellow',name:'Vàng Competition',hex:'#c99c16',surcharge:360000000},
    {id:'lava',name:'Cam Lava',hex:'#df541f',surcharge:420000000},
    {id:'violet',name:'Tím Violet',hex:'#5c4a8e',surcharge:380000000},
    {id:'shark-blue',name:'Shark Blue',hex:'#1878d3',surcharge:650000000,car:'porsche'},
    {id:'verde-scandal',name:'Verde Scandal',hex:'#b4e62e',surcharge:850000000,car:'lamborghini'}
  ],
  calipers:[{id:'red',name:'Đỏ Racing',hex:'#cc1826'},{id:'yellow',name:'Vàng Sport',hex:'#f3b718'},{id:'blue',name:'Xanh Cobalt',hex:'#1762c5'},{id:'silver',name:'Bạc Titanium',hex:'#aeb3bb'},{id:'black',name:'Đen Graphite',hex:'#202228'},{id:'orange',name:'Cam Competition',hex:'#ec6a21'},{id:'white',name:'Trắng Ceramic',hex:'#f0eee7'},{id:'green',name:'Xanh Emerald',hex:'#188052'}],
  rims:[{id:'silver',name:'Bạc Titanium',hex:'#aeb3bb'},{id:'black',name:'Đen Graphite',hex:'#202228'},{id:'bronze',name:'Đồng Bronze',hex:'#a47d4b'},{id:'white',name:'Trắng Ceramic',hex:'#e7e7e2'},{id:'gunmetal',name:'Xám Gunmetal',hex:'#555c63'},{id:'gold',name:'Vàng Champagne',hex:'#c5a268'},{id:'blue',name:'Xanh Cobalt',hex:'#1762c5'},
    {id:'satin-neodyme',name:'GT3 Wheels Satin Neodyme',hex:'#aa936a',surcharge:220000000,car:'porsche'},
    {id:'altanero-black',name:'Altanero Shiny Black',hex:'#15161a',surcharge:350000000,car:'lamborghini'}]
};
export const labels = {body:'Màu sơn',calipers:'Heo phanh',rims:'Mâm xe'};
export const equipmentLabels = {interior:'Nội thất',carbon:'Gói carbon / phanh'};
const equipment = {
  porsche: {
    interior: [{id:'black-leather-alcantara-blue',name:'Leather/Alcantara đen, chỉ khâu xanh',surcharge:180000000}],
    carbon: [{id:'carbon-pccb',name:'Gói carbon + phanh gốm PCCB',surcharge:720000000}]
  },
  lamborghini: {
    carbon: [{id:'full-carbon',name:'Gói khí động học Full Carbon',surcharge:1600000000}]
  }
};
export const colorsFor = (car,part) => palettes[part].filter(choice=>!choice.car||choice.car===car);
export const equipmentFor = (car,part) => equipment[car]?.[part] || [];
export const equipmentChoice = (config,part) => equipmentFor(config.car,part).find(choice=>choice.id===config[part]);
export const money = value => new Intl.NumberFormat('vi-VN').format(value) + ' đ';
export const getCar = id => cars.find(car=>car.id===id) || cars[0];
export function cleanConfig(raw={}) {
  if(!raw||typeof raw!=='object')raw={};
  const value={car:getCar(raw.car).id};
  for(const part of Object.keys(palettes)) {
    const options=colorsFor(value.car,part);
    value[part]=options.some(choice=>choice.id===raw[part])?raw[part]:options[0].id;
  }
  for(const part of Object.keys(equipmentLabels)) {
    if(equipmentFor(value.car,part).some(choice=>choice.id===raw[part])) value[part]=raw[part];
  }
  return value;
}
export const colorOf = (config,part) => colorsFor(config.car,part).find(choice=>choice.id===config[part]) || palettes[part][0];
export function configurationPrice(raw={}) {
  const config=cleanConfig(raw);
  const colors=Object.keys(palettes).reduce((total,part)=>total+(colorOf(config,part).surcharge||0),0);
  const extras=Object.keys(equipmentLabels).reduce((total,part)=>total+(equipmentChoice(config,part)?.surcharge||0),0);
  return getCar(config.car).price+colors+extras;
}
export function readStore(key, fallback=[]) {try {const v=JSON.parse(localStorage.getItem('zuzong.'+key));return v??fallback;}catch{return fallback;}}
export function writeStore(key,value) {try{localStorage.setItem('zuzong.'+key,JSON.stringify(value));return true;}catch{return false;}}
export function configText(config){
  const colors=Object.keys(labels).map(part=>{const color=colorOf(config,part);return `${labels[part]}: ${color.name}${part==='body'&&color.limited?' (giới hạn)':''}`;});
  const extras=Object.entries(equipmentLabels).flatMap(([part,label])=>{
    const choice=equipmentChoice(config,part);
    return choice ? [`${label}: ${choice.name}`] : [];
  });
  return [...colors,...extras].join(' · ');
}
export const poster = (car,angle='hero') => car==='bmw'&&angle==='side' ? 'assets/gallery-real-v2/bmw-side-full-car.jpg' : `assets/gallery-real-v1/${car}-${angle}-real-v1.webp`;
export const brandLogo = id => 'assets/brands/'+({corvette:'chevrolet.svg',bmw:'bmw.svg',porsche:'porsche.svg',mercedes:'mercedes.svg',lamborghini:'lamborghini-shield.png'}[id]||'chevrolet.svg');
