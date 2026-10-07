// ===== إعدادات: عدّلها قبل النشر =====
const CONTACT={phone:'01555634592',whatsapp:'201555634592',telegram:''}; // telegram: لينك القناة https://t.me/... | whatsapp: رقم دولي بدون + مثل 2010xxxxxxxx
const SITE_NOTE='شغلك';
const TRANSITION_MS=1250; // مدة شاشة الانتقال قبل صفحة التفاصيل (0 = إلغاء)
// =====================================
const D=(window.JOBS||[]).filter(j=>!j.closed);
const CN={f:'مصانع',s:'أمن',g:'محطات بنزين'},DOCS={f:['البطاقة الشخصية (تكفي في أغلب المصانع)'],s:['البطاقة الشخصية','شهادة الميلاد','شهادة الجيش','المؤهل الدراسي','فيش جنائي ساري'],g:['البطاقة الشخصية','شهادة الميلاد','شهادة الجيش','المؤهل','فيش جنائي ساري','جزمة سيفتي','برنت تأمين','كعب عمل','نموذج 111']};
const HS={1:'يوجد',0:'لا يوجد',2:'غير مذكور'};
const S={tab:'jobs',c:'all',q:'',p:'',h:false,m:false,t:false,k:'r',d:-1},$=s=>document.querySelector(s),app=$('#app');
const fmt=n=>n.toLocaleString('en'),hs=j=>j.h?j.h+' ساعة':'غير مذكور';
const norm=s=>String(s).replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/[ىئ]/g,'ي').replace(/ؤ/g,'و').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).toLowerCase();
const rate=j=>j.h?Math.round(j.m/(30*j.h)*10)/10:null; // أعلى عرض ÷ (30 يوم × ساعات اليوم)
const hc=j=>j.s==1?'ok':j.s==0?'no':'un';
const ml=j=>/3 وجبات/.test(j.x)?3:/وجبتان/.test(j.x)?2:/وجبة/.test(j.x)?1:0; // عدد الوجبات المذكورة في الإعلان
const mlt=j=>{const n=ml(j);if(!n)return'غير مذكور';const m=j.x.match(/وجبت\S*\s+(بمصنع\s+[^\s،]+|مدعمتان)/);return(n==3?'3 وجبات':n==2?'وجبتان':'وجبة')+(m?` (${m[1]})`:'')};
const tr=j=>{const m=j.x.match(/مواصلات[^،.]*/);if(!m)return null;const s=m[0].trim(),r=s.replace(/^مواصلات\s*/,'');return{k:/داخل|من السكن/.test(s)?'i':/\sمن\s|خط/.test(s)?'e':'u',r}}; // المواصلات: i داخلية، e خارجية (من مناطق بره)، u مجانية بدون تحديد
const trl=t=>t?({i:'داخلية',e:'خارجية',u:'مجانية'})[t.k]:'غير مذكور';
const trs=t=>t&&t.r&&!['داخلية','مجانية'].includes(t.r)?`<br><small>${t.r}</small>`:'';
const hn=j=>{const m=j.x.match(/سكن للمغتربين|السكن بكاميرات|إقامة كاملة|استلام العمل والسكن في نفس اليوم/);return m?m[0]:''};
const list=()=>{const t=norm(S.q).split(/\s+/).filter(Boolean),mr=norm(S.q).trim().match(/^(?:رقم|الرقم|المرجعي|مرجعي|ref|#|\s)*(\d+)$/),rj=mr&&D.find(j=>j.ref==mr[1]);if(rj)return[rj]; // بحث بالرقم المرجعي: بيطلع الإعلان ده بس
 
 let L=D.filter(j=>(S.c=='all'||j.c==S.c)&&(!S.p||j.p==S.p)&&(!S.h||j.s==1)&&(!S.m||ml(j)>0)&&(!S.t||(tr(j)||{}).k=='e')&&(h=>t.every(w=>h.includes(w)))(norm(j.t+' '+j.p+' '+j.x+' '+CN[j.c])));
 if(S.tab!='cmp')return L;
 const v=j=>S.k=='r'?rate(j):S.k=='m'?j.m:S.k=='a'?j.a:(j.h||null);
 return L.sort((a,b)=>{const x=v(a),y=v(b);return x==null?(y==null?0:1):y==null?-1:S.d*(x-y)})};
const tabs=[['jobs','الوظائف'],['cmp','جدول المقارنة']];
const nav=()=>$('#nav').innerHTML=tabs.map(t=>`<a href="#/${t[0]=='jobs'?'':t[0]}" class="${S.tab==t[0]?'on':''}" ${S.tab==t[0]?'aria-current="page"':''}>${t[1]}</a>`).join('');
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),3500)}
function bar(){const ps=[...new Set(D.map(j=>j.p))].sort();return`<div class="bar">${[['all','الكل'],['f','مصانع'],['s','أمن'],['g','محطات بنزين']].map(c=>`<button class="chip ${S.c==c[0]?'on':''}" data-c="${c[0]}">${c[1]}</button>`).join('')}<input id="q" type="search" aria-label="بحث" placeholder="ابحث بالاسم أو المكان أو الرقم" value="${S.q}"><select id="p" aria-label="المكان"><option value="">كل الأماكن</option>${ps.map(p=>`<option ${S.p==p?'selected':''}>${p}</option>`).join('')}</select><button class="chip ${S.h?'on':''}" id="hh" aria-pressed="${S.h}">فيه سكن فقط</button><button class="chip ${S.m?'on':''}" id="mm" aria-pressed="${S.m}">فيه وجبات فقط</button><button class="chip ${S.t?'on':''}" id="tt" aria-pressed="${S.t}">مواصلات خارجية فقط</button></div>`}
function bind(){app.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{S.c=b.dataset.c;render()});
 const q=$('#q');if(q)q.onkeydown=e=>{if(e.key=='Enter'){const l=list();if(l.length==1)location.hash='#/job/'+l[0].ref}};q.oninput=()=>{S.q=q.value;const x=q.selectionStart;render();$('#q').focus();$('#q').setSelectionRange(x,x)};
 const p=$('#p');if(p)p.onchange=()=>{S.p=p.value;render()};
 const h=$('#hh');if(h)h.onclick=()=>{S.h=!S.h;if(S.h&&S.tab=='cmp'){S.k='m';S.d=-1}render()};
 const tt=$('#tt');if(tt)tt.onclick=()=>{S.t=!S.t;if(S.t&&S.tab=='cmp'){S.k='m';S.d=-1}render()};
 const mm=$('#mm');if(mm)mm.onclick=()=>{S.m=!S.m;if(S.m&&S.tab=='cmp'){S.k='m';S.d=-1}render()};
 app.querySelectorAll('[data-i]').forEach(e=>{const o=()=>{location.hash='#/job/'+e.dataset.i};e.onclick=o;e.onkeydown=k=>{if(k.key=='Enter'||k.key==' '){k.preventDefault();o()}}});
 app.querySelectorAll('[data-k]').forEach(t=>t.onclick=()=>{const k=t.dataset.k;S.d=S.k==k?-S.d:(k=='r'||k=='m'?-1:1);S.k=k;render()})}
function render(){nav();const L=list();let h='';
 h+=`<div class="hero"><div class="w"><h1>${S.tab=='jobs'?'وظيفتك الجاية بتبدأ من هنا':'قارن الأجر والساعات قبل ما تقدّم'}</h1><p>فرص عمل في المصانع والأمن ومحطات البنزين، بأجور واضحة وتفاصيل كاملة.</p></div></div>`;
 h+='<main><div class="w">';
 if(S.tab=='jobs')h+=bar()+`<div class="grid">${L.map(j=>`<article class="card ${j.c}" tabindex="0" role="link" data-i="${j.ref}"><span class="tag">${CN[j.c]}</span><h3>${j.t}</h3><div class="pl">${j.p}</div><div class="pay">${j.pay}</div><div class="chips"><span>رقم مرجعي ${j.ref}</span><span>${hs(j)}</span><span>سكن: ${HS[j.s]}</span>${ml(j)?`<span>${mlt(j)}</span>`:''}${(tr(j)||{}).k=='e'?'<span>مواصلات خارجية</span>':''}<span>${j.a}–${j.b} سنة</span></div></article>`).join('')||'<p>مفيش نتائج. جرّب تشيل فلتر.</p>'}</div>`;
 if(S.tab=='cmp')h+=bar()+`<div class="tw"><table><tr><th>رقم</th><th>الوظيفة</th><th>المكان</th><th data-k="m" tabindex="0">الأجر في الإعلان ⇅</th><th data-k="r" tabindex="0">ج/ساعة تقريبي ⇅</th><th data-k="h">الساعات ⇅</th><th>السكن</th><th>الوجبات</th><th>المواصلات</th><th data-k="a">السن ⇅</th><th>الأوراق</th></tr>${L.map(j=>`<tr class="r" tabindex="0" role="link" data-i="${j.ref}"><td>${j.ref}</td><td><b>${j.t}</b></td><td>${j.p}</td><td>${j.pay}</td><td>${rate(j)==null?'<span class="un">—</span>':rate(j)}</td><td class="${j.h>=16?'no':''}">${hs(j)}</td><td class="${hc(j)}">${HS[j.s]}${hn(j)?`<br><small>${hn(j)}</small>`:''}</td><td class="${ml(j)?'ok':'un'}">${mlt(j)}</td><td class="${(tr(j)||{}).k=='e'?'ok':'un'}">${trl(tr(j))}${trs(tr(j))}</td><td class="${j.a<18?'no':''}">${j.a}–${j.b}</td><td>${j.c=='f'&&!/فيش|ملف/.test(j.x)?'بطاقة':j.c=='f'?'ملف كامل':j.c=='s'?'ملف كامل + فيش':'ملف كامل + 9 أوراق'}</td></tr>`).join('')}</table></div><p style="color:var(--mut);margin-top:8px;font-size:13px">ترتيب \"الأجر في الإعلان\" بيعتمد على أعلى رقم مذكور في الإعلان (اضغط على العنوان يقلب الترتيب). ج/ساعة = أعلى أجر في الإعلان ÷ (30 يوم × ساعات اليوم)، وبيفترض شغل كل الأيام بدون إجازة. تقدير للمقارنة. اضغط أي صف للتفاصيل.</p>`;
 app.innerHTML=h+'</div></main>';bind()}
function applyTo(j){const m=`السلام عليكم، عايز أقدّم على وظيفة: ${j.t} – ${j.p}. ممكن تفاصيل التقديم؟`;
 try{navigator.clipboard&&navigator.clipboard.writeText(m)}catch(e){}
 const u=CONTACT.whatsapp?`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(m)}`:CONTACT.telegram;
 if(u)window.open(u,'_blank','noopener');else toast('اتنسخت رسالة التقديم، ابعتها لنا على واتساب.')}
function detail(j){S.tab='';nav();const d=DOCS[j.c],r=rate(j);
 app.innerHTML=`<main><div class="w"><button class="back" id="bk">رجوع للوظائف</button><div class="dh ${j.c}"><span>${CN[j.c]}</span><h1>${j.t}</h1><div>${j.p}</div><div class="pay">${j.pay}</div></div><div class="facts"><div><small>الرقم المرجعي</small><b>${j.ref}</b></div><div><small>ج/ساعة تقريبي (أعلى أجر)</small><b>${r==null?'غير مذكور':r}</b></div><div><small>ساعات العمل</small><b>${hs(j)}</b></div><div><small>السكن</small><b>${HS[j.s]}</b></div>${tr(j)?`<div><small>المواصلات</small><b>${trl(tr(j))}${tr(j).r&&!['داخلية','مجانية'].includes(tr(j).r)?': '+tr(j).r:''}</b></div>`:''}<div><small>السن</small><b>${j.a} – ${j.b}</b></div>${j.d?`<div><small>تاريخ الإعلان</small><b>${j.d}</b></div>`:''}</div>${j.x?`<div class="box"><h2>تفاصيل إضافية</h2><p>${j.x}</p></div>`:''}<div class="box"><h2>الأوراق المطلوبة</h2><ul>${d.map(x=>`<li>${x}</li>`).join('')}</ul></div>${j.img.length?`<div class="gal">${j.img.map((i,k)=>`<figure><a href="images/${i}" target="_blank" rel="noopener"><img src="images/${i}" loading="lazy" alt="صورة الإعلان: ${j.t} – ${j.p} – ${j.pay}"></a></figure>`).join('')}</div>`:''}<button class="cta" id="ap">قدّم الآن على واتساب</button><a class="sec" href="tel:${CONTACT.phone}" dir="ltr">اتصل: ${CONTACT.phone}</a><button class="sec" id="sh">شارك على واتساب</button></div></main>`;
 $('#bk').onclick=()=>location.hash='#/';$('#ap').onclick=()=>applyTo(j);
 $('#sh').onclick=()=>window.open('https://wa.me/?text='+encodeURIComponent(`${j.t} – ${j.p} – ${j.pay}\n${location.href}`),'_blank','noopener')}
let trT=null,pend=null,first=true;
function trHide(){clearTimeout(trT);trT=null;pend=null;const e=$('#tr');if(e)e.classList.remove('on')}
function trShow(j){const e=$('#tr');pend=j;e.classList.remove('on');
 e.innerHTML=`<div class="logo">شغلك</div><div>جاري فتح: ${j.t}</div><div class="pb"><i></i></div><small>اضغط في أي مكان أو Esc للتخطي</small>`;
 void e.offsetWidth;e.classList.add('on');trT=setTimeout(trSkip,TRANSITION_MS)}
function trSkip(){const j=pend;if(!j)return;trHide();detail(j);scrollTo(0,0)}
function route(){const h=location.hash.replace(/^#\/?/,''),m=h.match(/^job\/(\d+)/),j=m&&D.find(x=>x.ref==m[1]);
 trHide();
 if(j&&!first&&TRANSITION_MS&&!matchMedia('(prefers-reduced-motion:reduce)').matches){first=false;trShow(j);return}
 first=false;
 if(j)detail(j);else{S.tab=h=='cmp'?h:'jobs';render()}scrollTo(0,0)}
$('#tr').onclick=trSkip;addEventListener('keydown',e=>{if(e.key=='Escape')trSkip()});
$('#ft').innerHTML=SITE_NOTE+'<br>للتواصل: <a href="tel:'+CONTACT.phone+'" dir="ltr">'+CONTACT.phone+'</a>';
addEventListener('hashchange',route);route();
