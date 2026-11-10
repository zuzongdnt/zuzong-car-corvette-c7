const GSAP_SRC='assets/vendor/gsap/gsap.min.js';

const CAR_ORDER=['corvette','bmw','porsche','mercedes','lamborghini'];
export const FEATURE_DATA={
  corvette:{
    brand:'Chevrolet',model:'Corvette C7',video:'assets/feature-videos/corvette-rotate-clean.mp4',poster:'assets/unveil-five/corvette-poster.webp',
    source:'https://media.chevrolet.com/content/dam/Media/documents/INTL/chevrolet/2019/vehicles/corvette-stingray/Tech-Data-Chevrolet-Corvette-Stingray.pdf',
    features:[
      {name:'LT1 V8',eyebrow:'Hiệu năng',title:'V8 hút khí tự nhiên 6,2 lít',type:'power',image:'assets/article-real-v1/corvette-front-real-v1.webp',summary:'Khối LT1 tạo lực kéo tuyến tính và phản hồi chân ga trực tiếp, đúng chất xe thể thao động cơ đặt trước.',how:'Phun xăng trực tiếp đưa nhiên liệu chính xác vào buồng đốt; động cơ hút khí tự nhiên tăng công suất theo vòng tua mà không cần bộ tăng áp.',benefit:'Âm thanh cơ khí rõ, phản hồi tức thời và lực kéo mạnh ở dải tua sử dụng hàng ngày.',availability:'Corvette Stingray Z51 · dữ liệu tham khảo 2019',specs:['6.162 cc','466 PS','630 Nm']},
      {name:'Dry-sump',eyebrow:'Bôi trơn',title:'Hệ thống dầu cácte khô',type:'flow',image:'assets/gallery-real-v1/corvette-side-real-v1.webp',summary:'Dầu được giữ trong bình riêng thay vì dồn trong đáy động cơ khi xe đổi hướng gấp.',how:'Bơm hút đưa dầu ra bình chứa và bơm áp lực cấp lại liên tục đến các bề mặt cần bôi trơn.',benefit:'Duy trì áp suất dầu ổn định khi phanh mạnh, ôm cua nhanh hoặc chạy đường đua.',availability:'Trang bị trên Stingray Z51 trong tài liệu hãng',specs:['Cácte khô','Phun trực tiếp','11,5 : 1']},
      {name:'RWD + 8AT',eyebrow:'Truyền động',title:'Cầu sau và lẫy chuyển số',type:'driveline',image:'assets/gallery-real-v1/corvette-rear-real-v1.webp',summary:'Lực kéo được truyền đến cầu sau qua hộp số tự động 8 cấp có lẫy chuyển số.',how:'Hộp số chọn tỉ số phù hợp theo tải động cơ; người lái có thể chủ động sang số bằng lẫy sau vô-lăng.',benefit:'Giữ cảm giác lái thể thao, tăng độ linh hoạt khi thoát cua và vẫn thuận tiện khi đi phố.',availability:'Corvette Stingray Z51 · hộp số 8 cấp tham khảo',specs:['8 cấp','Cầu sau','Paddle Shift']},
      {name:'Phanh Z51',eyebrow:'Kiểm soát',title:'Phanh hiệu năng cao Z51',type:'brake',image:'assets/details-five/corvette.webp',summary:'Cụm phanh bốn piston kết hợp đĩa thông gió được thiết kế cho cường độ vận hành cao.',how:'Piston ép má phanh đều lên đĩa; các rãnh thông gió giúp thoát nhiệt trong những lần phanh liên tiếp.',benefit:'Cảm giác bàn đạp ổn định hơn và kiểm soát tốc độ tự tin khi chạy nhanh.',availability:'Gói hiệu năng Z51',specs:['Trước 345 × 30 mm','Sau 338 × 26 mm','4 piston']}
    ]
  },
  bmw:{
    brand:'BMW',model:'M4 G82 Coupé',video:'assets/feature-videos/bmw-rotate-clean.mp4',poster:'assets/unveil-five/bmw-poster.webp',
    source:'https://www.press.bmwgroup.com/united-kingdom/article/detail/T0439398EN_GB/the-new-bmw-m4-competition-coup%C3%A9-with-m-xdrive-and-the-new-bmw-m4-competition-convertible-with-m-xdrive',
    features:[
      {name:'M TwinPower',eyebrow:'Hiệu năng',title:'6 xi-lanh thẳng hàng tăng áp kép',type:'power',image:'assets/article-real-v1/bmw-front-real-v1.webp',summary:'Động cơ M TwinPower Turbo kết hợp hộp số M Steptronic để tạo lực kéo lớn trên dải tua rộng.',how:'Hai turbo nén khí nạp; bộ điều khiển động cơ phối hợp áp suất tăng áp và thời điểm phun theo yêu cầu chân ga.',benefit:'Tăng tốc mạnh nhưng vẫn mượt khi sử dụng hàng ngày.',availability:'M4 Competition Coupé · thông số thay đổi theo năm xe',specs:['6 xi-lanh','M TwinPower','8 cấp M Steptronic']},
      {name:'M xDrive',eyebrow:'Truyền động',title:'M xDrive và vi sai chủ động',type:'driveline',image:'assets/gallery-real-v1/bmw-rear-real-v1.webp',summary:'Hệ dẫn động phân bổ lực kéo giữa hai cầu và ưu tiên cảm giác cầu sau.',how:'Bộ ly hợp điều khiển điện tử thay đổi mô-men đến cầu trước; Active M Differential tiếp tục chia lực giữa hai bánh sau.',benefit:'Bám đường tốt khi tăng tốc, đồng thời giữ độ linh hoạt đặc trưng của xe M.',availability:'M4 Competition Coupé với M xDrive',specs:['4WD biến thiên','Active M Differential','Thiên cầu sau']},
      {name:'Adaptive M',eyebrow:'Khung gầm',title:'Hệ thống treo Adaptive M',type:'chassis',image:'assets/gallery-real-v1/bmw-side-real-v1.webp',summary:'Giảm chấn điều khiển điện tử thay đổi lực giảm chấn theo mặt đường và chế độ lái.',how:'Van điện từ phản ứng trong vài mili-giây để điều chỉnh từng bánh; ba bản đồ đặc tính được chọn trong M Setup.',benefit:'Cân bằng giữa độ êm khi đi đường dài và khả năng kiểm soát thân xe khi chạy nhanh.',availability:'Trang bị tiêu chuẩn trên M4 Competition theo tài liệu hãng',specs:['3 bản đồ','Điều khiển điện tử','Phản hồi mili-giây']},
      {name:'M Brakes',eyebrow:'Kiểm soát',title:'Phanh M tích hợp',type:'brake',image:'assets/details-five/bmw.webp',summary:'Hệ thống điều khiển phanh tích hợp làm việc cùng phanh M Compound hoặc phanh carbon-ceramic.',how:'Bộ điều khiển gom chức năng tạo áp suất, trợ lực và ổn định thân xe vào một hệ thống phản hồi nhanh.',benefit:'Cảm giác phanh nhất quán, kiểm soát chính xác hơn khi giảm tốc và vào cua.',availability:'M Compound tiêu chuẩn · carbon-ceramic tùy chọn',specs:['6 piston trước','M Compound','Carbon-ceramic tùy chọn']}
    ]
  },
  porsche:{
    brand:'Porsche',model:'911 GT3 (992)',video:'assets/feature-videos/porsche-rotate-clean.mp4',poster:'assets/unveil-five/porsche-poster.webp',
    source:'https://newsroom.porsche.com/dam/jcr%3Af67ebd45-3aa7-4bf9-9c6a-78d336603b7e/2022%20Porsche%20911%20GT3%20Press%20Kit.pdf',
    features:[
      {name:'Boxer 4.0',eyebrow:'Hiệu năng',title:'Boxer 6 xi-lanh hút khí tự nhiên',type:'power',image:'assets/article-real-v1/porsche-front-real-v1.webp',summary:'Động cơ boxer 4,0 lít quay đến 9.000 vòng/phút, truyền lực trực tiếp đến cầu sau.',how:'Bố trí xi-lanh nằm ngang hạ thấp trọng tâm; không dùng turbo nên phản hồi tăng dần theo vòng tua.',benefit:'Phản hồi chân ga chính xác, âm thanh giàu cảm xúc và cân bằng thân xe tốt hơn.',availability:'911 GT3 thế hệ 992',specs:['4,0 lít','510 PS','9.000 vòng/phút']},
      {name:'Double wishbone',eyebrow:'Khung gầm',title:'Treo trước tay đòn kép',type:'chassis',image:'assets/gallery-real-v1/porsche-side-real-v1.webp',summary:'Cấu trúc từ xe đua giúp kiểm soát bánh trước chính xác hơn trong quá trình nén và vào cua.',how:'Hai tay đòn định vị moay-ơ, giữ góc đặt bánh ổn định; PASM điều chỉnh giảm chấn và hạ gầm 20 mm.',benefit:'Tăng độ bám đầu xe, phản hồi vô-lăng rõ và giữ mặt lốp tiếp xúc tốt hơn.',availability:'Trang bị tiêu chuẩn trên 911 GT3 (992)',specs:['Tay đòn kép','PASM Sport','Hạ gầm 20 mm']},
      {name:'Rear steering',eyebrow:'Điều hướng',title:'Đánh lái trục sau GT3',type:'steering',image:'assets/gallery-real-v1/porsche-rear-real-v1.webp',summary:'Bánh sau đổi góc theo tốc độ để hỗ trợ độ linh hoạt và ổn định.',how:'Ở tốc độ thấp, bánh sau hỗ trợ quay xe gọn; ở tốc độ cao, hệ thống ưu tiên sự ổn định khi chuyển làn và vào cua.',benefit:'Xe phản ứng nhanh hơn mà vẫn chắc chắn ở tốc độ cao.',availability:'Trang bị tiêu chuẩn, hiệu chỉnh riêng cho GT3',specs:['Điều khiển điện','Biến thiên theo tốc độ','GT3 tuning']},
      {name:'PCCB',eyebrow:'Kiểm soát',title:'Phanh gốm carbon PCCB',type:'brake',image:'assets/details-five/porsche.webp',summary:'Đĩa gốm carbon có đường kính lớn, chịu nhiệt tốt và giảm khối lượng không được treo.',how:'Vật liệu composite duy trì ma sát trong dải nhiệt rộng; đĩa trước 410 mm và sau 390 mm.',benefit:'Giảm hiện tượng mất phanh khi chạy nặng và giúp hệ thống treo phản hồi nhanh hơn.',availability:'Tùy chọn Porsche Ceramic Composite Brake',specs:['Trước 410 mm','Sau 390 mm','Tùy chọn PCCB']}
    ]
  },
  mercedes:{
    brand:'Mercedes-AMG',model:'SL 63 4MATIC+',video:'assets/feature-videos/mercedes-rotate-clean.mp4',poster:'assets/unveil-five/mercedes-poster.webp',
    source:'https://media.mercedes-benz.com/en/article/29004d7c-53c6-4531-89b1-4bf163ec3b8e',
    features:[
      {name:'AMG V8',eyebrow:'Hiệu năng',title:'V8 biturbo 4,0 lít',type:'power',image:'assets/article-real-v1/mercedes-front-real-v1.webp',summary:'Động cơ V8 tăng áp kép tạo công suất lớn cho chiếc roadster dẫn động bốn bánh.',how:'Hai bộ tăng áp nén khí nạp; hộp số và hệ điều khiển phân phối mô-men theo chế độ lái.',benefit:'Tăng tốc mạnh, lực kéo dồi dào và vẫn phù hợp cho hành trình dài.',availability:'Mercedes-AMG SL 63 4MATIC+ (R232) · 2022',specs:['3.982 cc','430 kW / 585 hp','315 km/h']},
      {name:'4MATIC+',eyebrow:'Truyền động',title:'AMG Performance 4MATIC+',type:'driveline',image:'assets/gallery-real-v1/mercedes-rear-real-v1.webp',summary:'Hệ dẫn động bốn bánh biến thiên liên tục phối hợp lực kéo theo điều kiện vận hành.',how:'Bộ điều khiển theo dõi độ bám, góc lái và chân ga để phân phối mô-men giữa hai cầu.',benefit:'Tăng độ bám khi xuất phát và giữ xe ổn định trên nhiều loại mặt đường.',availability:'Định danh SL 63 4MATIC+ · cấu hình tùy thị trường',specs:['4WD biến thiên','AMG tuning','Phân bổ tự động'],source:'https://media.mercedes-benz.com/en/article/da21b385-fd24-4077-a4a4-beb40fb51c5a'},
      {name:'Active Ride',eyebrow:'Khung gầm',title:'AMG ACTIVE RIDE CONTROL',type:'chassis',image:'assets/gallery-real-v1/mercedes-side-real-v1.webp',summary:'Hệ thống treo chủ động hạn chế chuyển động lắc ngang của thân xe nhưng vẫn giữ độ êm.',how:'Mạch thủy lực liên kết các giảm chấn và tạo lực bù khi xe vào cua hoặc gặp mặt đường lệch bên.',benefit:'Thân xe phẳng hơn khi chạy nhanh, đồng thời giảm rung lắc cho người ngồi.',availability:'Dòng AMG SL hiệu năng cao · trang bị tùy phiên bản và thị trường',specs:['Ổn định lắc ngang','Giảm chấn thích ứng','Điều khiển thủy lực'],source:'https://media.mercedes-benz.com/en/article/da21b385-fd24-4077-a4a4-beb40fb51c5a'},
      {name:'Rear steering',eyebrow:'Điều hướng',title:'Đánh lái trục sau chủ động',type:'steering',image:'assets/interior-photo-v1/mercedes-amg-sl63-cabin-alt-web.webp',summary:'Góc bánh sau thay đổi theo tốc độ để kết hợp độ linh hoạt trong phố và ổn định khi chạy nhanh.',how:'Ở tốc độ thấp bánh sau xoay ngược chiều bánh trước; ở tốc độ cao chúng chuyển sang cùng chiều.',benefit:'Giảm công sức đánh lái, quay đầu gọn hơn và ổn định hơn khi chuyển hướng nhanh.',availability:'Tùy cấu hình AMG SL 63 và thị trường',specs:['Ngược chiều tốc độ thấp','Cùng chiều tốc độ cao','Điều khiển điện'],source:'https://media.mercedes-benz.com/en/article/da21b385-fd24-4077-a4a4-beb40fb51c5a'}
    ]
  },
  lamborghini:{
    brand:'Lamborghini',model:'Revuelto',video:'assets/feature-videos/lamborghini-rotate-clean.mp4',poster:'assets/unveil-five/lamborghini-poster.webp',
    source:'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/revuelto/2024/brochure/07_23/REVUELTO_DIGITAL_BROCHURE_EN_2024.pdf',
    features:[
      {name:'V12 HPEV',eyebrow:'Hiệu năng',title:'V12 hybrid hiệu năng cao',type:'hybrid',image:'assets/article-real-v1/lamborghini-front-real-v1.webp',summary:'Động cơ V12 phối hợp ba mô-tơ điện để tạo hệ truyền động điện hóa hiệu năng cao HPEV.',how:'Hai mô-tơ phía trước điều khiển lực kéo từng bánh; mô-tơ còn lại hỗ trợ cụm hộp số và động cơ đốt trong.',benefit:'Phản hồi mô-men tức thời, tăng lực kéo bốn bánh và mở rộng khả năng điều khiển thân xe.',availability:'Trang bị tiêu chuẩn trên Revuelto',specs:['V12 + 3 mô-tơ','1.015 CV','HPEV']},
      {name:'Monofuselage',eyebrow:'Cấu trúc',title:'Khung carbon monofuselage',type:'chassis',image:'assets/gallery-real-v1/lamborghini-side-real-v1.webp',summary:'Khoang trung tâm và cấu trúc trước dùng sợi carbon đa công nghệ, lấy cảm hứng từ hàng không.',how:'Vật liệu carbon và Forged Composites tạo một cấu trúc chịu lực cứng nhưng nhẹ quanh khoang hành khách.',benefit:'Tăng độ cứng xoắn, giảm khối lượng và tạo nền tảng an toàn cho hệ truyền động hybrid.',availability:'Cấu trúc tiêu chuẩn của Revuelto',specs:['Carbon monocoque','Forged Composites','Cửa nhôm']},
      {name:'Active aero',eyebrow:'Khí động học',title:'Cánh gió sau chủ động ba vị trí',type:'aero',image:'assets/gallery-real-v1/lamborghini-rear-real-v1.webp',summary:'Cánh gió thay đổi vị trí theo chế độ lái và trạng thái chuyển động của xe.',how:'Bộ chấp hành điều chỉnh góc cánh để ưu tiên lực ép, cân bằng hoặc giảm lực cản.',benefit:'Tăng ổn định khi vào cua và phanh, đồng thời giảm cản gió khi cần tốc độ.',availability:'Trang bị tiêu chuẩn trên Revuelto',specs:['3 vị trí','Điều khiển chủ động','Theo chế độ lái']},
      {name:'CCB Plus',eyebrow:'Kiểm soát',title:'Phanh carbon ceramic CCB Plus',type:'brake',image:'assets/details-five/lamborghini.webp',summary:'Đĩa gốm carbon kích thước lớn kết hợp heo phanh monoblock nhôm.',how:'Mười piston trước và bốn piston sau phân bố lực ép; vật liệu ceramic chịu nhiệt trong các lần phanh liên tiếp.',benefit:'Rút ngắn quãng giảm tốc, chống suy giảm hiệu năng và giảm khối lượng không được treo.',availability:'Trang bị tiêu chuẩn trên Revuelto',specs:['Trước 410 × 38 mm','Sau 390 × 32 mm','10 / 4 piston']}
    ]
  }
};

const FEATURE_ANGLES=['hero','side','rear'];
Object.entries(FEATURE_DATA).forEach(([carId,data])=>{
  data.features.slice(0,3).forEach((feature,index)=>{
    feature.image=`assets/gallery/${carId}-${FEATURE_ANGLES[index]}-exact-v1.webp`;
  });
});

let gsapLoader;
function loadGsap(){
  if(window.gsap)return Promise.resolve(window.gsap);
  if(gsapLoader)return gsapLoader;
  gsapLoader=new Promise((resolve,reject)=>{
    const existing=document.querySelector(`script[src="${GSAP_SRC}"]`);
    if(existing){existing.addEventListener('load',()=>resolve(window.gsap),{once:true});existing.addEventListener('error',reject,{once:true});return;}
    const script=document.createElement('script');script.src=GSAP_SRC;script.async=true;
    script.addEventListener('load',()=>resolve(window.gsap),{once:true});script.addEventListener('error',reject,{once:true});document.head.append(script);
  });
  return gsapLoader;
}

const CAR_POINTS={
  corvette:{engine:[37,54],gear:[69,57],front:[51,59],rear:[79,57],wing:[80,45]},
  bmw:{engine:[37,54],gear:[54,57],front:[49,59],rear:[79,57],wing:[82,47]},
  porsche:{engine:[72,53],gear:[69,56],front:[50,59],rear:[77,57],wing:[78,43]},
  mercedes:{engine:[38,54],gear:[54,57],front:[52,59],rear:[79,57],wing:[82,48]},
  lamborghini:{engine:[69,53],gear:[72,56],front:[52,59],rear:[80,57],wing:[79,44]}
};

function visualPlan(carId,feature){
  const point=CAR_POINTS[carId],engineLeft=point.engine[0]<55;
  const label=(title,note,target,position)=>({title,note,target,position});
  const plans={
    power:{parts:[label(feature.title,'Nơi tạo công suất',point.engine,engineLeft?[8,22]:[68,22]),label('Hộp số','Điều phối mô-men',point.gear,[42,19]),label('Bánh chủ động','Nhận lực kéo',point.rear,[70,82])],paths:[[point.engine,point.gear],[point.gear,point.rear]]},
    flow:{parts:[label('Bình dầu riêng','Giữ dầu ổn định',[28,47],[8,22]),label('Bơm dầu','Tạo áp suất liên tục',[45,56],[42,19]),label('Động cơ','Được bôi trơn',point.engine,[70,82])],paths:[[[28,47],[45,56]],[[45,56],point.engine]]},
    driveline:{parts:[label('Động cơ','Tạo mô-men',point.engine,engineLeft?[8,22]:[68,22]),label('Hộp số / phân phối','Chia lực kéo',point.gear,[39,18]),label('Bánh chủ động','Đưa xe tiến lên',point.rear,[69,82])],paths:[[point.engine,point.gear],[point.gear,point.rear]]},
    chassis:{parts:[label('Hệ treo trước','Kiểm soát bánh trước',point.front,[7,80]),label('Thân xe','Giữ xe cân bằng',[62,52],[40,18]),label('Hệ treo sau','Ổn định đuôi xe',point.rear,[70,80])],paths:[[point.front,[62,52]],[[62,52],point.rear]]},
    brake:{parts:[label('Phanh trước','Giảm tốc chính',point.front,[7,80]),label('Bộ điều khiển','Phân bổ lực phanh',[62,52],[40,18]),label('Phanh sau','Giữ xe ổn định',point.rear,[70,80])],paths:[[[62,52],point.front],[[62,52],point.rear]]},
    steering:{parts:[label('Bánh trước','Nhận lệnh đánh lái',point.front,[7,80]),label('Bộ điều khiển','Tính góc theo tốc độ',[62,52],[40,18]),label('Bánh sau','Đổi hướng hỗ trợ',point.rear,[70,80])],paths:[[point.front,[62,52]],[[62,52],point.rear]]},
    hybrid:{parts:[label('Mô-tơ điện trước','Kéo hai bánh trước',point.front,[7,80]),label('Pin hybrid','Cấp và thu năng lượng',[59,52],[39,18]),label('V12 + mô-tơ sau','Tạo công suất chính',point.engine,[69,80])],paths:[[point.front,[59,52]],[[59,52],point.engine]]},
    aero:{parts:[label('Luồng khí','Đi qua đầu xe',[25,51],[7,22]),label('Thân xe','Dẫn khí ra phía sau',[59,49],[40,18]),label('Cánh gió chủ động','Tăng hoặc giảm lực ép',point.wing,[70,80])],paths:[[[12,40],point.wing],[[10,50],point.wing],[[12,60],point.wing]]}
  };
  return plans[feature.type]||plans.power;
}

function carVisual(carId,feature){
  const plan=visualPlan(carId,feature);
  const path=([start,end])=>{const middle=(start[0]+end[0])/2;return `M ${start[0]} ${start[1]} C ${middle} ${start[1]}, ${middle} ${end[1]}, ${end[0]} ${end[1]}`;};
  return `<svg class="z-fx-car-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="z-fx-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${plan.paths.map(points=>`<path data-fx-flow d="${path(points)}"/>`).join('')}${plan.parts.map(part=>`<line data-fx-connector x1="${part.position[0]}" y1="${part.position[1]}" x2="${part.target[0]}" y2="${part.target[1]}"/><circle data-fx-zone cx="${part.target[0]}" cy="${part.target[1]}" r="4.6"/><circle data-fx-point cx="${part.target[0]}" cy="${part.target[1]}" r="1.1"/>`).join('')}</svg><div class="z-fx-car-labels">${plan.parts.map((part,index)=>`<div data-fx-label style="--fx-x:${part.position[0]}%;--fx-y:${part.position[1]}%"><b>${index+1}</b><span><strong>${part.title}</strong><small>${part.note}</small></span></div>`).join('')}</div>`;
}

function readStudioCar(studio){
  try{const config=JSON.parse(studio?.dataset.config||'{}');return FEATURE_DATA[config.car]?config.car:'';}catch{return '';}
}

export function mountFeatureExplorer(host,studio){
  if(!host||host.dataset.mounted==='true')return;
  host.dataset.mounted='true';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let carId=readStudioCar(studio)||'lamborghini',featureIndex=0,mode='image';
  host.innerHTML=`<div class="z-fx-shell">
    <header class="z-fx-head"><div><p class="z-fx-kicker">FEATURE EXPLORER / TECH LAB</p><h2>Công nghệ được nhìn thấy.</h2></div><p>Chọn một tính năng, sau đó chuyển riêng giữa hình ảnh, video và animation kỹ thuật.</p></header>
    <div class="z-fx-car-tabs" role="tablist" aria-label="Chọn mẫu xe">${CAR_ORDER.map(id=>`<button type="button" role="tab" data-fx-car="${id}">${FEATURE_DATA[id].brand}<small>${FEATURE_DATA[id].model}</small></button>`).join('')}</div>
    <div class="z-fx-workbench">
      <nav class="z-fx-feature-rail" aria-label="Các công nghệ" data-fx-features></nav>
      <figure class="z-fx-stage" data-fx-stage>
        <img data-fx-image alt="" decoding="async">
        <video data-fx-video muted loop playsinline controls preload="metadata" hidden>Trình duyệt của bạn không hỗ trợ video.</video>
        <div class="z-fx-animation-screen" data-fx-animation hidden>
          <img data-fx-animation-car alt="" decoding="async">
          <div class="z-fx-animation-vignette" aria-hidden="true"></div>
          <div data-fx-car-visual></div>
        </div>
        <div class="z-fx-shade" aria-hidden="true"></div>
        <div class="z-fx-media-tools" aria-label="Chọn hình ảnh, video hoặc animation"><button type="button" data-fx-mode="image">Hình ảnh</button><button type="button" data-fx-mode="video">Video</button><button type="button" data-fx-mode="animation">Animation</button></div>
        <figcaption><span data-fx-caption></span><strong data-fx-counter></strong></figcaption>
      </figure>
      <article class="z-fx-info" data-fx-info aria-live="polite"></article>
    </div>
    <p class="z-fx-disclaimer">Thông tin dùng cho trải nghiệm trình bày đồ án. Trang bị có thể thay đổi theo năm xe, cấu hình và thị trường.</p>
  </div>`;
  const stage=host.querySelector('[data-fx-stage]'),image=host.querySelector('[data-fx-image]'),video=host.querySelector('[data-fx-video]'),animationScreen=host.querySelector('[data-fx-animation]'),animationCar=host.querySelector('[data-fx-animation-car]'),carVisualHost=host.querySelector('[data-fx-car-visual]'),info=host.querySelector('[data-fx-info]');

  function activeData(){return FEATURE_DATA[carId].features[featureIndex];}
  function motionTargets(){return [...carVisualHost.querySelectorAll('[data-fx-flow],[data-fx-point],[data-fx-zone],[data-fx-label]')];}
  function stopMotion(){if(window.gsap)window.gsap.killTweensOf([image,video,animationScreen,info,...motionTargets()]);}
  function updateMediaMode(){
    const car=FEATURE_DATA[carId],isImage=mode==='image',isVideo=mode==='video',isAnimation=mode==='animation';
    stopMotion();stage.dataset.mode=mode;image.hidden=!isImage;video.hidden=!isVideo;animationScreen.hidden=!isAnimation;
    host.querySelectorAll('[data-fx-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.fxMode===mode)));
    if(isVideo){
      if(video.dataset.car!==carId){video.src=car.video;video.poster=car.poster;video.dataset.car=carId;video.load();}
      if(!reduced.matches)video.play().catch(()=>{});
    }else video.pause();
  }
  async function animateSelection(){
    if(reduced.matches)return;
    try{
      const gsap=await loadGsap();if(!gsap)return;
      const paths=[...carVisualHost.querySelectorAll('[data-fx-flow]')],nodes=[...carVisualHost.querySelectorAll('[data-fx-point]')],zones=[...carVisualHost.querySelectorAll('[data-fx-zone]')],labels=[...carVisualHost.querySelectorAll('[data-fx-label]')];
      const media=mode==='image'?image:mode==='video'?video:animationScreen;
      gsap.killTweensOf([image,video,animationScreen,info,...paths,...nodes,...zones,...labels]);
      gsap.fromTo(media,{autoAlpha:.35,scale:1.018},{autoAlpha:1,scale:1,duration:.65,ease:'power2.out'});
      gsap.fromTo(info,{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.55,ease:'power2.out'});
      if(mode==='animation'){
        paths.forEach((path,index)=>{const length=Math.max(1,path.getTotalLength());gsap.fromTo(path,{strokeDasharray:`${Math.max(18,length*.16)} ${length}`,strokeDashoffset:length},{strokeDashoffset:-length,duration:1.8+index*.18,repeat:-1,ease:'none',overwrite:'auto'});});
        gsap.fromTo(labels,{autoAlpha:0,y:9},{autoAlpha:1,y:0,duration:.45,stagger:.1,ease:'power2.out',overwrite:'auto'});
        gsap.fromTo(zones,{autoAlpha:.25,scale:.7,transformOrigin:'50% 50%'},{autoAlpha:.92,scale:1.24,duration:.82,stagger:.11,repeat:-1,yoyo:true,ease:'sine.inOut',overwrite:'auto'});
        gsap.fromTo(nodes,{autoAlpha:.65,scale:.7,transformOrigin:'50% 50%'},{autoAlpha:1,scale:1.18,duration:.62,stagger:.11,repeat:-1,yoyo:true,ease:'sine.inOut',overwrite:'auto'});
      }
    }catch{host.dataset.animation='css';}
  }
  function renderFeature(){
    const car=FEATURE_DATA[carId],feature=activeData();
    host.querySelectorAll('[data-fx-feature]').forEach((button,index)=>{const active=index===featureIndex;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
    image.src=feature.image;image.alt=`${car.brand} ${car.model} — ${feature.title}`;
    animationCar.src=car.poster;animationCar.alt=`${car.brand} ${car.model} với vị trí ${feature.title} được đánh dấu`;
    host.querySelector('[data-fx-caption]').textContent=`${feature.eyebrow} / ${feature.title}`;
    host.querySelector('[data-fx-counter]').textContent=`${String(featureIndex+1).padStart(2,'0')} / ${String(car.features.length).padStart(2,'0')}`;
    carVisualHost.innerHTML=carVisual(carId,feature);
    stage.dataset.tech=feature.type;
    info.innerHTML=`<p class="z-fx-info-kicker">${feature.eyebrow} / ${car.model}</p><h3>${feature.title}</h3><p class="z-fx-summary">${feature.summary}</p><div class="z-fx-explain"><section><span>01 · Cách hoạt động</span><p>${feature.how}</p></section><section><span>02 · Lợi ích</span><p>${feature.benefit}</p></section></div><dl>${feature.specs.map((spec,index)=>`<div><dt>${['Thông số','Hệ thống','Điểm chính'][index]}</dt><dd>${spec}</dd></div>`).join('')}</dl><div class="z-fx-equipped"><span>Phiên bản trang bị</span><strong>${feature.availability}</strong></div><a class="z-fx-source" href="${feature.source||car.source}" target="_blank" rel="noopener">Nguồn kỹ thuật chính hãng <b aria-hidden="true">↗</b></a>`;
    updateMediaMode();animateSelection();
  }
  function renderCar(){
    const car=FEATURE_DATA[carId];
    host.querySelectorAll('[data-fx-car]').forEach(button=>{const active=button.dataset.fxCar===carId;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    host.querySelector('[data-fx-features]').innerHTML=car.features.map((feature,index)=>`<button type="button" data-fx-feature="${index}" aria-pressed="${index===featureIndex}"><span>${String(index+1).padStart(2,'0')}</span><strong>${feature.name}</strong><small>${feature.eyebrow}</small></button>`).join('');
    renderFeature();
  }
  host.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.fxCar&&button.dataset.fxCar!==carId){carId=button.dataset.fxCar;featureIndex=0;renderCar();}
    if(button.dataset.fxFeature!==undefined){featureIndex=Number(button.dataset.fxFeature)||0;renderFeature();}
    if(button.dataset.fxMode){mode=button.dataset.fxMode;updateMediaMode();animateSelection();}
  });
  host.addEventListener('keydown',event=>{
    const button=event.target.closest('[data-fx-car]');if(!button||!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();const index=CAR_ORDER.indexOf(carId),step=event.key==='ArrowRight'?1:-1;carId=CAR_ORDER[(index+step+CAR_ORDER.length)%CAR_ORDER.length];featureIndex=0;renderCar();host.querySelector(`[data-fx-car="${carId}"]`).focus();
  });
  const syncStudio=event=>{const next=event.detail?.car;if(FEATURE_DATA[next]&&next!==carId){carId=next;featureIndex=0;renderCar();}};
  studio?.addEventListener('studio-change',syncStudio);
  reduced.addEventListener('change',()=>{if(reduced.matches){video.pause();stopMotion();}else if(mode==='video')video.play().catch(()=>{});else if(mode==='animation')animateSelection();});
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting){video.pause();stopMotion();}else if(mode==='video'&&!reduced.matches)video.play().catch(()=>{});else if(mode==='animation'&&!reduced.matches)animateSelection();},{threshold:.08}).observe(host);
  renderCar();loadGsap().catch(()=>{host.dataset.animation='css';});
}
