'use strict';
const faDigits='۰۱۲۳۴۵۶۷۸۹';
const toFa=n=>String(n).replace(/\d/g,d=>faDigits[d]);
const toEn=s=>String(s).replace(/[۰-۹]/g,d=>faDigits.indexOf(d));
const isoDate=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);return z.toISOString().slice(0,10)};
const todayISO=()=>isoDate(new Date());
const persianDate=iso=>new Intl.DateTimeFormat('fa-IR-u-ca-persian',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(new Date(iso+'T12:00:00'));
const shortPersian=iso=>new Intl.DateTimeFormat('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso+'T12:00:00'));
const id=()=>crypto.randomUUID?crypto.randomUUID():'id-'+Date.now()+'-'+Math.random().toString(16).slice(2);
const STORAGE='mehdi-fitness-v1';
const defaultData={version:1,profile:{name:'مهدی',age:40,height:177,startWeight:63.5,goalWeight:'66 تا 67.5'},sessions:[],measurements:[{id:'baseline',date:todayISO(),weight:63.5,waist:'',chest:'',arm:'',thigh:'',hip:'',note:'وزن شروع برنامه'}]};
let data=loadData();
function loadData(){try{return {...structuredClone(defaultData),...JSON.parse(localStorage.getItem(STORAGE)||'{}')}}catch(e){return structuredClone(defaultData)}}
function saveData(){localStorage.setItem(STORAGE,JSON.stringify(data));refreshAll()}

const workouts=[
 {id:'A',day:'شنبه',title:'باشگاه A — اولویت سینه + سرشانه',icon:'🏋️',kind:'باشگاه',exercises:[
  {id:'incline-db',fa:'پرس بالاسینه دمبل',en:'Incline Dumbbell Press',sets:4,reps:'8–12',target:'بالاسینه، جلوی سرشانه، پشت‌بازو',visual:'inclinePress',cues:'زاویه نیمکت ۲۰ تا ۳۰ درجه؛ پایین حرکت کشش کنترل‌شده و ۱ تا ۲ تکرار در ذخیره.'},
  {id:'machine-chest',fa:'پرس سینه دستگاه',en:'Machine Chest Press',sets:3,reps:'10–15',target:'سینه میانی، پشت‌بازو',visual:'machineChest',cues:'کتف‌ها عقب و پایین؛ دسته‌ها را بدون قفل محکم آرنج جلو ببر.'},
  {id:'cable-fly-a',fa:'فلای کابل',en:'Cable Fly',sets:3,reps:'12–18',target:'سینه و جمع‌شدن فیبرها',visual:'cableFly',cues:'آرنج کمی خم و ثابت؛ در جلو سینه یک ثانیه جمع کن.'},
  {id:'db-lateral-a',fa:'نشر جانب دمبل',en:'Dumbbell Lateral Raise',sets:4,reps:'15–20',target:'سرشانه کناری',visual:'lateral',cues:'وزنه متوسط؛ تا حوالی ارتفاع شانه بالا بیاور و تاب نده.'},
  {id:'leg-press',fa:'پرس پا',en:'Leg Press',sets:3,reps:'10–15',target:'چهارسر و باسن',visual:'legPress',cues:'دامنه کنترل‌شده؛ زانو در مسیر پنجه و لگن چسبیده به پشتی.'},
  {id:'leg-curl-a',fa:'پشت پا دستگاه',en:'Leg Curl',sets:3,reps:'12–15',target:'پشت ران',visual:'legCurl',cues:'بالای حرکت یک ثانیه فشار؛ برگشت را آهسته انجام بده.'},
  {id:'rope-pushdown',fa:'پشت‌بازو طناب',en:'Rope Triceps Pushdown',sets:2,reps:'12–15',target:'پشت‌بازو',visual:'pushdown',cues:'آرنج ثابت کنار بدن؛ آخر حرکت طناب را کمی باز کن.'},
  {id:'chest-row-a',fa:'قایقی سینه‌تکیه',en:'Chest-Supported Row',sets:2,reps:'10–15',target:'پشت میانی و تعادل شانه',visual:'row',cues:'بدون تاب بدن؛ در انتها کتف‌ها را جمع کن.'}
 ]},
 {id:'B',day:'دوشنبه',title:'باشگاه B — اولویت سرشانه + پشت',icon:'🏋️',kind:'باشگاه',exercises:[
  {id:'db-shoulder',fa:'پرس سرشانه دمبل نشسته',en:'Seated Dumbbell Shoulder Press',sets:3,reps:'8–12',target:'سرشانه و پشت‌بازو',visual:'shoulderPress',cues:'وزنه متوسط؛ کمر روی پشتی بماند و آرنج‌ها کمی جلوتر از بدن.'},
  {id:'cable-lateral-b',fa:'نشر جانب سیم‌کش',en:'Cable Lateral Raise',sets:4,reps:'12–20',target:'سرشانه کناری',visual:'cableLateral',cues:'حرکت آرام و بدون شتاب؛ شانه را بالا نینداز.'},
  {id:'reverse-pec-b',fa:'فلای معکوس دستگاه',en:'Reverse Pec Deck',sets:3,reps:'15–20',target:'پشت سرشانه',visual:'reverseFly',cues:'شانه‌ها پایین؛ حرکت را از پشت سرشانه انجام بده.'},
  {id:'lat-pulldown',fa:'لت سیم‌کش از جلو',en:'Lat Pulldown',sets:3,reps:'10–15',target:'لت و عرض پشت',visual:'pulldown',cues:'میله به بالای سینه؛ بدن را زیاد عقب نبر.'},
  {id:'cable-row-b',fa:'قایقی سیم‌کش نشسته',en:'Seated Cable Row',sets:3,reps:'10–15',target:'پشت میانی و لت',visual:'cableRow',cues:'قفسه سینه بالا؛ دستگیره به پایین شکم.'},
  {id:'bulgarian',fa:'اسکوات بلغاری',en:'Bulgarian Split Squat',sets:3,reps:'10–12 هر پا',target:'ران و باسن',visual:'splitSquat',cues:'وزن روی پای جلو؛ دامنه‌ای برو که زانو و لگن راحت باشند.'},
  {id:'rdl-b',fa:'ددلیفت رومانیایی',en:'Romanian Deadlift',sets:3,reps:'10–12',target:'پشت ران و باسن',visual:'hinge',cues:'وزنه متوسط؛ لگن عقب و ستون فقرات خنثی.'},
  {id:'hammer-curl-b',fa:'جلو بازو چکشی',en:'Hammer Curl',sets:2,reps:'12–15',target:'جلو بازو، براکیالیس و ساعد',visual:'hammerCurl',cues:'آرنج کنار بدن؛ بدون تاب دادن تنه.'}
 ]},
 {id:'C',day:'پنجشنبه',title:'باشگاه C — سینه و سرشانه پمپ + تکمیل بدن',icon:'🏋️',kind:'باشگاه',exercises:[
  {id:'flat-db-c',fa:'پرس سینه دمبل تخت',en:'Flat Dumbbell Press',sets:4,reps:'8–12',target:'سینه، پشت‌بازو و جلوی سرشانه',visual:'flatPress',cues:'کتف‌ها عقب و پایین؛ پایین حرکت ۲ ثانیه کنترل کن.'},
  {id:'incline-db-c',fa:'پرس بالاسینه دمبل',en:'Incline Dumbbell Press',sets:3,reps:'10–15',target:'بالاسینه',visual:'inclinePress',cues:'در این روز کمی سبک‌تر از روز A بزن و روی کشش و جمع‌شدن سینه تمرکز کن.'},
  {id:'cable-fly-c',fa:'فلای کابل',en:'Cable Fly',sets:3,reps:'15–20',target:'سینه',visual:'cableFly',cues:'در جلو سینه مکث کوتاه؛ وزنه‌ای بگیر که فرم کاملاً تمیز بماند.'},
  {id:'cable-lateral-c',fa:'نشر جانب سیم‌کش',en:'Cable Lateral Raise',sets:4,reps:'15–20',target:'سرشانه کناری',visual:'cableLateral',cues:'تمرکز روی سوزش سرشانه؛ وزنه سنگین لازم نیست.'},
  {id:'reverse-pec-c',fa:'فلای معکوس دستگاه',en:'Reverse Pec Deck',sets:2,reps:'15–20',target:'پشت سرشانه',visual:'reverseFly',cues:'کنترل کامل؛ گردن را شل نگه دار.'},
  {id:'hack-squat-c',fa:'هک اسکوات',en:'Hack Squat',sets:3,reps:'10–15',target:'چهارسر و باسن',visual:'squat',cues:'دامنه راحت و کنترل‌شده؛ فشار مفصلی نباید تیز یا آزاردهنده باشد.'},
  {id:'overhead-tri-c',fa:'پشت‌بازو طناب بالای سر',en:'Overhead Rope Triceps Extension',sets:3,reps:'12–15',target:'سر بلند پشت‌بازو',visual:'overheadTri',cues:'آرنج‌ها ثابت؛ کشش کامل بدون درد شانه یا آرنج.'},
  {id:'ez-curl-c',fa:'جلو بازو هالتر EZ',en:'EZ-Bar Curl',sets:3,reps:'10–15',target:'جلو بازو',visual:'curl',cues:'بدون تاب دادن بدن؛ بالا یک لحظه مکث.'},
  {id:'standing-calf-c',fa:'ساق ایستاده',en:'Standing Calf Raise',sets:3,reps:'12–20',target:'ساق',visual:'calf',cues:'دامنه کامل؛ پایین کشش و بالا مکث.'}
 ]},
 {id:'COREA',day:'خانه A',title:'خانه — شکم عضله‌سازی (حدود ۱۰ دقیقه)',icon:'🧘',kind:'خانه',exercises:[
  {id:'weighted-crunch',fa:'کرانچ وزنه‌دار',en:'Weighted Crunch',sets:3,reps:'12–20',target:'راست شکمی',visual:'reverseCrunch',cues:'دمبل ۵ کیلویی یا صفحه سبک روی سینه؛ ستون فقرات را جمع کن، نه اینکه فقط گردن را جلو ببری.'},
  {id:'reverse-crunch-core',fa:'ریورس کرانچ',en:'Reverse Crunch',sets:3,reps:'12–15',target:'شکم و کنترل لگن',visual:'reverseCrunch',cues:'لگن را از زمین جمع کن؛ حرکت را با تاب پاها انجام نده.'},
  {id:'plank-core',fa:'پلانک',en:'Plank',sets:2,reps:'35–50 ثانیه',target:'ثبات مرکزی',visual:'plank',cues:'شکم و باسن منقبض؛ نفس را حبس نکن.'}
 ]},
 {id:'COREB',day:'خانه B',title:'خانه — شکم و پهلو (حدود ۱۰ دقیقه)',icon:'🧘',kind:'خانه',exercises:[
  {id:'dead-bug-core',fa:'ددباگ',en:'Dead Bug',sets:3,reps:'10 هر سمت',target:'عضلات عمقی شکم',visual:'deadBug',cues:'کمر را روی زمین نگه دار و هر تکرار را آهسته انجام بده.'},
  {id:'side-plank-core',fa:'ساید پلانک',en:'Side Plank',sets:2,reps:'30–45 ثانیه هر سمت',target:'پهلو و ثبات لگن',visual:'sidePlank',cues:'لگن افت نکند و بدن نچرخد.'},
  {id:'push-up-core',fa:'شنا روی زمین',en:'Push-up',sets:2,reps:'10–20',target:'سینه، پشت‌بازو و ثبات مرکزی',visual:'pushup',cues:'در حدی بزن که ریکاوری سینه برای باشگاه خراب نشود؛ ۲ تا ۳ تکرار در ذخیره بماند.'}
 ]}
];
const workoutById=x=>workouts.find(w=>w.id===x);
const exerciseById=x=>workouts.flatMap(w=>w.exercises).find(e=>e.id===x);


const PHOTO_MAP={
  machineChest:{src:'assets/guide-cable-chest.png',row:0},
  cableFly:{src:'assets/guide-cable-chest.png',row:1},
  cableLateral:{src:'assets/guide-cable-chest.png',row:2},
  inclinePress:{src:'assets/guide-presses.png',row:0},
  flatPress:{src:'assets/guide-presses.png',row:1},
  pushup:{src:'assets/guide-presses.png',row:2},
  row:{src:'assets/guide-pull.png',row:0},
  cableRow:{src:'assets/guide-pull.png',row:1},
  pulldown:{src:'assets/guide-pull.png',row:2},
  legPress:{src:'assets/guide-legs.png',row:0},
  squat:{src:'assets/guide-legs.png',row:1},
  splitSquat:{src:'assets/guide-legs.png',row:2},
  hinge:{src:'assets/guide-hinge.png',row:0},
  hipThrust:{src:'assets/guide-hinge.png',row:1},
  legCurl:{src:'assets/guide-hinge.png',row:2},
  lateral:{src:'assets/guide-shoulders.png',row:0},
  reverseFly:{src:'assets/guide-shoulders.png',row:1},
  shoulderPress:{src:'assets/guide-shoulders.png',row:2},
  pushdown:{src:'assets/guide-arms.png',row:0},
  overheadTri:{src:'assets/guide-arms.png',row:1},
  curl:{src:'assets/guide-arms.png',row:2},
  hammerCurl:{src:'assets/guide-assist.png',row:0},
  calf:{src:'assets/guide-assist.png',row:1},
  bridge:{src:'assets/guide-assist.png',row:2},
  deadBug:{src:'assets/guide-core1.png',row:0},
  reverseCrunch:{src:'assets/guide-core1.png',row:1},
  sidePlank:{src:'assets/guide-core1.png',row:2},
  plank:{src:'assets/guide-core2.png',row:0},
  scapPushup:{src:'assets/guide-core2.png',row:1}
};
const COMMON_MISTAKES={
  machineChest:'بالا انداختن شانه‌ها، قفل محکم آرنج و جدا شدن کتف از پشتی.',
  cableFly:'خم و راست کردن زیاد آرنج، جلو رفتن شانه‌ها و سنگین گرفتن وزنه.',
  cableLateral:'تاب دادن تنه، بالا انداختن شانه و عبور زیاد دست از ارتفاع شانه.',
  inclinePress:'باز شدن بیش از حد آرنج‌ها، قوس دادن زیاد کمر و برخورد دمبل‌ها به هم.',
  flatPress:'شل شدن کتف‌ها، پایین آوردن خیلی سریع دمبل و نیمه‌کاره زدن دامنه.',
  pushup:'افتادن کمر، بالا ماندن باسن و بیرون دادن سر به جلو.',
  row:'کشیدن وزنه با گردن و شانه، جدا کردن سینه از تکیه‌گاه و تقلب با تاب بدن.',
  cableRow:'گرد کردن کمر، عقب‌رفتن زیاد بدن و بالا انداختن شانه‌ها.',
  pulldown:'کشیدن میله پشت گردن، تکیه دادن بیش از حد به عقب و شانه‌های بالا.',
  legPress:'قفل کردن زانو، جدا شدن لگن از پشتی و جمع شدن زانوها به داخل.',
  squat:'برداشتن پاشنه از صفحه، کوتاه کردن دامنه و جمع شدن زانوها به داخل.',
  splitSquat:'فشار گرفتن از پای عقب، خم شدن زیاد تنه و افتادن زانو به داخل.',
  hinge:'گرد شدن کمر، خم شدن زانو مثل اسکوات و دور شدن هالتر از بدن.',
  hipThrust:'بیش‌ازحد قوس دادن کمر، پایین نیاوردن کنترل‌شده و باز نشدن کامل لگن.',
  legCurl:'ضربه زدن با پاها، نیمه‌کاره زدن دامنه و رها کردن کنترل برگشت.',
  lateral:'تاب دادن بدن، بالا آوردن شانه‌ها و سنگین گرفتن وزنه.',
  reverseFly:'قفل کردن گردن، شانه‌های بالا و استفاده از کمر به‌جای پشت سرشانه.',
  shoulderPress:'خواباندن کمر روی هوا، قفل انفجاری آرنج و پایین آوردن ناقص.',
  pushdown:'جلو آمدن آرنج‌ها، خم کردن مچ و تاب دادن تنه.',
  overheadTri:'باز شدن زیاد آرنج‌ها، جابجایی کمر و کوتاه کردن کشش پایین حرکت.',
  curl:'تاب دادن بدن، جلو آوردن شانه و بازی دادن آرنج‌ها.',
  hammerCurl:'چرخاندن مچ‌ها و کمک گرفتن از شانه یا کمر.',
  calf:'فنری بالا و پایین رفتن، مکث نکردن در بالا و دامنه ناقص.',
  bridge:'فشار از کمر به‌جای باسن و باز نشدن کامل لگن.',
  deadBug:'جدا شدن کمر از زمین و سریع رفتن بدون کنترل.',
  reverseCrunch:'تاب دادن پاها، فشار به گردن و برگشت بدون کنترل.',
  sidePlank:'افتادن لگن، چرخیدن شانه و جمع شدن بدن.',
  plank:'بالا یا پایین افتادن باسن و حبس نفس.',
  scapPushup:'خم کردن آرنج‌ها به جای حرکت دادن کتف‌ها.'
};
function guideInfo(e){return {tip:e.cues,mistake:COMMON_MISTAKES[e.visual]||'وزنه را آن‌قدر سنگین نکن که فرم خراب شود.'}}
function photoVisual(spec,mode='card'){const extra=mode==='large'?' large':mode==='mini'?' mini':'';return `<div class="exercise-photo r${spec.row}${extra}" style="background-image:url('${spec.src}')"></div>`}

function svgVisual(type,mode='card'){const spec=PHOTO_MAP[type];if(spec)return photoVisual(spec,mode);
 const S='#0f172a',G='#14b8a6',M='#94a3b8',skin='#f2c4a5';
 const head=(x,y)=>`<circle cx="${x}" cy="${y}" r="5" fill="${skin}" stroke="${S}" stroke-width="2"/>`;
 const line=(x1,y1,x2,y2,c=S,w=3)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
 const arrow=(x1,y1,x2,y2)=>`${line(x1,y1,x2,y2,G,2)}<path d="M${x2} ${y2} l-5 -3 l1 6z" fill="${G}"/>`;
 let a='',b='';
 switch(type){
  case'inclinePress':a=head(26,25)+line(25,31,36,47)+line(36,47,55,54)+line(35,40,28,54)+line(28,54,20,45)+line(55,54,70,54,M,5)+line(22,44,14,35)+line(14,35,18,25)+line(48,48,48,29)+line(44,29,52,29,M,4);b=head(92,25)+line(91,31,102,47)+line(102,47,120,54)+line(101,40,94,47)+line(94,47,94,27)+line(120,54,136,54,M,5)+line(88,44,80,37)+line(80,37,80,25)+line(76,25,84,25,M,4)+arrow(52,30,80,25);break;
  case'row':a=head(24,21)+line(25,27,42,39)+line(42,39,55,60)+line(39,37,27,52)+line(27,52,17,57)+line(55,60,65,60,M,5)+line(35,35,50,35)+line(50,35,61,28);b=head(96,21)+line(97,27,112,39)+line(112,39,125,60)+line(109,37,102,49)+line(102,49,91,42)+line(125,60,137,60,M,5)+line(106,35,119,36)+line(119,36,126,30)+arrow(63,28,91,42);break;
  case'legPress':a=head(25,29)+line(26,35,42,48)+line(42,48,54,65)+line(40,46,57,46)+line(57,46,67,35)+line(66,25,66,68,M,5);b=head(95,29)+line(96,35,112,48)+line(112,48,125,65)+line(110,46,129,39)+line(129,39,137,28)+line(137,18,137,61,M,5)+arrow(67,35,137,28);break;
  case'hinge':a=head(27,19)+line(27,25,27,49)+line(27,49,20,70)+line(27,49,35,70)+line(27,35,17,52)+line(17,52,15,65)+line(11,65,39,65,M,4);b=head(96,27)+line(92,31,78,46)+line(78,46,84,68)+line(84,68,76,72)+line(84,68,94,72)+line(83,43,73,55)+line(73,55,74,66)+line(68,66,96,66,M,4)+arrow(55,30,78,46);break;
  case'lateral':a=head(25,18)+line(25,24,25,48)+line(25,48,17,70)+line(25,48,34,70)+line(25,30,16,47)+line(25,30,34,47);b=head(96,18)+line(96,24,96,48)+line(96,48,88,70)+line(96,48,105,70)+line(96,30,75,31)+line(96,30,117,31)+arrow(34,47,75,31);break;
  case'pushdown':a=line(18,8,18,68,M,4)+line(18,10,35,10,M,4)+head(46,19)+line(46,25,46,48)+line(46,48,38,70)+line(46,48,55,70)+line(46,31,35,35)+line(35,35,35,50)+line(35,10,35,35,M,2);b=line(80,8,80,68,M,4)+line(80,10,97,10,M,4)+head(108,19)+line(108,25,108,48)+line(108,48,100,70)+line(108,48,117,70)+line(108,31,97,35)+line(97,35,97,58)+line(97,10,97,35,M,2)+arrow(63,48,97,58);break;
  case'calf':a=head(29,17)+line(29,23,29,48)+line(29,48,23,68)+line(29,48,35,68)+line(17,69,42,69,M,5);b=head(96,13)+line(96,19,96,44)+line(96,44,90,64)+line(96,44,102,64)+line(84,69,109,69,M,5)+arrow(61,55,96,44);break;
  case'deadBug':a=head(24,53)+line(29,53,55,53)+line(42,53,34,33)+line(42,53,58,38)+line(55,53,66,35)+line(55,53,70,66);b=head(88,53)+line(93,53,119,53)+line(106,53,96,34)+line(106,53,121,36)+line(119,53,132,35)+line(119,53,136,66)+arrow(70,66,96,34);break;
  case'reverseCrunch':a=head(22,55)+line(27,55,55,55)+line(55,55,68,43)+line(68,43,57,31);b=head(90,58)+line(95,58,119,52)+line(119,52,130,36)+line(130,36,120,25)+arrow(68,43,119,52);break;
  case'sidePlank':a=head(20,43)+line(26,44,58,52)+line(58,52,76,58)+line(30,45,25,60)+line(25,60,40,60);b=head(89,33)+line(95,34,126,42)+line(126,42,141,48)+line(100,36,96,57)+line(96,57,111,57)+arrow(58,52,126,42);break;
  case'bridge':a=head(20,54)+line(25,54,56,54)+line(56,54,70,68)+line(56,54,70,43);b=head(88,58)+line(93,58,121,42)+line(121,42,137,58)+line(121,42,135,28)+arrow(56,54,121,42);break;
  case'pulldown':a=line(16,9,16,70,M,4)+line(16,10,47,10,M,4)+head(35,29)+line(35,35,35,56)+line(35,56,28,70)+line(35,56,42,70)+line(35,38,25,23)+line(35,38,45,23)+line(24,18,46,18,M,3);b=line(80,9,80,70,M,4)+line(80,10,111,10,M,4)+head(99,29)+line(99,35,99,56)+line(99,56,92,70)+line(99,56,106,70)+line(99,38,89,43)+line(99,38,109,43)+line(88,43,110,43,M,3)+arrow(47,18,110,43);break;
  case'shoulderPress':a=head(27,20)+line(27,26,27,48)+line(27,48,19,70)+line(27,48,35,70)+line(27,32,18,41)+line(18,41,18,28)+line(27,32,36,41)+line(36,41,36,28);b=head(96,20)+line(96,26,96,48)+line(96,48,88,70)+line(96,48,104,70)+line(96,32,86,20)+line(86,20,86,9)+line(96,32,106,20)+line(106,20,106,9)+arrow(51,30,86,9);break;
  case'splitSquat':a=head(28,17)+line(28,23,28,45)+line(28,45,18,67)+line(28,45,44,56)+line(44,56,57,56)+line(57,56,57,50,M,4);b=head(97,27)+line(97,33,97,50)+line(97,50,84,66)+line(97,50,113,58)+line(113,58,127,58)+line(127,58,127,52,M,4)+arrow(57,44,97,50);break;
  case'hipThrust':a=head(19,45)+line(24,45,52,52)+line(52,52,70,68)+line(24,45,18,58)+line(18,58,5,58,M,6);b=head(88,45)+line(93,45,119,35)+line(119,35,137,58)+line(93,45,87,58)+line(87,58,75,58,M,6)+arrow(52,52,119,35);break;
  case'reverseFly':a=head(27,18)+line(27,24,27,48)+line(27,48,19,70)+line(27,48,35,70)+line(27,31,18,43)+line(27,31,36,43);b=head(96,18)+line(96,24,96,48)+line(96,48,88,70)+line(96,48,104,70)+line(96,31,75,39)+line(96,31,117,39)+arrow(36,43,75,39);break;
  case'curl':case'hammerCurl':a=head(27,18)+line(27,24,27,48)+line(27,48,19,70)+line(27,48,35,70)+line(27,31,18,51)+line(27,31,36,51);b=head(96,18)+line(96,24,96,48)+line(96,48,88,70)+line(96,48,104,70)+line(96,31,86,42)+line(86,42,86,27)+line(96,31,106,42)+line(106,42,106,27)+arrow(51,50,86,27);break;
  case'flatPress':a=head(25,46)+line(30,46,60,46)+line(42,46,32,34)+line(32,34,32,23)+line(42,46,52,34)+line(52,34,52,23)+line(18,55,70,55,M,6);b=head(90,46)+line(95,46,125,46)+line(107,46,98,30)+line(98,30,98,17)+line(107,46,116,30)+line(116,30,116,17)+line(83,55,135,55,M,6)+arrow(52,23,98,17);break;
  case'cableRow':a=head(24,25)+line(24,31,24,50)+line(24,50,16,69)+line(24,50,35,69)+line(24,35,39,35)+line(39,35,54,35)+line(60,12,60,70,M,4);b=head(92,25)+line(92,31,92,50)+line(92,50,84,69)+line(92,50,103,69)+line(92,35,81,39)+line(81,39,72,39)+line(70,12,70,70,M,4)+arrow(54,35,72,39);break;
  case'squat':a=head(27,17)+line(27,23,27,48)+line(27,48,19,70)+line(27,48,35,70);b=head(96,28)+line(96,34,96,49)+line(96,49,82,61)+line(96,49,112,61)+line(82,61,78,71)+line(112,61,116,71)+arrow(55,30,96,49);break;
  case'legCurl':a=head(19,49)+line(24,49,56,49)+line(56,49,73,49)+line(73,49,85,49)+line(14,58,63,58,M,6);b=head(91,49)+line(96,49,124,49)+line(124,49,136,35)+line(136,35,126,25)+line(86,58,132,58,M,6)+arrow(73,49,136,35);break;
  case'overheadTri':a=head(27,18)+line(27,24,27,48)+line(27,48,19,70)+line(27,48,35,70)+line(27,31,19,18)+line(19,18,25,7)+line(27,31,35,18)+line(35,18,29,7);b=head(96,18)+line(96,24,96,48)+line(96,48,88,70)+line(96,48,104,70)+line(96,31,88,17)+line(88,17,88,5)+line(96,31,104,17)+line(104,17,104,5)+arrow(51,10,88,5);break;
  case'pushup':case'scapPushup':case'plank':a=head(18,44)+line(24,44,60,49)+line(60,49,79,55)+line(32,45,27,58)+line(27,58,44,58);b=head(90,40)+line(96,40,130,45)+line(130,45,145,51)+line(104,41,100,56)+line(100,56,117,56)+arrow(60,49,130,45);break;
  default:a=head(27,18)+line(27,24,27,48)+line(27,48,19,70)+line(27,48,35,70);b=head(96,18)+line(96,24,96,48)+line(96,48,88,70)+line(96,48,104,70)+arrow(48,40,75,40);
 }
 return `<svg viewBox="0 0 155 80" xmlns="http://www.w3.org/2000/svg"><rect width="155" height="80" rx="10" fill="#f8fafc"/><line x1="77.5" y1="7" x2="77.5" y2="73" stroke="#e2e8f0"/><text x="20" y="76" font-size="7" fill="#64748b">شروع</text><text x="92" y="76" font-size="7" fill="#64748b">پایان</text>${a}${b}</svg>`;
}
function exerciseCard(e,modal=true){const g=guideInfo(e);return `<article class="exercise-card" ${modal?`onclick="showExercise('${e.id}')"`:''}><div class="exercise-visual">${svgVisual(e.visual,'card')}</div><div class="exercise-info"><h4>${e.fa}</h4><div class="en">${e.en}</div><span class="dose">${toFa(e.sets)} ست × ${toFa(e.reps)}</span><div class="target">هدف: ${e.target}</div><div class="guide-block"><div class="guide-note"><strong>نکته فرم:</strong> ${g.tip}</div><div class="guide-warn"><strong>اشتباه رایج:</strong> ${g.mistake}</div></div></div></article>`}
function renderPlan(){document.getElementById('planList').innerHTML=workouts.map(w=>`<div class="card day-card" style="margin-bottom:13px"><div class="day-head"><div><h3>${w.icon} ${w.day}</h3><span>${w.title}</span></div><button class="btn small primary" onclick="quickStart('${w.id}')">شروع</button></div><div class="exercise-list">${w.exercises.map(e=>exerciseCard(e)).join('')}</div></div>`).join('')}
function showExercise(exId){const e=exerciseById(exId),g=guideInfo(e);document.getElementById('modalTitle').textContent=e.fa;document.getElementById('modalBody').innerHTML=`<div class="exercise-visual" style="width:100%;height:auto;aspect-ratio:12/5;margin-bottom:12px">${svgVisual(e.visual,'large')}</div><h3 style="margin:0">${e.fa}</h3><div style="direction:ltr;text-align:right;color:var(--muted)">${e.en}</div><p><strong>برنامه:</strong> ${toFa(e.sets)} ست × ${toFa(e.reps)}</p><p><strong>عضلات هدف:</strong> ${e.target}</p><div class="guide-block" style="margin-top:10px"><div class="guide-note"><strong>نکته فرم:</strong> ${g.tip}</div><div class="guide-warn"><strong>اشتباه رایج:</strong> ${g.mistake}</div></div><div class="notice">این نسخه از اپ عمداً همیشه با تم روشن نمایش داده می‌شود تا روی موبایلِ دارک‌مود هم خوانا بماند.</div>`;document.getElementById('exerciseModal').classList.add('open')}

const dayMap={6:'A',0:'H1',1:'B',3:'H2',4:'C'};
function todayWorkout(){return workoutById(dayMap[new Date().getDay()])}
function renderHome(){
 const w=todayWorkout(),el=document.getElementById('todayPlan');
 if(w){el.innerHTML=`<div class="today-plan"><div class="today-icon">${w.icon}</div><div><h3>${w.title}</h3><p>${toFa(w.exercises.length)} حرکت · ${w.kind}</p></div></div><div class="today-actions"><button class="btn primary" onclick="quickStart('${w.id}')">ثبت تمرین امروز</button><button class="btn ghost" onclick="goView('plan')">جزئیات</button></div>`}
 else{el.innerHTML=`<div class="today-plan"><div class="today-icon">🚶</div><div><h3>استراحت یا پیاده‌روی آرام</h3><p>ریکاوری، خواب و تغذیه بخشی از برنامه هستند.</p></div></div><div class="today-actions"><button class="btn secondary" onclick="goView('progress')">ثبت وزن و اندازه</button><button class="btn ghost" onclick="goView('plan')">برنامه هفته</button></div>`}
 document.getElementById('metricSessions').textContent=toFa(data.sessions.length);
 const latestM=[...data.measurements].sort((a,b)=>b.date.localeCompare(a.date))[0];document.getElementById('metricWeight').textContent=toFa(latestM?.weight||63.5);
 const last=[...data.sessions].sort((a,b)=>b.date.localeCompare(a.date))[0];document.getElementById('metricLast').textContent=last?workoutById(last.workoutId)?.title.split('—')[0].trim():'ثبت نشده';document.getElementById('metricLastDate').textContent=last?shortPersian(last.date):'—';
 document.getElementById('metricAdherence').textContent=toFa(calcAdherence())+'٪';
}
function calcAdherence(){let expected=0,done=0;const now=new Date();for(let i=0;i<14;i++){const d=new Date(now);d.setDate(now.getDate()-i);if(dayMap[d.getDay()]){expected++;if(data.sessions.some(s=>s.date===isoDate(d)&&s.workoutId===dayMap[d.getDay()]))done++}}return expected?Math.round(done/expected*100):0}

function populateWorkoutSelect(){const sel=document.getElementById('logWorkout');sel.innerHTML=workouts.map(w=>`<option value="${w.id}">${w.day} — ${w.title}</option>`).join('')}
let currentDraft=null;
function buildSession(prefill){const wid=document.getElementById('logWorkout').value,date=document.getElementById('logDate').value||todayISO(),w=workoutById(wid);currentDraft={id:id(),workoutId:wid,date,startedAt:new Date().toISOString(),exercises:w.exercises.map(e=>({exerciseId:e.id,sets:Array.from({length:e.sets},(_,i)=>({set:i+1,weight:'',reps:'',rir:'2',done:false}))})),energy:'3',pain:'',note:''};if(prefill){const prev=[...data.sessions].filter(s=>s.workoutId===wid).sort((a,b)=>b.date.localeCompare(a.date))[0];if(prev)currentDraft.exercises.forEach(ex=>{const p=prev.exercises.find(x=>x.exerciseId===ex.exerciseId);if(p)ex.sets.forEach((st,i)=>{st.weight=p.sets[i]?.weight||'';st.reps=p.sets[i]?.reps||''})})}renderSessionForm()}
function renderSessionForm(){const box=document.getElementById('sessionForm');if(!currentDraft){box.innerHTML='<div class="empty"><span class="emoji">📝</span>نوع جلسه و تاریخ را انتخاب کن و «ساخت فرم جلسه» را بزن.</div>';return}const w=workoutById(currentDraft.workoutId);box.innerHTML=`<div class="stack"><div class="card"><div class="card-pad"><strong>${w.title}</strong><div style="font-size:11px;color:var(--muted)">${persianDate(currentDraft.date)}</div></div></div>${currentDraft.exercises.map((x,xi)=>{const e=exerciseById(x.exerciseId);return `<div class="session-exercise"><div class="session-exercise-head"><div class="exercise-visual">${svgVisual(e.visual,'mini')}</div><div><h4>${e.fa}</h4><div style="font-size:10px;color:var(--muted);direction:ltr;text-align:right">${e.en}</div><div style="font-size:10px;color:var(--brand)">${toFa(e.sets)} × ${toFa(e.reps)}</div></div></div><div class="sets"><table class="set-table"><thead><tr><th>ست</th><th>وزنه kg</th><th>تکرار/ثانیه</th><th>ذخیره</th><th>انجام</th></tr></thead><tbody>${x.sets.map((s,si)=>`<tr><td>${toFa(si+1)}</td><td><input type="number" step="0.5" inputmode="decimal" value="${s.weight}" onchange="updateSet(${xi},${si},'weight',this.value)"></td><td><input type="text" inputmode="numeric" value="${s.reps}" onchange="updateSet(${xi},${si},'reps',this.value)"></td><td><select onchange="updateSet(${xi},${si},'rir',this.value)"><option value="4" ${s.rir==='4'?'selected':''}>۴+ راحت</option><option value="3" ${s.rir==='3'?'selected':''}>۳</option><option value="2" ${s.rir==='2'?'selected':''}>۲ مناسب</option><option value="1" ${s.rir==='1'?'selected':''}>۱ سخت</option><option value="0" ${s.rir==='0'?'selected':''}>۰ ناتوانی</option></select></td><td><input class="set-check" type="checkbox" ${s.done?'checked':''} onchange="updateSet(${xi},${si},'done',this.checked)"></td></tr>`).join('')}</tbody></table></div></div>`}).join('')}<div class="card"><div class="card-pad"><div class="field"><label>انرژی جلسه از ۱ تا ۵</label><select class="input" onchange="currentDraft.energy=this.value"><option value="1">۱ — خیلی کم</option><option value="2">۲ — کم</option><option value="3" selected>۳ — معمولی</option><option value="4">۴ — خوب</option><option value="5">۵ — عالی</option></select></div><div class="field" style="margin-top:9px"><label>درد یا ناراحتی</label><input class="input" placeholder="مثلاً شانه راست، زانوی چپ…" onchange="currentDraft.pain=this.value"></div><div class="field" style="margin-top:9px"><label>یادداشت جلسه</label><textarea class="input" placeholder="کیفیت اجرا، خواب، حس عضله، نکته جلسه بعد…" onchange="currentDraft.note=this.value"></textarea></div><button class="btn primary full" style="margin-top:11px" onclick="saveSession()">ذخیره و پایان جلسه</button></div></div></div>`}
function updateSet(xi,si,k,v){currentDraft.exercises[xi].sets[si][k]=v}
function saveSession(){const done=currentDraft.exercises.flatMap(x=>x.sets).filter(s=>s.done).length,total=currentDraft.exercises.flatMap(x=>x.sets).length;if(!done&&!confirm('هیچ ستی تیک نخورده است. جلسه را باز هم ذخیره کنم؟'))return;currentDraft.completedSets=done;currentDraft.totalSets=total;currentDraft.completedAt=new Date().toISOString();data.sessions.push(currentDraft);currentDraft=null;saveData();toast('جلسه تمرین ذخیره شد');goView('history')}
function quickStart(wid){document.getElementById('logWorkout').value=wid;setDateField('log',todayISO());goView('log');buildSession(false)}

function renderHistory(){const list=document.getElementById('historyList'),sessions=[...data.sessions].sort((a,b)=>(b.date+b.startedAt).localeCompare(a.date+a.startedAt));document.getElementById('historyCount').textContent=toFa(sessions.length)+' جلسه';if(!sessions.length){list.innerHTML='<div class="empty"><span class="emoji">📭</span>هنوز جلسه‌ای ثبت نشده است.</div>';return}list.innerHTML=sessions.map(s=>{const w=workoutById(s.workoutId),pct=Math.round((s.completedSets||0)/(s.totalSets||1)*100);return `<div class="history-item" id="hist-${s.id}"><div class="history-top" onclick="document.getElementById('hist-${s.id}').classList.toggle('open')"><div><h4>${w?.title||s.workoutId}</h4><p>${persianDate(s.date)} · انرژی ${toFa(s.energy||'—')}/۵</p></div><div class="score">${toFa(pct)}٪</div></div><div class="history-details">${s.exercises.map(x=>{const e=exerciseById(x.exerciseId),sets=x.sets.filter(z=>z.done).map(z=>`${z.weight||'بدون وزنه'} × ${z.reps||'—'} (RIR ${z.rir})`).join(' | ');return `<div class="history-ex"><strong>${e?.fa||x.exerciseId}</strong>${toFa(sets||'ثبت نشده')}</div>`}).join('')}${s.pain?`<div><strong>درد:</strong> ${s.pain}</div>`:''}${s.note?`<div><strong>یادداشت:</strong> ${s.note}</div>`:''}<div class="history-actions"><button class="btn small secondary" onclick="repeatSession('${s.id}')">تکرار جلسه</button><button class="btn small danger" onclick="deleteSession('${s.id}')">حذف</button></div></div></div>`}).join('')}
function repeatSession(sid){const s=data.sessions.find(x=>x.id===sid);document.getElementById('logWorkout').value=s.workoutId;setDateField('log',todayISO());goView('log');buildSession(true)}
function deleteSession(sid){if(confirm('این جلسه حذف شود؟')){data.sessions=data.sessions.filter(s=>s.id!==sid);saveData();toast('جلسه حذف شد')}}

function saveMeasurement(){const date=document.getElementById('measureDate').value||todayISO(),weight=document.getElementById('mWeight').value;if(!weight&&!document.getElementById('mWaist').value){toast('حداقل وزن یا دور کمر را وارد کن');return}data.measurements.push({id:id(),date,weight:weight?Number(weight):'',waist:val('mWaist'),chest:val('mChest'),arm:val('mArm'),thigh:val('mThigh'),hip:val('mHip'),note:document.getElementById('mNote').value});saveData();['mWeight','mWaist','mChest','mArm','mThigh','mHip','mNote'].forEach(x=>document.getElementById(x).value='');toast('اندازه‌ها ثبت شد')}
function val(x){const v=document.getElementById(x).value;return v?Number(v):''}
function renderMeasurements(){const ms=[...data.measurements].sort((a,b)=>b.date.localeCompare(a.date));document.getElementById('measureCount').textContent=toFa(ms.length)+' مورد';document.getElementById('measureList').innerHTML=ms.length?ms.slice(0,10).map(m=>`<div class="progress-entry"><div><strong>${toFa(m.weight||'—')} کیلو</strong><div>${shortPersian(m.date)}</div><div style="color:var(--muted)">${m.waist?'کمر '+toFa(m.waist):''} ${m.arm?'· بازو '+toFa(m.arm):''} ${m.thigh?'· ران '+toFa(m.thigh):''}</div></div>${m.id!=='baseline'?`<button class="btn small danger" onclick="deleteMeasure('${m.id}')">حذف</button>`:''}</div>`).join(''):'<div class="empty">اندازه‌ای ثبت نشده است.</div>';drawChart(ms.filter(x=>x.weight).sort((a,b)=>a.date.localeCompare(b.date)))}
function deleteMeasure(mid){if(confirm('این اندازه‌گیری حذف شود؟')){data.measurements=data.measurements.filter(m=>m.id!==mid);saveData()}}
function drawChart(ms){const c=document.getElementById('weightChart'),ctx=c.getContext('2d'),rect=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;c.width=rect.width*dpr;c.height=rect.height*dpr;ctx.scale(dpr,dpr);const W=rect.width,H=rect.height;ctx.clearRect(0,0,W,H);ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--line');ctx.lineWidth=1;for(let i=0;i<5;i++){const y=20+i*(H-45)/4;ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(W-10,y);ctx.stroke()}if(ms.length<2){ctx.fillStyle='#64748b';ctx.textAlign='center';ctx.font='12px sans-serif';ctx.fillText('برای نمایش روند، حداقل دو وزن ثبت کن',W/2,H/2);return}const vals=ms.map(x=>Number(x.weight)),min=Math.min(...vals)-.5,max=Math.max(...vals)+.5,x=i=>30+i*(W-50)/(ms.length-1),y=v=>20+(max-v)*(H-45)/(max-min||1);ctx.strokeStyle='#14b8a6';ctx.lineWidth=3;ctx.beginPath();vals.forEach((v,i)=>i?ctx.lineTo(x(i),y(v)):ctx.moveTo(x(i),y(v)));ctx.stroke();vals.forEach((v,i)=>{ctx.fillStyle='#0f766e';ctx.beginPath();ctx.arc(x(i),y(v),4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#64748b';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(toFa(v),x(i),y(v)-8)})}

function reportText(){const sessions=[...data.sessions].sort((a,b)=>a.date.localeCompare(b.date)),ms=[...data.measurements].sort((a,b)=>a.date.localeCompare(b.date));let t=`گزارش تمرین مهدی\nتاریخ خروجی: ${persianDate(todayISO())}\nپروفایل: ۴۰ سال، قد ۱۷۷، وزن شروع ۶۳.۵ کیلو، وزن فعلی حدود ۶۶.۵ کیلو\n\nخلاصه:\n- تعداد جلسات ثبت‌شده: ${sessions.length}\n- پایبندی ۱۴ روز اخیر: ${calcAdherence()}٪\n`;if(ms.length){const first=ms.find(x=>x.weight),last=[...ms].reverse().find(x=>x.weight);t+=`- وزن اول ثبت‌شده: ${first?.weight||'—'}\n- آخرین وزن: ${last?.weight||'—'}\n`;if(last?.waist)t+=`- آخرین دور کمر: ${last.waist} سانت\n`}t+='\nجلسه‌ها:\n';sessions.forEach(s=>{const w=workoutById(s.workoutId);t+=`\n${persianDate(s.date)} | ${w?.title||s.workoutId} | انرژی ${s.energy||'—'}/5 | تکمیل ${s.completedSets||0}/${s.totalSets||0}\n`;s.exercises.forEach(x=>{const e=exerciseById(x.exerciseId);const done=x.sets.filter(z=>z.done).map(z=>`${z.weight||'BW'}kg × ${z.reps||'—'} @RIR${z.rir}`).join(' ؛ ');t+=`  - ${e?.fa||x.exerciseId} (${e?.en||''}): ${done||'ثبت نشده'}\n`});if(s.pain)t+=`  درد/ناراحتی: ${s.pain}\n`;if(s.note)t+=`  یادداشت: ${s.note}\n`});t+='\nاندازه‌های بدن:\n';ms.forEach(m=>{t+=`${persianDate(m.date)} | وزن ${m.weight||'—'} | کمر ${m.waist||'—'} | سینه ${m.chest||'—'} | بازو ${m.arm||'—'} | ران ${m.thigh||'—'} | باسن ${m.hip||'—'}${m.note?' | '+m.note:''}\n`});t+='\nدرخواست بررسی: روند افزایش وزنه، تعداد تکرار، RIR، دردها، پایبندی و تغییر وزن/دور کمر را بررسی کن و در صورت نیاز برنامه را اصلاح کن.';return t}
function download(name,content,type){const b=new Blob([content],{type}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
function exportCSV(){let rows=[['date','persian_date','workout','exercise_fa','exercise_en','set','weight_kg','reps_or_seconds','rir','done','energy','pain','note']];data.sessions.forEach(s=>{const w=workoutById(s.workoutId);s.exercises.forEach(x=>{const e=exerciseById(x.exerciseId);x.sets.forEach(st=>rows.push([s.date,persianDate(s.date),w?.title,e?.fa,e?.en,st.set,st.weight,st.reps,st.rir,st.done,s.energy,s.pain,s.note]))})});const csv='\uFEFF'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n');download('mehdi-workout-log.csv',csv,'text/csv;charset=utf-8')}
function exportJSON(){download('mehdi-fitness-backup.json',JSON.stringify({exportedAt:new Date().toISOString(),...data},null,2),'application/json')}

let calendarTarget='log',calY,calM,selectedISO=todayISO();
function div(a,b){return ~~(a/b)}function mod(a,b){return a-~~(a/b)*b}
function jalCal(jy,withoutLeap){const breaks=[-61,9,38,199,426,686,756,818,1111,1181,1210,1635,2060,2097,2192,2262,2324,2394,2456,3178],bl=breaks.length,gy=jy+621;let leapJ=-14,jp=breaks[0],jm,jump,leap,n,i;if(jy<jp||jy>=breaks[bl-1])throw Error('Invalid Jalaali year');for(i=1;i<bl;i++){jm=breaks[i];jump=jm-jp;if(jy<jm)break;leapJ=leapJ+div(jump,33)*8+div(mod(jump,33),4);jp=jm}n=jy-jp;leapJ=leapJ+div(n,33)*8+div(mod(n,33)+3,4);if(mod(jump,33)===4&&jump-n===4)leapJ+=1;const leapG=div(gy,4)-div((div(gy,100)+1)*3,4)-150,march=20+leapJ-leapG;if(withoutLeap)return{gy,march};if(jump-n<6)n=n-jump+div(jump+4,33)*33;leap=mod(mod(n+1,33)-1,4);if(leap===-1)leap=4;return{leap,gy,march}}
function g2d(gy,gm,gd){let d=div((gy+div(gm-8,6)+100100)*1461,4)+div(153*mod(gm+9,12)+2,5)+gd-34840408;d=d-div(div(gy+100100+div(gm-8,6),100)*3,4)+752;return d}
function d2g(jdn){let j=4*jdn+139361631;j=j+div(div(4*jdn+183187720,146097)*3,4)*4-3908;const i=div(mod(j,1461),4)*5+308,gd=div(mod(i,153),5)+1,gm=mod(div(i,153),12)+1,gy=div(j,1461)-100100+div(8-gm,6);return{gy,gm,gd}}
function j2d(jy,jm,jd){const r=jalCal(jy,true);return g2d(r.gy,3,r.march)+(jm-1)*31-div(jm,7)*(jm-7)+jd-1}
function d2j(jdn){const g=d2g(jdn),jy=g.gy-621,r=jalCal(jy,false),jdn1f=g2d(g.gy,3,r.march);let k=jdn-jdn1f,jy2=jy,jm,jd;if(k>=0){if(k<=185){jm=1+div(k,31);jd=mod(k,31)+1;return{jy:jy2,jm,jd}}k-=186}else{jy2-=1;k+=179;if(r.leap===1)k+=1}jm=7+div(k,30);jd=mod(k,30)+1;return{jy:jy2,jm,jd}}
function toJalaali(gy,gm,gd){return d2j(g2d(gy,gm,gd))}function toGregorian(jy,jm,jd){return d2g(j2d(jy,jm,jd))}
function jMonthLen(y,m){if(m<=6)return 31;if(m<=11)return 30;return jalCal(y,false).leap===0?30:29}
function openCalendar(target){calendarTarget=target;selectedISO=document.getElementById(target+'Date').value||todayISO();const d=new Date(selectedISO+'T12:00:00'),j=toJalaali(d.getFullYear(),d.getMonth()+1,d.getDate());calY=j.jy;calM=j.jm;renderCalendar();document.getElementById('calendarModal').classList.add('open')}
function renderCalendar(){const names=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];document.getElementById('calTitle').textContent=names[calM-1]+' '+toFa(calY);const first=toGregorian(calY,calM,1),firstDate=new Date(first.gy,first.gm-1,first.gd),offset=(firstDate.getDay()+1)%7,len=jMonthLen(calY,calM),sel=new Date(selectedISO+'T12:00:00'),sj=toJalaali(sel.getFullYear(),sel.getMonth()+1,sel.getDate()),today=todayISO();let h='';for(let i=0;i<offset;i++)h+='<button class="cal-day blank"></button>';for(let d=1;d<=len;d++){const g=toGregorian(calY,calM,d),iso=`${g.gy}-${String(g.gm).padStart(2,'0')}-${String(g.gd).padStart(2,'0')}`,cl=['cal-day'];if(iso===today)cl.push('today');if(sj.jy===calY&&sj.jm===calM&&sj.jd===d)cl.push('selected');h+=`<button class="${cl.join(' ')}" onclick="pickDate('${iso}')">${toFa(d)}</button>`}document.getElementById('calGrid').innerHTML=h}
function pickDate(iso){setDateField(calendarTarget,iso);document.getElementById('calendarModal').classList.remove('open')}
function setDateField(target,iso){document.getElementById(target+'Date').value=iso;document.getElementById(target+'DateBtn').textContent=persianDate(iso)}
function changeMonth(n){calM+=n;if(calM>12){calM=1;calY++}if(calM<1){calM=12;calY--}renderCalendar()}

function goView(name){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+name));document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));window.scrollTo({top:0,behavior:'smooth'});if(name==='progress')setTimeout(()=>renderMeasurements(),50)}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function refreshAll(){renderHome();renderHistory();renderMeasurements()}

// events
document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>goView(b.dataset.view)));
document.getElementById('modalClose').onclick=()=>document.getElementById('exerciseModal').classList.remove('open');
document.getElementById('exerciseModal').addEventListener('click',e=>{if(e.target.id==='exerciseModal')e.currentTarget.classList.remove('open')});
document.getElementById('logDateBtn').onclick=()=>openCalendar('log');document.getElementById('measureDateBtn').onclick=()=>openCalendar('measure');document.getElementById('calClose').onclick=()=>document.getElementById('calendarModal').classList.remove('open');document.getElementById('calPrev').onclick=()=>changeMonth(-1);document.getElementById('calNext').onclick=()=>changeMonth(1);
document.getElementById('buildSession').onclick=()=>buildSession(false);document.getElementById('copyLast').onclick=()=>buildSession(true);document.getElementById('saveMeasure').onclick=saveMeasurement;
document.getElementById('exportReport').onclick=()=>download('گزارش-تمرین-مهدی.txt','\uFEFF'+reportText(),'text/plain;charset=utf-8');document.getElementById('copyReport').onclick=async()=>{try{await navigator.clipboard.writeText(reportText());toast('گزارش کپی شد')}catch(e){toast('کپی خودکار ممکن نبود؛ فایل متنی بگیر')}};document.getElementById('exportCsv').onclick=exportCSV;document.getElementById('exportJson').onclick=exportJSON;
document.getElementById('importJson').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!Array.isArray(x.sessions)||!Array.isArray(x.measurements))throw Error();data={...defaultData,...x};saveData();toast('پشتیبان بازیابی شد')}catch(err){alert('فایل پشتیبان معتبر نیست')}};r.readAsText(f)};
document.getElementById('clearData').onclick=()=>{if(confirm('همه اطلاعات تمرین و اندازه‌ها حذف شود؟ این کار قابل بازگشت نیست.')){data=structuredClone(defaultData);saveData();toast('اطلاعات پاک شد')}};
window.addEventListener('resize',()=>{if(document.getElementById('view-progress').classList.contains('active'))renderMeasurements()});

// init
const now=todayISO();document.getElementById('todayPersian').textContent=persianDate(now);document.getElementById('todayWeekday').textContent=new Intl.DateTimeFormat('fa-IR',{weekday:'long'}).format(new Date());populateWorkoutSelect();renderPlan();setDateField('log',now);setDateField('measure',now);renderSessionForm();refreshAll();
if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});