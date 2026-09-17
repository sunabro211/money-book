const { useState, useEffect } = React;

/* ⚠️ Apps Script 배포 URL(...exec) */
const API = "https://script.google.com/macros/s/AKfycbxsCcgoNEDJRnfcl-rPXbuO7Mygm8qgK2pwuZMzyE7J7iJYFSrqIZ10EXaMUwmgqwRk4w/exec";

function getKey(){
  const p = new URLSearchParams(location.search).get('k');
  if(p){ try{ localStorage.setItem('mb_k', p); }catch(e){} return p; }
  try{ return localStorage.getItem('mb_k') || ''; }catch(e){ return ''; }
}
async function api(action, payload={}){
  const res = await fetch(API, { method:'POST', body: JSON.stringify({ k:getKey(), action, payload }) });
  return res.json();
}

const ACCENT = { income:"#0CA678", expense:"#E8590C", krw:"#3B5BDB", lkr:"#E67700", gold:"#D9A404", good:"#0CA678", bad:"#E03131" };
const light = { bg:"#E9EFED", card:"#FFFFFF", ink:"#13312E", sub:"#5C736F", line:"#DBE4E1", soft:"#F5F7F6", chip:"#F1F4F3", hero1:"#13312E", hero2:"#1E4B45" };
const dark  = { bg:"#0E1A18", card:"#16241F", ink:"#EAF2EF", sub:"#8FA6A0", line:"#243530", soft:"#12201C", chip:"#1C2C27", hero1:"#0B1614", hero2:"#123833" };
let LANG='ko';
const CCY = { KRW:{color:ACCENT.krw, get unit(){return LANG==='en'?'\u20A9':'원';}}, LKR:{unit:"Rs",color:ACCENT.lkr} };
const DONUT = ["#3B5BDB","#0CA678","#E8590C","#7048E8","#E67700","#1098AD","#F03E3E","#868E96"];

const T = {
 ko:{ money:"돈",assets:"자산",debts:"빚",settings:"설정",spendable:"쓸 수 있는 돈",kr:"한국",lk:"스리랑카",rateEdit:"환율 수정",income:"수입",expense:"지출",left:"남은돈",thisMonth:"이번 달",trend:"월별 추이 (6개월)",accounts:"계좌",recent:"최근 내역",noTxn:"아직 내역이 없어요. + 로 첫 지출을 넣어보세요.",overview:"전체 요약",oMoney:"돈 (현금·은행)",oAssets:"자산 (부동산·금 등)",oLent:"빌려준 돈",oDebt:"빚 (대출·할부)",netW:"순자산",totalValue:"평가액 합계",totalPL:"총 손익",addAsset:"+ 자산 추가",addDebt:"+ 항목 추가",profit:"이익",loss:"손해",nowValue:"현재 가치",ret:"손익률",realestate:"부동산",gold:"금",fd:"적금(FD)",invest:"투자",other:"기타",principal:"원금",rateY:"연이자율",startDate:"가입일",monthly:"월이자",accrued:"지금까지 이자",maturity:"만기수령(원금)",buyDate:"구입일",buyPrice:"산 금액",nowValueHint:"비워두면 산 금액과 같아요",loan:"대출",installment:"할부",lent:"빌려준 돈",remain:"남은 금액",amtLent:"빌려준 금액",amtLoan:"빌린 금액",pay:"갚기",collect:"돌려받기",done:"완료",darkmode:"다크 모드",language:"언어",exrate:"환율",cats:"지출 분류",save:"저장",cancel:"취소",del:"삭제",name:"이름",currency:"통화",amount:"금액",memo:"메모(선택)",whichIn:"어느 계좌로 들어와요?",whichOut:"어느 계좌에서 나가요?",category:"분류",install:"홈 화면에 설치",loading:"불러오는 중\u2026",needKey:"링크로 접속해 주세요 (?k=\u2026)",badKey:"접속 키가 올바르지 않아요" },
 en:{ money:"Money",assets:"Assets",debts:"Debts",settings:"Settings",spendable:"Spendable money",kr:"Korea",lk:"Sri Lanka",rateEdit:"Edit rate",income:"Income",expense:"Expense",left:"Left",thisMonth:"This month",trend:"Monthly trend (6 mo)",accounts:"Accounts",recent:"Recent",noTxn:"No records yet. Tap + to add your first expense.",overview:"Overview",oMoney:"Money (cash & bank)",oAssets:"Assets (property, gold\u2026)",oLent:"Lent out",oDebt:"Debt (loans)",netW:"Net worth",totalValue:"Total value",totalPL:"Total P/L",addAsset:"+ Add asset",addDebt:"+ Add item",profit:"Profit",loss:"Loss",nowValue:"Current value",ret:"Return",realestate:"Real estate",gold:"Gold",fd:"Fixed deposit",invest:"Investment",other:"Other",principal:"Principal",rateY:"Annual rate",startDate:"Start date",monthly:"Monthly interest",accrued:"Interest so far",maturity:"At maturity",buyDate:"Buy date",buyPrice:"Bought for",nowValueHint:"Leave empty = same as bought",loan:"Loan",installment:"Installment",lent:"Lent out",remain:"Remaining",amtLent:"Amount lent",amtLoan:"Amount borrowed",pay:"Repay",collect:"Collect",done:"Done",darkmode:"Dark mode",language:"Language",exrate:"FX rate",cats:"Expense categories",save:"Save",cancel:"Cancel",del:"Delete",name:"Name",currency:"Currency",amount:"Amount",memo:"Memo (optional)",whichIn:"Into which account?",whichOut:"From which account?",category:"Category",install:"Install to home screen",loading:"Loading\u2026",needKey:"Please open via your link (?k=\u2026)",badKey:"Access key is not valid" }
};

const fmt = (n)=> Math.round(Number(n)||0).toLocaleString("en-US");
const today = ()=> new Date().toISOString().slice(0,10);
const monthsBetween = (d)=>{ if(!d) return 0; const a=new Date(d), b=new Date(); return Math.max(0,(b.getFullYear()-a.getFullYear())*12+(b.getMonth()-a.getMonth())); };
const monthKey = (y,m)=> y + '-' + String(m+1).padStart(2,'0');  // m: 0-index
const ymLabel = (key)=>{ const [y,m]=key.split('-'); return LANG==='en' ? new Date(Number(y),Number(m)-1,1).toLocaleString('en-US',{month:'short'})+' '+y : y+'년 '+Number(m)+'월'; };

function computePL(a){
  if(a.kind==="fd"){
    const monthly=(Number(a.principal)*(Number(a.rateY)/100))/12;
    const accrued=monthly*monthsBetween(a.startDate);
    return { invested:Number(a.principal)||0, current:(Number(a.principal)||0)+accrued, pl:accrued, monthly, accrued };
  }
  const bp=Number(a.buyPrice)||0, nv=Number(a.nowValue)||0;
  return { invested:bp, current:nv, pl:nv-bp };
}

function App(){
  const [status,setStatus]=useState("loading");
  const [dark_,setDark]=useState(false);
  const [lang,setLang]=useState("ko");
  const [user,setUser]=useState("");
  const [tab,setTab]=useState("money");
  const [rate,setRate]=useState(4.5);
  const [accounts,setAccounts]=useState([]);
  const [txns,setTxns]=useState([]);
  const [assets,setAssets]=useState([]);
  const [debts,setDebts]=useState([]);
  const [cats,setCats]=useState({expense:[],income:[]});
  const [modal,setModal]=useState(null);
  const [installEvt,setInstallEvt]=useState(null);
  const savingRef=React.useRef(false);

  const C = dark_?dark:light;
  const t = (k)=>T[lang][k];
  const changeLang = (l)=>{ LANG=l; setLang(l); };
  const toKRW = (amt,ccy)=> ccy==="LKR" ? Number(amt)*rate : Number(amt);

  async function load(){
    if(!API || API.indexOf("PASTE_")===0){ setStatus("need"); return; }
    if(!getKey()){ setStatus("need"); return; }
    try{
      const r = await api('load');
      if(!r.ok){ setStatus("bad"); return; }
      setUser(r.user); LANG=r.lang||'ko'; setLang(r.lang||'ko');
      setAccounts(r.accounts.map(a=>({...a, start:Number(a.start)||0})));
      setTxns(r.txns.map(x=>({...x, amount:Number(x.amount)})).reverse());
      setAssets(r.assets.map(a=>({ ...a, principal:Number(a.principal), rateY:Number(a.rateY), buyPrice:Number(a.buyPrice), nowValue:Number(a.nowValue) })));
      setDebts(r.debts.map(d=>({...d, remain:Number(d.remain)})));
      setRate(r.settings.rate);
      setCats(r.settings.cats||{expense:[],income:[]});
      setStatus("ready");
    }catch(e){ setStatus("bad"); }
  }
  useEffect(()=>{ load(); },[]);
  useEffect(()=>{ const h=(e)=>{ e.preventDefault(); setInstallEvt(e); }; window.addEventListener('beforeinstallprompt',h); return ()=>window.removeEventListener('beforeinstallprompt',h); },[]);

  const mut = async (action,payload)=>{ await api(action,payload); await load(); };
  const saveSetting = (key,value)=> api('saveSetting',{key,value});

  const balanceOf=(id)=>{ const acc=accounts.find(a=>a.id===id)||{start:0}; const d=txns.filter(x=>x.accountId===id).reduce((s,x)=>s+(x.type==="income"?Number(x.amount):-Number(x.amount)),0); return Number(acc.start)+d; };
  const krwCash=accounts.filter(a=>a.currency==="KRW").reduce((s,a)=>s+balanceOf(a.id),0);
  const lkrCash=accounts.filter(a=>a.currency==="LKR").reduce((s,a)=>s+balanceOf(a.id),0);
  const moneyKRW=krwCash+lkrCash*rate;
  const assetsKRW=assets.reduce((s,a)=>s+toKRW(computePL(a).current,a.currency),0);
  const lentKRW=debts.filter(d=>d.kind==="lent").reduce((s,d)=>s+toKRW(d.remain,d.currency),0);
  const oweKRW=debts.filter(d=>d.kind!=="lent").reduce((s,d)=>s+toKRW(d.remain,d.currency),0);
  const netWorth=moneyKRW+assetsKRW+lentKRW-oweKRW;

  if(status==="loading") return <Center C={light}>{T.ko.loading}</Center>;
  if(status==="need")   return <Center C={light}>{T.ko.needKey}</Center>;
  if(status==="bad")    return <Center C={light}>{T.ko.badKey}</Center>;

  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.ink,fontFamily:"'Apple SD Gothic Neo','Noto Sans KR',sans-serif"}} className="w-full">
      <div className="max-w-md mx-auto px-4 pt-5 pb-28">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold tracking-wide">MoneyBook · {user}</div>
          <div className="flex items-center gap-2">
            {installEvt && <button onClick={()=>{installEvt.prompt(); setInstallEvt(null);}} className="text-xs px-2.5 py-1 rounded-full font-semibold text-white" style={{background:C.ink}}>{t("install")}</button>}
            <button onClick={()=>setDark(!dark_)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:C.chip}}>{dark_?"☀️":"🌙"}</button>
          </div>
        </div>

        {tab==="money" && <Money {...{C,t,lang,rate,setRate:(v)=>{setRate(v);saveSetting('rate',v);},krwCash,lkrCash,moneyKRW,accounts,balanceOf,txns,toKRW,assetsKRW,lentKRW,oweKRW,netWorth,onSetStart:(accountId,start)=>mut('setStart',{accountId,start}),onDelTxn:(id)=>mut('delTxn',{id})}} />}
        {tab==="assets" && <Assets {...{C,t,assets,toKRW,onAdd:()=>setModal("newAsset"),onOpen:(a)=>setModal({asset:a})}} />}
        {tab==="debts" && <Debts {...{C,t,debts,onAdd:()=>setModal("newDebt"),onOpen:(d)=>setModal({debt:d})}} />}
        {tab==="settings" && <Settings {...{C,t,lang,setLang:changeLang,dark_,setDark,rate,setRate:(v)=>{setRate(v);saveSetting('rate',v);},cats}} />}
      </div>

      <div className="fixed bottom-0 left-0 right-0" style={{background:C.card,borderTop:`1px solid ${C.line}`}}>
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
          <Tab label={t("money")} icon="💵" on={tab==="money"} C={C} onClick={()=>setTab("money")} />
          <Tab label={t("assets")} icon="📈" on={tab==="assets"} C={C} onClick={()=>setTab("assets")} />
          <button onClick={()=>setModal("tx")} className="w-12 h-12 rounded-full text-white text-2xl flex items-center justify-center -mt-4 shadow-lg" style={{background:C.ink}}>+</button>
          <Tab label={t("debts")} icon="💳" on={tab==="debts"} C={C} onClick={()=>setTab("debts")} />
          <Tab label={t("settings")} icon="⚙️" on={tab==="settings"} C={C} onClick={()=>setTab("settings")} />
        </div>
      </div>

      {modal==="tx" && <TxForm {...{C,t,lang,accounts,cats}} onClose={()=>setModal(null)} onSave={async(x)=>{ if(savingRef.current)return; const dup=txns.find(z=>String(z.date).slice(0,10)===x.date&&z.accountId===x.accountId&&Number(z.amount)===Number(x.amount)&&z.type===x.type&&z.category===x.category); if(dup){ const who=dup.user?` (${dup.user})`:''; const msg=lang==='en'?`A similar record already exists${who}. Add it anyway?`:`이미 비슷한 내역이 있어요${who}. 그래도 추가할까요?`; if(!confirm(msg))return; } savingRef.current=true; setModal(null); await mut('addTxn',x); savingRef.current=false; }} />}
      {modal==="newAsset" && <AssetForm {...{C,t}} onClose={()=>setModal(null)} onSave={async(a)=>{ setModal(null); await mut('addAsset',a); }} />}
      {modal&&modal.asset && <AssetDetail {...{C,t,asset:modal.asset}} onClose={()=>setModal(null)} onNow={(id,nowValue)=>mut('updateAsset',{id,nowValue})} onDel={async(id)=>{ setModal(null); await mut('delAsset',{id}); }} />}
      {modal==="newDebt" && <DebtForm {...{C,t,lang,accounts}} onClose={()=>setModal(null)} onSave={async(d)=>{ setModal(null); await mut('addDebt',d); }} />}
      {modal&&modal.debt && <DebtDetail {...{C,t,lang,debt:modal.debt,accounts}} onClose={()=>setModal(null)} onPay={(debtId,pl)=>mut('payDebt',{debtId,...pl})} onDel={async(id)=>{ setModal(null); await mut('delDebt',{id}); }} />}
    </div>
  );
}

function Money({C,t,lang,rate,setRate,krwCash,lkrCash,moneyKRW,accounts,balanceOf,txns,toKRW,assetsKRW,lentKRW,oweKRW,netWorth,onSetStart,onDelTxn}){
  const [editRate,setEditRate]=useState(false);
  const [editAcc,setEditAcc]=useState(null);
  const nowKey=today().slice(0,7);
  const [ym,setYm]=useState(nowKey);
  const accById=(id)=>accounts.find(a=>a.id===id)||{currency:"KRW",ko:"",en:""};

  // 선택한 달 통계
  const mtx=txns.filter(x=>x.date && String(x.date).slice(0,7)===ym);
  const inc=mtx.filter(x=>x.type==="income").reduce((s,x)=>s+toKRW(x.amount,accById(x.accountId).currency),0);
  const exp=mtx.filter(x=>x.type==="expense").reduce((s,x)=>s+toKRW(x.amount,accById(x.accountId).currency),0);
  const byCat={}; mtx.filter(x=>x.type==="expense").forEach(x=>{ byCat[x.category]=(byCat[x.category]||0)+toKRW(x.amount,accById(x.accountId).currency); });
  const dData=Object.entries(byCat).map(([k,v],i)=>({k,v,color:DONUT[i%DONUT.length]}));
  const dTot=dData.reduce((s,d)=>s+d.v,0); let ac=0;
  const seg=dData.map(d=>{const a=(ac/dTot)*360;ac+=d.v;const b=(ac/dTot)*360;return `${d.color} ${a}deg ${b}deg`;}).join(", ");

  // 월 이동 (다음달은 이번달까지만)
  const shiftYm=(delta)=>{ const [y,m]=ym.split('-').map(Number); const d=new Date(y,m-1+delta,1); const k=monthKey(d.getFullYear(),d.getMonth()); if(k<=nowKey) setYm(k); };
  const isNow=ym===nowKey;

  // 최근 6개월 추이
  const now=new Date();
  const months6=[...Array(6)].map((_,i)=>{ const d=new Date(now.getFullYear(),now.getMonth()-(5-i),1); return monthKey(d.getFullYear(),d.getMonth()); });
  const monthTot=(key)=>{ const list=txns.filter(x=>x.date && String(x.date).slice(0,7)===key); const i=list.filter(x=>x.type==="income").reduce((s,x)=>s+toKRW(x.amount,accById(x.accountId).currency),0); const e=list.filter(x=>x.type==="expense").reduce((s,x)=>s+toKRW(x.amount,accById(x.accountId).currency),0); return {i,e}; };
  const bars=months6.map(k=>({k,...monthTot(k)}));
  const barMax=Math.max(1,...bars.map(b=>Math.max(b.i,b.e)));

  return (<>
    <div className="rounded-3xl p-5 mb-4" style={{background:`linear-gradient(150deg, ${C.hero1}, ${C.hero2})`,color:"#fff"}}>
      <div className="tracking-widest opacity-70" style={{fontSize:11}}>{t("spendable")}</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl px-3 py-3" style={{background:"rgba(255,255,255,.1)"}}>
          <div className="flex items-center gap-1.5 opacity-85" style={{fontSize:12}}><span className="w-2 h-2 rounded-full" style={{background:ACCENT.krw}}/>🇰🇷 {t("kr")}</div>
          <div className="text-2xl font-bold mt-1" style={{fontVariantNumeric:"tabular-nums"}}>{fmt(krwCash)}<span className="text-sm font-normal ml-0.5 opacity-80">원</span></div>
        </div>
        <div className="rounded-2xl px-3 py-3" style={{background:"rgba(255,255,255,.1)"}}>
          <div className="flex items-center gap-1.5 opacity-85" style={{fontSize:12}}><span className="w-2 h-2 rounded-full" style={{background:ACCENT.lkr}}/>🇱🇰 {t("lk")}</div>
          <div className="text-2xl font-bold mt-1" style={{fontVariantNumeric:"tabular-nums"}}>{fmt(lkrCash)}<span className="text-sm font-normal ml-0.5 opacity-80">Rs</span></div>
        </div>
      </div>
      <div className="mt-3 opacity-80" style={{fontSize:12}}>{editRate?(<span className="inline-flex items-center gap-1">1 Rs = <input autoFocus type="number" defaultValue={rate} onBlur={(e)=>{setRate(parseFloat(e.target.value)||0);setEditRate(false);}} className="w-16 px-1 rounded text-black text-center"/>원</span>):(<button onClick={()=>setEditRate(true)} className="underline underline-offset-2">1 Rs = {rate}원 · {t("rateEdit")}</button>)}</div>
    </div>

    {/* 월 이동 */}
    <div className="flex items-center justify-between mb-3 px-1">
      <button onClick={()=>shiftYm(-1)} className="w-9 h-9 rounded-full flex items-center justify-center text-sm" style={{background:C.card,border:`1px solid ${C.line}`,color:C.ink}}>◀</button>
      <div className="text-sm font-bold">{ymLabel(ym)}{isNow?` · ${t("thisMonth")}`:""}</div>
      <button onClick={()=>shiftYm(1)} disabled={isNow} className="w-9 h-9 rounded-full flex items-center justify-center text-sm" style={{background:C.card,border:`1px solid ${C.line}`,color:isNow?C.line:C.ink}}>▶</button>
    </div>

    <div className="rounded-2xl p-4 mb-4 grid grid-cols-3" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <Stat label={t("income")} value={inc} color={ACCENT.income} C={C}/><Stat label={t("expense")} value={exp} color={ACCENT.expense} C={C} border/><Stat label={t("left")} value={inc-exp} color={C.ink} C={C}/>
    </div>

    {dTot>0 && <div className="rounded-2xl p-4 mb-4 flex items-center gap-4" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <div className="relative" style={{width:96,height:96}}><div className="rounded-full w-full h-full" style={{background:`conic-gradient(${seg})`}}/><div className="absolute rounded-full flex items-center justify-center" style={{inset:14,background:C.card}}><span style={{fontSize:11,color:C.sub}}>{ymLabel(ym)}</span></div></div>
      <div className="flex-1 space-y-1">{dData.slice().sort((a,b)=>b.v-a.v).slice(0,5).map(d=>(<div key={d.k} className="flex items-center gap-2" style={{fontSize:12}}><span className="w-2.5 h-2.5 rounded-full" style={{background:d.color}}/><span className="flex-1">{d.k}</span><span style={{color:C.sub,fontVariantNumeric:"tabular-nums"}}>{Math.round((d.v/dTot)*100)}%</span></div>))}</div>
    </div>}

    {/* 월별 6개월 추이 그래프 */}
    <SectionLabel C={C}>{t("trend")}</SectionLabel>
    <div className="rounded-2xl p-4 mb-4" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <div className="flex items-center gap-3 mb-3" style={{fontSize:11,color:C.sub}}>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{background:ACCENT.income}}/>{t("income")}</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm" style={{background:ACCENT.expense}}/>{t("expense")}</span>
      </div>
      <div className="flex items-end justify-between gap-2" style={{height:96}}>
        {bars.map(b=>{ const on=b.k===ym; const [,mm]=b.k.split('-'); return (
          <button key={b.k} onClick={()=>setYm(b.k)} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
            <div className="flex items-end gap-0.5" style={{height:72}}>
              <div style={{width:9,height:Math.max(2,(b.i/barMax)*72),background:ACCENT.income,borderRadius:"3px 3px 0 0",opacity:on?1:0.55}}/>
              <div style={{width:9,height:Math.max(2,(b.e/barMax)*72),background:ACCENT.expense,borderRadius:"3px 3px 0 0",opacity:on?1:0.55}}/>
            </div>
            <span style={{fontSize:10,fontWeight:on?700:400,color:on?C.ink:C.sub}}>{Number(mm)}월</span>
          </button>);})}
      </div>
    </div>

    <SectionLabel C={C}>{t("accounts")}</SectionLabel>
    <div className="space-y-2 mb-4">{accounts.map(a=>{ const cur=CCY[a.currency]; const bal=balanceOf(a.id); return (
      <div key={a.id} className="rounded-2xl p-3.5" style={{background:C.card,border:`1px solid ${C.line}`}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="font-bold px-1.5 py-0.5 rounded" style={{fontSize:10,background:cur.color+"1A",color:cur.color}}>{a.currency}</span><span className="text-sm font-medium">{a[lang]}</span></div>
          <div className="flex items-center gap-2"><span className="text-lg font-bold" style={{fontVariantNumeric:"tabular-nums"}}>{fmt(bal)}<span className="text-xs font-normal ml-0.5" style={{color:C.sub}}>{cur.unit}</span></span><button onClick={()=>setEditAcc(editAcc===a.id?null:a.id)} style={{fontSize:13,color:C.sub}}>✏️</button></div>
        </div>
        {editAcc===a.id && <div className="mt-2 flex items-center gap-2"><input type="number" defaultValue={a.start} className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-sm" style={{border:`1px solid ${C.line}`,background:C.soft,color:C.ink}} onBlur={(e)=>{ onSetStart(a.id, parseFloat(e.target.value)||0); }} /><button onClick={()=>setEditAcc(null)} className="px-3 py-1.5 rounded-lg text-sm text-white" style={{background:C.ink}}>OK</button></div>}
      </div>);})}</div>

    <SectionLabel C={C}>{t("recent")}</SectionLabel>
    {txns.length===0 ? <div className="rounded-2xl p-6 text-center text-sm mb-4" style={{background:C.card,border:`1px dashed ${C.line}`,color:C.sub}}>{t("noTxn")}</div>
     : <div className="space-y-1.5 mb-4">{txns.slice(0,15).map(x=>{ const a=accById(x.accountId); const cur=CCY[a.currency]; const pos=x.type==="income"; return (
        <div key={x.id} className="rounded-xl px-3 py-2.5 flex items-center gap-3" style={{background:C.card,border:`1px solid ${C.line}`}}>
          <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{x.category}{x.memo?` · ${x.memo}`:""}</div><div style={{fontSize:11,color:C.sub}}>{String(x.date).slice(0,10)} · {a[lang]}</div></div>
          <div className="text-sm font-semibold whitespace-nowrap" style={{color:pos?ACCENT.income:ACCENT.expense,fontVariantNumeric:"tabular-nums"}}>{pos?"+":"−"}{fmt(x.amount)}{cur.unit}</div>
          <button onClick={()=>onDelTxn(x.id)} className="text-lg leading-none px-1" style={{color:C.line}}>×</button>
        </div>);})}</div>}

    <SectionLabel C={C}>{t("overview")}</SectionLabel>
    <div className="rounded-2xl p-4" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <OverRow C={C} k={t("oMoney")} v={moneyKRW} dot={ACCENT.krw}/>
      <OverRow C={C} k={t("oAssets")} v={assetsKRW} dot={ACCENT.gold}/>
      {lentKRW>0 && <OverRow C={C} k={t("oLent")} v={lentKRW} dot={ACCENT.income}/>}
      {oweKRW>0 && <OverRow C={C} k={t("oDebt")} v={-oweKRW} dot={ACCENT.expense}/>}
      <div className="flex items-center justify-between pt-3 mt-1" style={{borderTop:`1px solid ${C.line}`}}><span className="text-sm font-bold">{t("netW")}</span><span className="text-xl font-bold" style={{fontVariantNumeric:"tabular-nums"}}>{fmt(netWorth)}원</span></div>
    </div>
  </>);
}

function Assets({C,t,assets,toKRW,onAdd,onOpen}){
  const order=["realestate","gold","fd","invest","other"];
  const totalValue=assets.reduce((s,a)=>s+toKRW(computePL(a).current,a.currency),0);
  const totalPL=assets.reduce((s,a)=>s+toKRW(computePL(a).pl,a.currency),0);
  const good=totalPL>=0;
  return (<>
    <div className="flex items-center justify-between mb-3"><SectionLabel C={C} nomb>{t("assets")}</SectionLabel><button onClick={onAdd} className="text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{background:C.ink}}>{t("addAsset")}</button></div>
    <div className="rounded-2xl p-4 mb-4 flex items-center justify-between" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <div><div style={{fontSize:11,color:C.sub}}>{t("totalValue")}</div><div className="text-xl font-bold" style={{fontVariantNumeric:"tabular-nums"}}>{fmt(totalValue)}원</div></div>
      <div className="text-right"><div style={{fontSize:11,color:C.sub}}>{t("totalPL")}</div><div className="text-xl font-bold" style={{color:good?ACCENT.good:ACCENT.bad,fontVariantNumeric:"tabular-nums"}}>{good?"+":"−"}{fmt(Math.abs(totalPL))}원</div></div>
    </div>
    {order.map(kind=>{ const items=assets.filter(a=>a.kind===kind); if(!items.length) return null; return (
      <div key={kind} className="mb-4">
        <div style={{fontSize:12,fontWeight:600,color:C.sub}} className="mb-2">{t(kind)}</div>
        <div className="space-y-3">{items.map(a=>{ const p=computePL(a); const cur=CCY[a.currency]; const isFD=a.kind==="fd"; const pct=p.invested>0?p.pl/p.invested*100:0; const g=p.pl>=0; return (
          <button key={a.id} onClick={()=>onOpen(a)} className="w-full text-left rounded-2xl p-4" style={{background:C.card,border:`1px solid ${C.line}`}}>
            <div className="flex items-center gap-2"><span className="font-bold px-1.5 py-0.5 rounded" style={{fontSize:10,background:cur.color+"1A",color:cur.color}}>{a.currency}</span><span className="text-sm font-semibold">{a.name}</span></div>
            <div className="mt-3 rounded-xl p-3" style={{background:(g?ACCENT.good:ACCENT.bad)+"12"}}>
              <div className="flex items-center justify-between"><span className="text-xs font-semibold" style={{color:g?ACCENT.good:ACCENT.bad}}>{g?t("profit"):t("loss")}</span><span style={{fontSize:11,color:C.sub}}>{t("ret")} {pct>=0?"+":""}{pct.toFixed(1)}%</span></div>
              <div className="text-2xl font-bold mt-0.5" style={{color:g?ACCENT.good:ACCENT.bad,fontVariantNumeric:"tabular-nums"}}>{g?"+":"−"}{fmt(Math.abs(p.pl))}<span className="text-sm font-normal ml-0.5">{cur.unit}</span></div>
            </div>
            <div className={"mt-3 grid text-center "+(isFD?"grid-cols-3":"grid-cols-2")} style={{fontSize:11}}>
              <MiniStat label={isFD?t("principal"):t("buyPrice")} value={fmt(p.invested)} C={C}/>
              {isFD && <MiniStat label={t("accrued")} value={fmt(p.accrued)} C={C}/>}
              <MiniStat label={isFD?t("maturity"):t("nowValue")} value={fmt(isFD?a.principal:p.current)} C={C}/>
            </div>
          </button>);})}</div>
      </div>);})}
  </>);
}

function AssetDetail({C,t,asset,onNow,onDel,onClose}){
  const [a,setA]=useState(asset);
  const cur=CCY[a.currency]; const p=computePL(a); const isFD=a.kind==="fd";
  const setNow=(v)=>{ setA({...a,nowValue:v}); onNow(a.id,v); };
  return (<Sheet C={C} onClose={onClose}>
    <div className="flex items-center justify-between mb-3"><span className="text-base font-bold">{a.name}</span><button onClick={()=>onDel(a.id)} className="text-xs" style={{color:ACCENT.bad}}>{t("del")}</button></div>
    {isFD ? (
      <div className="rounded-xl p-3 mb-3 text-sm" style={{background:C.soft}}>
        <Row C={C} k={t("principal")} v={`${fmt(a.principal)}${cur.unit}`}/>
        <Row C={C} k={t("rateY")} v={`${a.rateY}%`}/>
        <Row C={C} k={t("monthly")} v={`${fmt(p.monthly)}${cur.unit}`}/>
        <Row C={C} k={t("accrued")} v={`${fmt(p.accrued)}${cur.unit}`} last/>
      </div>
    ) : (<>
      <div className="rounded-xl p-3 mb-3 text-sm" style={{background:C.soft}}>
        {a.startDate && <Row C={C} k={t("buyDate")} v={String(a.startDate).slice(0,10)}/>}
        <Row C={C} k={t("buyPrice")} v={`${fmt(a.buyPrice)}${cur.unit}`} last/>
      </div>
      <div className="mb-1">
        <div style={{fontSize:12,color:C.sub}} className="mb-1">{t("nowValue")}</div>
        <div className="flex items-center gap-2"><input type="number" defaultValue={a.nowValue} onBlur={(e)=>setNow(parseFloat(e.target.value)||0)} className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/><span className="text-sm" style={{color:C.sub}}>{cur.unit}</span></div>
      </div>
    </>)}
    <div className="rounded-xl p-3 mt-3 flex items-center justify-between" style={{background:(p.pl>=0?ACCENT.good:ACCENT.bad)+"12"}}>
      <span className="text-sm font-semibold" style={{color:p.pl>=0?ACCENT.good:ACCENT.bad}}>{p.pl>=0?t("profit"):t("loss")}</span>
      <span className="text-lg font-bold" style={{color:p.pl>=0?ACCENT.good:ACCENT.bad,fontVariantNumeric:"tabular-nums"}}>{p.pl>=0?"+":"−"}{fmt(Math.abs(p.pl))}{cur.unit}</span>
    </div>
  </Sheet>);
}

function Debts({C,t,debts,onAdd,onOpen}){
  const label={loan:t("loan"),installment:t("installment"),lent:t("lent")};
  return (<>
    <div className="flex items-center justify-between mb-3"><SectionLabel C={C} nomb>{t("debts")}</SectionLabel><button onClick={onAdd} className="text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{background:C.ink}}>{t("addDebt")}</button></div>
    {debts.length===0 ? <div className="rounded-2xl p-6 text-center text-sm" style={{background:C.card,border:`1px dashed ${C.line}`,color:C.sub}}>—</div>
     : <div className="space-y-2">{debts.map(d=>{ const cur=CCY[d.currency]; const lent=d.kind==="lent"; const done=Number(d.remain)<=0; return (
        <button key={d.id} onClick={()=>onOpen(d)} className="w-full text-left rounded-2xl p-4 flex items-center justify-between" style={{background:C.card,border:`1px solid ${C.line}`}}>
          <div><div className="text-sm font-semibold">{d.name}</div><div style={{fontSize:11,color:done?ACCENT.good:C.sub}}>{label[d.kind]}{done?` · ✓ ${t("done")}`:""}</div></div>
          <div className="text-lg font-bold" style={{color:done?C.sub:lent?ACCENT.income:ACCENT.expense,fontVariantNumeric:"tabular-nums"}}>{lent?"+":"−"}{fmt(d.remain)}<span className="text-xs font-normal ml-0.5" style={{color:C.sub}}>{cur.unit}</span></div>
        </button>);})}</div>}
  </>);
}

function DebtDetail({C,t,lang,debt,accounts,onPay,onDel,onClose}){
  const [d,setD]=useState(debt);
  const isLent=d.kind==="lent"; const cur=CCY[d.currency];
  const accts=accounts.filter(a=>a.currency===d.currency);
  const [amt,setAmt]=useState(""); const [accountId,setAccountId]=useState(accts[0]?accts[0].id:""); const [sent,setSent]=useState(false);
  const done=Number(d.remain)<=0; const act=isLent?t("collect"):t("pay");
  const label={loan:t("loan"),installment:t("installment"),lent:t("lent")};
  const submit=()=>{ if(sent||!(parseFloat(amt)>0)||!accountId) return; setSent(true); setD({...d,remain:Math.max(0,Number(d.remain)-parseFloat(amt))}); onPay(d.id,{amount:parseFloat(amt),accountId,kind:d.kind,category:d.name,memo:act,date:today()}); setTimeout(onClose,300); };
  return (<Sheet C={C} onClose={onClose}>
    <div className="flex items-center justify-between mb-3"><span className="text-base font-bold">{d.name}</span><button onClick={()=>onDel(d.id)} className="text-xs" style={{color:ACCENT.bad}}>{t("del")}</button></div>
    <div className="rounded-2xl p-4 mb-3 text-center" style={{background:C.soft}}>
      <div style={{fontSize:11,color:C.sub}}>{label[d.kind]} · {t("remain")}</div>
      <div className="text-2xl font-bold mt-0.5" style={{color:done?ACCENT.good:isLent?ACCENT.income:ACCENT.expense,fontVariantNumeric:"tabular-nums"}}>{fmt(d.remain)}{cur.unit}</div>
      {done && <div className="text-xs font-semibold mt-1" style={{color:ACCENT.good}}>✓ {t("done")}</div>}
    </div>
    {!done && <>
      <div className="rounded-2xl px-4 py-3 mb-3 flex items-end gap-2" style={{background:C.soft}}>
        <input autoFocus type="number" inputMode="numeric" value={amt} onChange={(e)=>setAmt(e.target.value)} placeholder="0" className="flex-1 min-w-0 bg-transparent text-3xl font-bold outline-none" style={{color:C.ink,fontVariantNumeric:"tabular-nums"}}/>
        <span className="text-lg mb-1" style={{color:C.sub}}>{cur.unit}</span>
      </div>
      <div className="mb-3">
        <div style={{fontSize:12,color:C.sub}} className="mb-1.5">{isLent?t("whichIn"):t("whichOut")}</div>
        <div className="grid grid-cols-2 gap-1.5">{accts.map(a=>{ const on=a.id===accountId; return (<button key={a.id} onClick={()=>setAccountId(a.id)} className="py-2 rounded-lg text-xs font-medium text-left px-2.5" style={{background:on?C.ink:C.chip,color:on?"#fff":C.ink}}>{a[lang]}</button>);})}</div>
      </div>
      <button onClick={submit} disabled={!(parseFloat(amt)>0)||sent} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{background:parseFloat(amt)>0&&!sent?C.ink:"#B9C6C2"}}>{act}</button>
    </>}
  </Sheet>);
}

function Settings({C,t,lang,setLang,dark_,setDark,rate,setRate,cats}){
  return (<>
    <SectionLabel C={C}>{t("settings")}</SectionLabel>
    <div className="rounded-2xl overflow-hidden mb-4" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <SettingRow C={C} label={t("darkmode")}><Toggle on={dark_} onClick={()=>setDark(!dark_)} C={C}/></SettingRow>
      <SettingRow C={C} label={t("language")}><div className="flex gap-1">{["ko","en"].map(l=>(<button key={l} onClick={()=>setLang(l)} className="px-3 py-1 rounded-full text-xs font-semibold" style={{background:lang===l?C.ink:C.chip,color:lang===l?"#fff":C.sub}}>{l==="ko"?"한국어":"EN"}</button>))}</div></SettingRow>
      <SettingRow C={C} label={t("exrate")} last><span className="inline-flex items-center gap-1 text-sm">1 Rs = <input type="number" defaultValue={rate} onBlur={(e)=>setRate(parseFloat(e.target.value)||0)} className="w-14 px-1 rounded text-center" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/>원</span></SettingRow>
    </div>
    <SectionLabel C={C}>{t("cats")}</SectionLabel>
    <div className="rounded-2xl p-4" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <div className="flex flex-wrap gap-1.5">{(cats.expense||[]).map((c,i)=>(<span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{background:C.chip,color:C.ink}}>{c[lang]}</span>))}</div>
    </div>
  </>);
}

function TxForm({C,t,lang,accounts,cats,onSave,onClose}){
  const [type,setType]=useState("expense");
  const [accountId,setAccountId]=useState(accounts[0]?accounts[0].id:"");
  const [amount,setAmount]=useState(""); const [category,setCategory]=useState(""); const [memo,setMemo]=useState(""); const [date,setDate]=useState(today());
  const acc=accounts.find(a=>a.id===accountId)||accounts[0]||{currency:"KRW"}; const cur=CCY[acc.currency];
  const list=cats[type]||[]; const valid=parseFloat(amount)>0 && category;
  return (<Sheet C={C} onClose={onClose}>
    <div className="grid grid-cols-2 gap-2 mb-4">{[["expense",t("expense")],["income",t("income")]].map(([tp,lbl])=>{ const on=type===tp; const col=tp==="income"?ACCENT.income:ACCENT.expense; return (<button key={tp} onClick={()=>{setType(tp);setCategory("");}} className="py-2.5 rounded-xl text-sm font-semibold" style={{background:on?col:C.chip,color:on?"#fff":C.sub}}>{lbl}</button>);})}</div>
    <div className="rounded-2xl px-4 py-3 mb-3 flex items-end gap-2" style={{background:C.soft}}>
      <input autoFocus type="number" inputMode="numeric" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="0" className="flex-1 min-w-0 bg-transparent text-3xl font-bold outline-none" style={{color:C.ink,fontVariantNumeric:"tabular-nums"}}/>
      <span className="text-lg mb-1" style={{color:C.sub}}>{cur.unit}</span>
    </div>
    <div className="mb-3">
      <div style={{fontSize:12,color:C.sub}} className="mb-1.5">{type==="income"?t("whichIn"):t("whichOut")}</div>
      <div className="grid grid-cols-2 gap-1.5">{accounts.map(a=>{ const on=a.id===accountId; return (<button key={a.id} onClick={()=>setAccountId(a.id)} className="py-2 rounded-lg text-xs font-medium text-left px-2.5" style={{background:on?C.ink:C.chip,color:on?"#fff":C.ink}}>{a[lang]}</button>);})}</div>
    </div>
    <div className="mb-3">
      <div style={{fontSize:12,color:C.sub}} className="mb-1.5">{t("category")}</div>
      <div className="flex flex-wrap gap-1.5">{list.map((c,i)=>{ const on=c[lang]===category; return (<button key={i} onClick={()=>setCategory(c[lang])} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{background:on?C.ink:C.chip,color:on?"#fff":C.sub}}>{c[lang]}</button>);})}</div>
    </div>
    <div className="flex gap-2 mb-4">
      <input value={memo} onChange={(e)=>setMemo(e.target.value)} placeholder={t("memo")} className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm outline-none" style={{background:C.soft,color:C.ink}}/>
      <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{background:C.soft,color:C.ink}}/>
    </div>
    <div className="flex gap-2"><button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-semibold" style={{background:C.chip,color:C.sub}}>{t("cancel")}</button><button onClick={()=>valid&&onSave({type,accountId,amount:parseFloat(amount),category,memo,date})} disabled={!valid} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{background:valid?C.ink:"#B9C6C2"}}>{t("save")}</button></div>
  </Sheet>);
}

function AssetForm({C,t,onSave,onClose}){
  const [kind,setKind]=useState("realestate"); const [name,setName]=useState(""); const [currency,setCurrency]=useState("KRW");
  const [principal,setPrincipal]=useState(""); const [rateY,setRateY]=useState(""); const [startDate,setStartDate]=useState(today());
  const [buyDate,setBuyDate]=useState(today()); const [buyPrice,setBuyPrice]=useState(""); const [nowValue,setNowValue]=useState("");
  const isFD=kind==="fd";
  const valid=name && (isFD?parseFloat(principal)>0:parseFloat(buyPrice)>0);
  const save=()=>{ if(!valid)return; if(isFD) onSave({kind,name,currency,principal:+principal,rateY:+rateY,startDate}); else onSave({kind,name,currency,startDate:buyDate,buyPrice:+buyPrice,nowValue:+nowValue||+buyPrice}); };
  const kinds=[["realestate",t("realestate")],["gold",t("gold")],["fd",t("fd")],["invest",t("invest")],["other",t("other")]];
  return (<Sheet C={C} onClose={onClose}>
    <div className="text-base font-bold mb-3">{t("addAsset")}</div>
    <div className="grid grid-cols-3 gap-1.5 mb-3">{kinds.map(([k,lbl])=>(<button key={k} onClick={()=>setKind(k)} className="py-2 rounded-lg font-medium" style={{fontSize:11,background:kind===k?C.ink:C.chip,color:kind===k?"#fff":C.sub}}>{lbl}</button>))}</div>
    <Field C={C} label={t("name")}><input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
    <Field C={C} label={t("currency")}><div className="flex gap-1.5">{["KRW","LKR"].map(c=>(<button key={c} onClick={()=>setCurrency(c)} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{background:currency===c?CCY[c].color:C.chip,color:currency===c?"#fff":C.sub}}>{c}</button>))}</div></Field>
    {isFD ? (<>
      <Field C={C} label={t("principal")}><input type="number" value={principal} onChange={(e)=>setPrincipal(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
      <Field C={C} label={t("rateY")+" (%)"}><input type="number" value={rateY} onChange={(e)=>setRateY(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
      <Field C={C} label={t("startDate")}><input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
    </>) : (<>
      <Field C={C} label={t("buyDate")}><input type="date" value={buyDate} onChange={(e)=>setBuyDate(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
      <Field C={C} label={t("buyPrice")}><input type="number" value={buyPrice} onChange={(e)=>setBuyPrice(e.target.value)} placeholder="0" className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
      <Field C={C} label={t("nowValue")}>
        <input type="number" value={nowValue} onChange={(e)=>setNowValue(e.target.value)} placeholder={buyPrice||"0"} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/>
        <div style={{fontSize:11,color:C.sub}} className="mt-1">{t("nowValueHint")}</div>
      </Field>
    </>)}
    <div className="flex gap-2 mt-4"><button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-semibold" style={{background:C.chip,color:C.sub}}>{t("cancel")}</button><button onClick={save} disabled={!valid} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{background:valid?C.ink:"#B9C6C2"}}>{t("save")}</button></div>
  </Sheet>);
}

function DebtForm({C,t,lang,accounts,onSave,onClose}){
  const [kind,setKind]=useState("loan"); const [name,setName]=useState(""); const [currency,setCurrency]=useState("KRW"); const [remain,setRemain]=useState(""); const [accountId,setAccountId]=useState("");
  const needAcc=kind==="lent"||kind==="loan";
  const accts=(accounts||[]).filter(a=>a.currency===currency);
  const valid=name && parseFloat(remain)>0 && (!needAcc||accountId);
  const kinds=[["loan",t("loan")],["installment",t("installment")],["lent",t("lent")]];
  const amtLabel = kind==="lent"?t("amtLent") : kind==="loan"?t("amtLoan") : t("remain");
  const submit=()=>{ if(!valid)return; const memo=kind==="lent"?t("lent"):kind==="loan"?t("loan"):""; onSave({kind,name,currency,remain:+remain,accountId:needAcc?accountId:"",memo,date:today()}); };
  return (<Sheet C={C} onClose={onClose}>
    <div className="text-base font-bold mb-3">{t("addDebt")}</div>
    <div className="grid grid-cols-3 gap-1.5 mb-3">{kinds.map(([k,lbl])=>(<button key={k} onClick={()=>setKind(k)} className="py-2 rounded-lg font-medium" style={{fontSize:11,background:kind===k?C.ink:C.chip,color:kind===k?"#fff":C.sub}}>{lbl}</button>))}</div>
    <Field C={C} label={t("name")}><input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
    <Field C={C} label={t("currency")}><div className="flex gap-1.5">{["KRW","LKR"].map(c=>(<button key={c} onClick={()=>{setCurrency(c);setAccountId("");}} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{background:currency===c?CCY[c].color:C.chip,color:currency===c?"#fff":C.sub}}>{c}</button>))}</div></Field>
    <Field C={C} label={amtLabel}><input type="number" value={remain} onChange={(e)=>setRemain(e.target.value)} placeholder="0" className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
    {needAcc && <Field C={C} label={kind==="lent"?t("whichOut"):t("whichIn")}><div className="grid grid-cols-2 gap-1.5">{accts.map(a=>{ const on=a.id===accountId; return (<button key={a.id} onClick={()=>setAccountId(a.id)} className="py-2 rounded-lg text-xs font-medium text-left px-2.5" style={{background:on?C.ink:C.chip,color:on?"#fff":C.ink}}>{a[lang]}</button>);})}</div></Field>}
    <div className="flex gap-2 mt-4"><button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-semibold" style={{background:C.chip,color:C.sub}}>{t("cancel")}</button><button onClick={submit} disabled={!valid} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{background:valid?C.ink:"#B9C6C2"}}>{t("save")}</button></div>
  </Sheet>);
}

function Sheet({C,children,onClose}){ return (<div className="fixed inset-0 z-50 flex flex-col justify-end items-center" style={{background:"rgba(0,0,0,.4)"}} onClick={onClose}><div className="w-full max-w-md rounded-t-3xl p-5 pb-8 overflow-y-auto" style={{background:C.card,color:C.ink,maxHeight:"90vh",fontFamily:"'Apple SD Gothic Neo','Noto Sans KR',sans-serif"}} onClick={(e)=>e.stopPropagation()}><div className="w-10 h-1 rounded-full mx-auto mb-4" style={{background:C.line}}/>{children}</div></div>); }
function Center({C,children}){ return (<div style={{background:C.bg,minHeight:"100vh",color:C.sub}} className="flex items-center justify-center text-sm px-6 text-center">{children}</div>); }
function Tab({label,icon,on,onClick,C}){ return (<button onClick={onClick} className="flex flex-col items-center gap-0.5 w-14"><span style={{fontSize:18,opacity:on?1:0.5}}>{icon}</span><span style={{fontSize:10,color:on?C.ink:C.sub,fontWeight:on?700:400}}>{label}</span></button>); }
function Stat({label,value,color,C,border}){ return (<div className="text-center" style={{borderLeft:border?`1px solid ${C.line}`:"none",borderRight:border?`1px solid ${C.line}`:"none"}}><div style={{fontSize:11,color:C.sub}}>{label}</div><div className="text-base font-bold mt-0.5" style={{color,fontVariantNumeric:"tabular-nums"}}>{fmt(value)}</div></div>); }
function MiniStat({label,value,C}){ return (<div><div style={{color:C.sub}}>{label}</div><div className="font-semibold mt-0.5" style={{color:C.ink,fontVariantNumeric:"tabular-nums"}}>{value}</div></div>); }
function OverRow({C,k,v,dot}){ const neg=v<0; return (<div className="flex items-center justify-between py-1.5"><span className="flex items-center gap-2 text-sm" style={{color:C.sub}}><span className="w-2 h-2 rounded-full" style={{background:dot}}/>{k}</span><span className="text-sm font-semibold" style={{fontVariantNumeric:"tabular-nums",color:neg?ACCENT.expense:C.ink}}>{neg?"−":""}{fmt(Math.abs(v))}{CCY.KRW.unit}</span></div>); }
function SectionLabel({C,children,nomb}){ return <div className={nomb?"":"mb-2"} style={{fontSize:12,fontWeight:600,color:C.sub,letterSpacing:".02em"}}>{children}</div>; }
function SettingRow({C,label,children,last}){ return (<div className="flex items-center justify-between px-4 py-3" style={{borderBottom:last?"none":`1px solid ${C.line}`}}><span className="text-sm">{label}</span>{children}</div>); }
function Toggle({on,onClick,C}){ return (<button onClick={onClick} className="w-11 h-6 rounded-full flex items-center px-0.5" style={{background:on?ACCENT.income:C.line}}><span className="w-5 h-5 rounded-full bg-white" style={{marginLeft:on?20:0,transition:"margin .15s"}}/></button>); }
function Field({C,label,children}){ return (<div className="mb-3"><div style={{fontSize:12,color:C.sub}} className="mb-1">{label}</div>{children}</div>); }
function Row({C,k,v,last}){ return (<div className="flex items-center justify-between py-1.5" style={{borderBottom:last?"none":`1px solid ${C.line}`}}><span style={{color:C.sub}}>{k}</span><span className="font-semibold" style={{fontVariantNumeric:"tabular-nums"}}>{v}</span></div>); }

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);