import {cars,getCar} from './studio-data.js';
import {VERSION_DATA} from './version-comparison.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const QUESTIONS=[
  {car:'corvette',ask:'Mẫu nào được công bố với LT1 V8 6,2 L hút khí tự nhiên?',hint:'Gợi ý: thân xe coupé thể thao đến từ Chevrolet.'},
  {car:'bmw',ask:'Mẫu nào dùng động cơ I6 S58 3,0 L tăng áp kép?',hint:'Gợi ý: đây là chiếc M4 thế hệ G82.'},
  {car:'porsche',ask:'Mẫu nào dùng động cơ Boxer 6 4,0 L hút khí tự nhiên?',hint:'Gợi ý: cấu hình này thuộc dòng 911 GT3.'},
  {car:'mercedes',ask:'Mẫu nào có phiên bản SL 63 4MATIC+ với V8 4,0 L biturbo?',hint:'Gợi ý: một chiếc roadster của Mercedes-AMG.'},
  {car:'lamborghini',ask:'Mẫu nào kết hợp V12 6,5 L với ba mô-tơ điện?',hint:'Gợi ý: siêu xe hybrid của Lamborghini.'}
].map(item=>{const variant=VERSION_DATA[item.car].variants.find(row=>row.tag==='Mẫu đang xem')||VERSION_DATA[item.car].variants[0];return {...item,variant};});

export function mountCarQuiz(host){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let index=0,score=0,selected='';
  function render(){
    if(index>=QUESTIONS.length){
      host.innerHTML=`<div class="z-quiz-shell"><header class="z-quiz-heading"><div><p class="z-experience-kicker">CAR QUIZ / KIỂM TRA NHANH</p><h2>Bạn nhớ được<br><em>bao nhiêu điều?</em></h2></div><p>Hoàn thành ${QUESTIONS.length} câu hỏi về năm mẫu xe trong bộ sưu tập.</p></header><div class="z-quiz-result"><span>ĐIỂM CỦA BẠN</span><strong>${score}<small> / ${QUESTIONS.length}</small></strong><p>${score===QUESTIONS.length?'Bạn đã nhận ra hết cả năm cấu hình động cơ.':score>=3?'Bạn đã nắm được nhiều điểm khác nhau giữa các mẫu xe.':'Mỗi câu trả lời vừa rồi là một điểm mới để khám phá.'}</p><button type="button" data-quiz-restart>Làm lại bài trắc nghiệm</button><a href="#products-catalog">Xem lại bộ sưu tập ↗</a></div></div>`;return;
    }
    const question=QUESTIONS[index],correct=getCar(question.car),answered=Boolean(selected);
    const result=answered?`<div class="z-quiz-feedback ${selected===question.car?'is-correct':'is-wrong'}" role="status" aria-live="polite"><strong>${selected===question.car?'Chính xác.':'Chưa đúng.'} Đáp án: ${esc(correct.brand)} ${esc(correct.name)}.</strong><p>${esc(correct.name)} dùng ${esc(question.variant.engine)}.</p><a href="${esc(question.variant.source)}" target="_blank" rel="noopener noreferrer">Xem nguồn hãng: ${esc(question.variant.sourceLabel)} ↗</a></div>`:'';
    host.innerHTML=`<div class="z-quiz-shell"><header class="z-quiz-heading"><div><p class="z-experience-kicker">CAR QUIZ / KIỂM TRA NHANH</p><h2>Đoán chiếc xe.<br><em>Biết thêm một điều.</em></h2></div><p>Chọn mẫu xe phù hợp với thông số được công bố. Mỗi đáp án đều kèm giải thích và nguồn.</p></header><section class="z-quiz-card" aria-labelledby="z-quiz-question"><div class="z-quiz-progress"><span>CÂU ${index+1} / ${QUESTIONS.length}</span><b>Đúng ${score}</b><i><b style="--quiz-progress:${(index+1)/QUESTIONS.length*100}%"></b></i></div><h3 id="z-quiz-question">${esc(question.ask)}</h3><p class="z-quiz-hint">${esc(question.hint)}</p><div class="z-quiz-answers" role="group" aria-label="Chọn câu trả lời">${cars.map(car=>`<button type="button" data-quiz-answer="${car.id}" aria-pressed="${selected===car.id}" ${answered?'disabled':''}><span>${esc(car.brand)}</span><strong>${esc(car.name)}</strong>${selected===car.id?'<i aria-hidden="true">✓</i>':''}</button>`).join('')}</div>${result}${answered?`<button type="button" class="z-quiz-next" data-quiz-next>${index===QUESTIONS.length-1?'Xem kết quả':'Câu tiếp theo'} ↗</button>`:''}</section></div>`;
  }
  host.addEventListener('click',event=>{
    const answer=event.target.closest('[data-quiz-answer]');
    if(answer&&!selected){selected=answer.dataset.quizAnswer;if(selected===QUESTIONS[index].car)score++;render();return;}
    if(event.target.closest('[data-quiz-next]')){index++;selected='';render();return;}
    if(event.target.closest('[data-quiz-restart]')){index=0;score=0;selected='';render();}
  });
  render();
}
