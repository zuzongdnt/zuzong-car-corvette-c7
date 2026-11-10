import {cars,money} from './studio-data.js';
import {TECH_SPECS} from './technical-specs.js';
import {VERSION_DATA} from './version-comparison.js';
import {FEATURE_DATA} from './feature-explorer.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const normalize=value=>String(value??'').toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');

export function mountCarAdvisor(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let carId='lamborghini';
  try{carId=JSON.parse(studio?.dataset.config||'{}').car||studio?.dataset.car||carId;}catch{}
  host.innerHTML=`<div class="z-advisor-shell"><header class="z-advisor-head"><div><p class="z-experience-kicker">AI CAR ADVISOR · TRA CỨU THEO NGUỒN</p><h2>Hỏi về chiếc xe<br><em>bạn đang quan tâm.</em></h2></div><p>Tra thông số, công nghệ, phiên bản và giá minh họa. Mỗi câu trả lời đều kèm liên kết nguồn hoặc ghi rõ phần nào chỉ là mô phỏng.</p></header><div class="z-advisor-workspace"><div class="z-advisor-controls"><label for="z-advisor-car">Chọn mẫu xe</label><select id="z-advisor-car" data-advisor-car>${cars.map(car=>`<option value="${car.id}">${esc(car.brand)} ${esc(car.name)}</option>`).join('')}</select><div class="z-advisor-prompts" aria-label="Câu hỏi gợi ý"><button type="button" data-question="Động cơ và công suất của mẫu này là bao nhiêu?">Động cơ & công suất</button><button type="button" data-question="Các phiên bản của mẫu này khác nhau thế nào?">So sánh phiên bản</button><button type="button" data-question="Giá và chi phí sử dụng được tính ra sao?">Giá & chi phí</button><button type="button" data-question="Công nghệ nổi bật của xe là gì?">Công nghệ nổi bật</button></div><form data-advisor-form><label class="sr-only" for="z-advisor-question">Nhập câu hỏi về xe</label><input id="z-advisor-question" name="question" maxlength="180" placeholder="Ví dụ: Bản nào tăng tốc nhanh nhất?" required><button type="submit" aria-label="Tra cứu câu hỏi">Tra cứu ↗</button></form><p class="z-advisor-disclaimer">Bản demo chạy ngay trên trình duyệt, tra cứu bộ dữ liệu đã ghi nguồn, chưa kết nối mô hình AI trực tuyến. Không tự suy đoán thông số còn thiếu.</p></div><article class="z-advisor-answer" data-advisor-answer aria-live="polite"><span>TRẢ LỜI THEO DỮ LIỆU XE</span><h3 data-advisor-title></h3><div data-advisor-body></div><a data-advisor-source target="_blank" rel="noopener noreferrer external">Mở nguồn hãng ↗</a></article></div></div>`;
  const select=host.querySelector('[data-advisor-car]');
  const form=host.querySelector('[data-advisor-form]');
  const input=form.elements.question;
  select.value=carId;
  function updateCar(id){if(cars.some(car=>car.id===id)){carId=id;select.value=id;}}
  studio?.addEventListener('studio-change',event=>updateCar(event.detail?.car));
  function render(question){
    const car=cars.find(item=>item.id===carId)||cars[0];
    const spec=TECH_SPECS[car.id],versions=VERSION_DATA[car.id],knowledge=FEATURE_DATA[car.id];
    const q=normalize(question);
    let title='',body='',source=spec.source,sourceLabel=spec.sourceLabel;
    if(/gia|chi phi|tra gop|vay|tien|price|cost|xang|nhien lieu|tieu hao|fuel/.test(q)){
      title=/xang|nhien lieu|tieu hao|fuel/.test(q)?`Chi phí sử dụng ${car.brand} ${car.name}`:`Giá tham khảo của ${car.brand} ${car.name}`;
      body=`<p>Giá khởi điểm trong đồ án là <strong>${money(car.price)}</strong>. Đây là giá minh họa để thao tác với công cụ, không phải báo giá bán hiện hành của hãng hoặc đại lý.</p><p>Dữ liệu hiện chưa có mức tiêu thụ nhiên liệu chính hãng cho đúng cấu hình này. Khoản chi sử dụng tại <a href="#smart-ownership">Bảng tính chi phí</a> dựa trên giả định do bạn nhập, không phải số liệu hãng.</p><p>Không có nguồn báo giá hãng trong dữ liệu hiện tại.</p>`;
      source='';sourceLabel='';
    }else if(/phien ban|cac ban|ban nao|so sanh|trim|touring|competition|opera unica/.test(q)){
      title=`Các phiên bản được ghi nhận của ${versions.line}`;
      const quickest=Math.min(...versions.variants.map(item=>item.accelN));
      const fastest=versions.variants.filter(item=>item.accelN===quickest);
      const quickestAnswer=/nhanh nhat|tang toc tot|tang toc nhanh/.test(q)?`<p><strong>Thời gian 0–100 km/h thấp nhất trong danh sách:</strong> ${fastest.map(item=>esc(item.name)).join(', ')} · ${esc(fastest[0].accel)}.</p>`:'';
      body=`<p>Phạm vi dữ liệu: ${esc(versions.scope)}.</p>${quickestAnswer}<ul>${versions.variants.map(item=>`<li><strong>${esc(item.name)}</strong>: ${esc(item.power)}; 0–100 km/h ${esc(item.accel)}; ${esc(item.gearbox)}. ${esc(item.difference)}</li>`).join('')}</ul><p>Một số phiên bản không có công bố thông số riêng. Khi đó, câu trả lời giữ nguyên trạng thái “không công bố” thay vì ước đoán.</p>`;
      source=versions.variants[0]?.source||spec.source;sourceLabel=versions.variants[0]?.sourceLabel||spec.sourceLabel;
    }else if(/cong nghe|tinh nang|phanh|treo|camera|dau khi|xdrive|pasm|pccb|brake|dry sump|can te|turbo|hpev|adas/.test(q)){
      const queryTerms=q.split(/[^a-z0-9]+/).filter(term=>term.length>2);
      const scored=knowledge.features.map(feature=>({feature,score:queryTerms.reduce((sum,term)=>sum+(normalize(`${feature.name} ${feature.title} ${feature.summary} ${feature.how}`).includes(term)?1:0),0)})).sort((a,b)=>b.score-a.score);
      const matches=scored[0]?.score?scored.filter(item=>item.score===scored[0].score).slice(0,2).map(item=>item.feature):knowledge.features.slice(0,2);
      title=`Công nghệ trên ${knowledge.model}`;
      body=`<p>Các mục dưới đây lấy từ nội dung tính năng đã ghi nguồn cho mẫu xe. Trang bị thực tế có thể phụ thuộc năm xe, phiên bản và thị trường.</p>${matches.map(feature=>`<section class="z-advisor-feature"><h4>${esc(feature.title)}</h4><p>${esc(feature.how)}</p><p><strong>Lợi ích mô tả:</strong> ${esc(feature.benefit)}</p><small>Phạm vi: ${esc(feature.availability)}</small></section>`).join('')}`;
      source=knowledge.source;sourceLabel=`Tài liệu hãng về ${knowledge.model}`;
    }else{
      title=`Thông số tham khảo · ${spec.model}`;
      body=`<p><strong>${esc(spec.variant)}</strong></p><dl class="z-advisor-spec-grid"><div><dt>Động cơ</dt><dd>${esc(spec.engine)}</dd></div><div><dt>Công suất</dt><dd>${esc(spec.powerLabel)}</dd></div><div><dt>Mô-men xoắn</dt><dd>${esc(spec.torqueLabel)}</dd></div><div><dt>0–100 km/h</dt><dd>${esc(String(spec.accel).replace('.',','))} giây</dd></div><div><dt>Tốc độ tối đa</dt><dd>${esc(spec.speedLabel)}</dd></div><div><dt>Dẫn động</dt><dd>${esc(spec.drive)}</dd></div></dl><p>Đây là số liệu theo đúng phiên bản tham khảo, không đại diện mọi cấu hình của cùng dòng xe.</p>`;
    }
    host.querySelector('[data-advisor-title]').textContent=title;
    host.querySelector('[data-advisor-body]').innerHTML=body;
    const link=host.querySelector('[data-advisor-source]');link.hidden=!source;if(source){link.href=source;link.textContent=`${sourceLabel} ↗`;}
  }
  form.addEventListener('submit',event=>{event.preventDefault();const question=input.value.trim();if(question)render(question);});
  host.addEventListener('click',event=>{const button=event.target.closest('[data-question]');if(!button)return;input.value=button.dataset.question;render(input.value);});
  render('Thông số kỹ thuật cơ bản');
}
