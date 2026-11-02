export const cars = [
  {id:'corvette', brand:'Chevrolet', name:'Corvette C7', series:'STINGRAY / C7', price:4500000000, text:'Dáng thấp, vai rộng và những đường gân dứt khoát. Một dấu ấn đậm chất Mỹ.', engine:'V8 6.2L', layout:'Coupé thể thao', character:'Mạnh mẽ · Sắc cạnh'},
  {id:'bmw', brand:'BMW', name:'M4 G82 Coupé', series:'M4 COUPÉ / G82', price:5500000000, text:'Tỉ lệ coupé thể thao cùng lưới tản nhiệt đặc trưng. Cá tính hiện diện từ mọi góc nhìn.', engine:'I6 3.0L tăng áp', layout:'Coupé thể thao', character:'Hiện đại · Táo bạo'},
  {id:'porsche', brand:'Porsche', name:'911 GT3 (992)', series:'911 GT3 / 992', price:15000000000, text:'Đường cong quen thuộc của 911, kết hợp tinh thần đường đua và cánh gió nổi bật.', engine:'Boxer 6 4.0L', layout:'Coupé thể thao', character:'Tinh gọn · Chính xác'},
  {id:'mercedes', brand:'Mercedes-Benz', name:'AMG SL63', series:'AMG / SL63', price:12000000000, text:'Mui trần thanh lịch, nội thất sáng và những chi tiết AMG. Thể thao theo cách riêng.', engine:'V8 4.0L tăng áp', layout:'Roadster', character:'Thanh lịch · Uy lực'},
  {id:'lamborghini', brand:'Lamborghini', name:'Revuelto', series:'REVUELTO / V12', price:44000000000, text:'Đường nét góc cạnh, dáng nêm thấp và chữ ký ánh sáng khác biệt. Một hình dung táo bạo về tốc độ.', engine:'V12 hybrid 6.5L', layout:'Siêu xe hybrid', character:'Tương lai · Quyết liệt'}
];
export const palettes = {
  body:[{id:'obsidian',name:'Đen Obsidian',hex:'#111216'},{id:'pearl',name:'Trắng Pearl',hex:'#e7e7e2'},{id:'racing',name:'Đỏ Racing',hex:'#ad101c'},{id:'velocity',name:'Xanh Velocity',hex:'#164ea1'},{id:'satin',name:'Bạc Satin',hex:'#9298a1'}],
  calipers:[{id:'red',name:'Đỏ Racing',hex:'#cc1826'},{id:'yellow',name:'Vàng Sport',hex:'#f3b718'},{id:'blue',name:'Xanh Cobalt',hex:'#1762c5'},{id:'silver',name:'Bạc Titanium',hex:'#aeb3bb'},{id:'black',name:'Đen Graphite',hex:'#202228'}],
  rims:[{id:'silver',name:'Bạc Titanium',hex:'#aeb3bb'},{id:'black',name:'Đen Graphite',hex:'#202228'},{id:'bronze',name:'Đồng Bronze',hex:'#a47d4b'},{id:'white',name:'Trắng Ceramic',hex:'#e7e7e2'}]
};
export const labels = {body:'Màu sơn',calipers:'Heo phanh',rims:'Mâm xe'};
export const money = value => new Intl.NumberFormat('vi-VN').format(value) + ' đ';
export const getCar = id => cars.find(car=>car.id===id) || cars[0];
export function cleanConfig(raw={}) {
  if(!raw||typeof raw!=='object')raw={};
  const value={car:getCar(raw.car).id};
  for(const part of Object.keys(palettes)) value[part]=palettes[part].some(p=>p.id===raw[part])?raw[part]:palettes[part][0].id;
  return value;
}
export const colorOf = (config,part) => palettes[part].find(p=>p.id===config[part]) || palettes[part][0];
export function readStore(key, fallback=[]) {try {const v=JSON.parse(localStorage.getItem('zuzong.'+key));return v??fallback;}catch{return fallback;}}
export function writeStore(key,value) {try{localStorage.setItem('zuzong.'+key,JSON.stringify(value));return true;}catch{return false;}}
export function configText(config){return Object.keys(labels).map(part=>`${labels[part]}: ${colorOf(config,part).name}`).join(' · ');}
export const poster = (car,angle='hero') => `assets/studio/${car}-${angle}.webp`;
export const brandLogo = id => 'assets/brands/'+({corvette:'chevrolet.svg',bmw:'bmw.svg',porsche:'porsche.svg',mercedes:'mercedes.svg',lamborghini:'lamborghini-shield.png'}[id]||'chevrolet.svg');
