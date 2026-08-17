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
const CCY = { KRW:{color:ACCENT.krw, get unit(){return LANG==='en'?'\u20A9':'\uc6d0';}}, LKR:{unit:"Rs",color:ACCENT.lkr} };
const DONUT = ["#3B5BDB","#0CA678","#E8590C","#7048E8","#E67700","#1098AD","#F03E3E","#868E96"];
const JEWEL = { necklace:"\uD83D\uDCFF", ring:"\uD83D\uDC8D", bracelet:"\u231A", earring:"\uD83E\uDDF7", other:"\u2728" };

const T = {
 ko:{ money:"\ub3c8",assets:"\uc790\uc0b0",debts:"\ube5a",settings:"\uc124\uc815",spendable:"\uc4f8 \uc218 \uc788\ub294 \ub3c8 \u00b7 \uc6d0\ud654 \ud658\uc0b0",krwSum:"\uc6d0\ud654 \ud569\uacc4",lkrSum:"\ub8e8\ud53c \ud569\uacc4",rateEdit:"\ud658\uc728 \uc218\uc815",income:"\uc218\uc785",expense:"\uc9c0\ucd9c",left:"\ub0a8\uc740\ub3c8",thisMonth:"\uc774\ubc88 \ub2ec",accounts:"\uacc4\uc88c",recent:"\ucd5c\uadfc \ub0b4\uc5ed",noTxn:"\uc544\uc9c1 \ub0b4\uc5ed\uc774 \uc5c6\uc5b4\uc694. + \ub85c \uccab \uc9c0\ucd9c\uc744 \ub123\uc5b4\ubcf4\uc138\uc694.",overview:"\uc804\uccb4 \uc694\uc57d",oMoney:"\ub3c8 (\ud604\uae08\u00b7\uc740\ud589)",oAssets:"\uc790\uc0b0 (\ubd80\ub3d9\uc0b0\u00b7\uae08 \ub4f1)",oLent:"\ube4c\ub824\uc900 \ub3c8",oDebt:"\ube5a (\ub300\ucd9c\u00b7\ud560\ubd80)",netW:"\uc21c\uc790\uc0b0",totalValue:"\ud3c9\uac00\uc561 \ud569\uacc4",totalPL:"\ucd1d \uc190\uc775",addAsset:"+ \uc790\uc0b0 \ucd94\uac00",addDebt:"+ \ud56d\ubaa9 \ucd94\uac00",profit:"\uc774\uc775",loss:"\uc190\ud574",invested:"\ud22c\uc785",recovered:"\ud68c\uc218",nowValue:"\ud604\uc7ac \ud3c9\uac00\uc561",ret:"\uc190\uc775\ub960",realestate:"\ubd80\ub3d9\uc0b0",gold:"\uae08",fd:"\uc801\uae08(FD)",invest:"\ud22c\uc790",other:"\uae30\ud0c0",principal:"\uc6d0\uae08",rateY:"\uc5f0\uc774\uc790\uc728",startDate:"\uac00\uc785\uc77c",monthly:"\uc6d4\uc774\uc790",accrued:"\uc9c0\uae08\uae4c\uc9c0 \uc774\uc790",maturity:"\ub9cc\uae30\uc218\ub839(\uc6d0\uae08)",loan:"\ub300\ucd9c",installment:"\ud560\ubd80",lent:"\ube4c\ub824\uc900 \ub3c8",remain:"\ub0a8\uc740 \uae08\uc561",pay:"\uac1a\uae30",collect:"\ub3cc\ub824\ubc1b\uae30",done:"\uc644\ub8cc",darkmode:"\ub2e4\ud06c \ubaa8\ub4dc",language:"\uc5b8\uc5b4",exrate:"\ud658\uc728",goldPrice:"\uae08 \uc2dc\uc138 (24K 1g)",cats:"\uc9c0\ucd9c \ubd84\ub958",save:"\uc800\uc7a5",cancel:"\ucde8\uc18c",del:"\uc0ad\uc81c",name:"\uc774\ub984",currency:"\ud1b5\ud654",inflow:"\ub4e4\uc5b4\uc628 \ub3c8(\ud68c\uc218)",outflow:"\ub098\uac04 \ub3c8(\ud22c\uc785)",addFlow:"\ub3c8 \ud750\ub984 \ucd94\uac00",memo:"\uba54\ubaa8(\uc120\ud0dd)",amount:"\uae08\uc561",whichIn:"\uc5b4\ub290 \uacc4\uc88c\ub85c \ub4e4\uc5b4\uc640\uc694?",whichOut:"\uc5b4\ub290 \uacc4\uc88c\uc5d0\uc11c \ub098\uac00\uc694?",category:"\ubd84\ub958",jType:"\uc885\ub958",necklace:"\ubaa9\uac78\uc774",ring:"\ubc18\uc9c0",bracelet:"\ud314\ucc0c",earring:"\uadc0\uac78\uc774",purity:"\uc21c\ub3c4(K)",weight:"\ubb34\uac8c(g)",buyPrice:"\uad6c\uc785\uac00",buyGold:"\ub2f9\uc2dc \uae08\uc2dc\uc138(24K 1g)",pure:"\uc21c\uae08 \ubb34\uac8c",nowGold:"\ud604\uc7ac \uae08\uc2dc\uc138",install:"\ud648 \ud654\uba74\uc5d0 \uc124\uce58",loading:"\ubd88\ub7ec\uc624\ub294 \uc911\u2026",needKey:"\ub9c1\ud06c\ub85c \uc811\uc18d\ud574 \uc8fc\uc138\uc694 (?k=\u2026)",badKey:"\uc811\uc18d \ud0a4\uac00 \uc62c\ubc14\ub974\uc9c0 \uc54a\uc544\uc694" },
 en:{ money:"Money",assets:"Assets",debts:"Debts",settings:"Settings",spendable:"Spendable money \u00b7 in KRW",krwSum:"KRW total",lkrSum:"LKR total",rateEdit:"Edit rate",income:"Income",expense:"Expense",left:"Remaining",thisMonth:"This month",accounts:"Accounts",recent:"Recent",noTxn:"No records yet. Tap + to add your first expense.",overview:"Overview",oMoney:"Money (cash & bank)",oAssets:"Assets (property, gold\u2026)",oLent:"Lent out",oDebt:"Debt (loans)",netW:"Net worth",totalValue:"Total value",totalPL:"Total P/L",addAsset:"+ Add asset",addDebt:"+ Add item",profit:"Profit",loss:"Loss",invested:"Invested",recovered:"Recovered",nowValue:"Current value",ret:"Return",realestate:"Real estate",gold:"Gold",fd:"Fixed deposit",invest:"Investment",other:"Other",principal:"Principal",rateY:"Annual rate",startDate:"Start date",monthly:"Monthly interest",accrued:"Interest so far",maturity:"At maturity",loan:"Loan",installment:"Installment",lent:"Lent out",remain:"Remaining",pay:"Repay",collect:"Collect",done:"Done",darkmode:"Dark mode",language:"Language",exrate:"FX rate",goldPrice:"Gold price (24K/g)",cats:"Expense categories",save:"Save",cancel:"Cancel",del:"Delete",name:"Name",currency:"Currency",inflow:"Money in",outflow:"Money out",addFlow:"Add cash flow",memo:"Memo (optional)",amount:"Amount",whichIn:"Into which account?",whichOut:"From which account?",category:"Category",jType:"Type",necklace:"Necklace",ring:"Ring",bracelet:"Bracelet",earring:"Earring",purity:"Purity (K)",weight:"Weight (g)",buyPrice:"Purchase price",buyGold:"Gold price then (24K/g)",pure:"Pure gold",nowGold:"Gold price now",install:"Install to home screen",loading:"Loading\u2026",needKey:"Please open via your link (?k=\u2026)",badKey:"Access key is not valid" }
};

const fmt = (n)=> Math.round(Number(n)||0).toLocaleString("en-US");
const today = ()=> new Date().toISOString().slice(0,10);
const monthsBetween = (d)=>{ if(!d) return 0; const a=new Date(d), b=new Date(); return Math.max(0,(b.getFullYear()-a.getFullYear())*12+(b.getMonth()-a.getMonth())); };

function computePL(a, goldPrice){
  if(a.kind==="fd"){
    const monthly=(Number(a.principal)*(Number(a.rateY)/100))/12;
    const accrued=monthly*monthsBetween(a.startDate);
    return { invested:Number(a.principal), recovered:accrued, current:Number(a.principal)+accrued, pl:accrued, monthly, accrued };
  }
  if(a.kind==="gold"){
    const pure=Number(a.weight)*(Number(a.purity)/24);
    const price=(goldPrice&&goldPrice[a.currency])||0;
    const current=pure*price;
    return { invested:Number(a.buyPrice), recovered:0, current, pl:current-Number(a.buyPrice), pure, price };
  }
  const inn=(a.flows||[]).filter(f=>f.dir==="out").reduce((s,f)=>s+Number(f.amount),0);
  const out=(a.flows||[]).filter(f=>f.dir==="in").reduce((s,f)=>s+Number(f.amount),0);
  return { invested:inn, recovered:out, current:Number(a.nowValue)||0, pl:out+(Number(a.nowValue)||0)-inn };
}

function App(){
  const [status,setStatus]=useState("loading");
  const [dark_,setDark]=useState(false);
  const [lang,setLang]=useState("ko");
  const [user,setUser]=useState("");
  const [tab,setTab]=useState("money");
  const [rate,setRate]=useState(4.5);
  const [goldPrice,setGoldPrice]=useState({KRW:120000,LKR:35000});
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
      const withFlows = r.assets.map(a=>({ ...a,
        purity:Number(a.purity), weight:Number(a.weight), buyPrice:Number(a.buyPrice), buyGold:Number(a.buyGold),
        principal:Number(a.principal), rateY:Number(a.rateY), nowValue:Number(a.nowValue),
        flows:(r.flows||[]).filter(f=>String(f.assetId)===String(a.id)).map(f=>({dir:f.dir,amount:Number(f.amount),memo:f.memo}))
      }));
      setAssets(withFlows);
      setDebts(r.debts.map(d=>({...d, remain:Number(d.remain)})));
      setRate(r.settings.rate); setGoldPrice({KRW:r.settings.goldKRW,LKR:r.settings.goldLKR});
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
  const assetsKRW=assets.reduce((s,a)=>s+toKRW(computePL(a,goldPrice).current,a.currency),0);
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
          <div className="text-sm font-bold tracking-wide">MoneyBook \u00b7 {user}</div>
          <div className="flex items-center gap-2">
            {installEvt && <button onClick={()=>{installEvt.prompt(); setInstallEvt(null);}} className="text-xs px-2.5 py-1 rounded-full font-semibold text-white" style={{background:C.ink}}>{t("install")}</button>}
            <button onClick={()=>setDark(!dark_)} className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:C.chip}}>{dark_?"\u2600\uFE0F":"\uD83C\uDF19"}</button>
          </div>
        </div>

        {tab==="money" && <Money {...{C,t,lang,rate,setRate:(v)=>{setRate(v);saveSetting('rate',v);},moneyKRW,krwCash,lkrCash,accounts,balanceOf,txns,toKRW,assetsKRW,lentKRW,oweKRW,netWorth,onSetStart:(accountId,start)=>mut('setStart',{accountId,start}),onDelTxn:(id)=>mut('delTxn',{id})}} />}
        {tab==="assets" && <Assets {...{C,t,assets,goldPrice,toKRW,onAdd:()=>setModal("newAsset"),onOpen:(a)=>setModal({asset:a})}} />}
        {tab==="debts" && <Debts {...{C,t,debts,onAdd:()=>setModal("newDebt"),onOpen:(d)=>setModal({debt:d})}} />}
        {tab==="settings" && <Settings {...{C,t,lang,setLang:changeLang,dark_,setDark,rate,setRate:(v)=>{setRate(v);saveSetting('rate',v);},goldPrice,setGoldPrice:(g)=>{setGoldPrice(g);saveSetting('goldKRW',g.KRW);saveSetting('goldLKR',g.LKR);},cats}} />}
      </div>

      <div className="fixed bottom-0 left-0 right-0" style={{background:C.card,borderTop:`1px solid ${C.line}`}}>
        <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
          <Tab label={t("money")} icon="\uD83D\uDCB5" on={tab==="money"} C={C} onClick={()=>setTab("money")} />
          <Tab label={t("assets")} icon="\uD83D\uDCC8" on={tab==="assets"} C={C} onClick={()=>setTab("assets")} />
          <button onClick={()=>setModal("tx")} className="w-12 h-12 rounded-full text-white text-2xl flex items-center justify-center -mt-4 shadow-lg" style={{background:C.ink}}>+</button>
          <Tab label={t("debts")} icon="\uD83D\uDCB3" on={tab==="debts"} C={C} onClick={()=>setTab("debts")} />
          <Tab label={t("settings")} icon="\u2699\uFE0F" on={tab==="settings"} C={C} onClick={()=>setTab("settings")} />
        </div>
      </div>

      {modal==="tx" && <TxForm {...{C,t,lang,accounts,cats}} onClose={()=>setModal(null)} onSave={async(x)=>{ if(savingRef.current)return; const dup=txns.find(z=>String(z.date).slice(0,10)===x.date&&z.accountId===x.accountId&&Number(z.amount)===Number(x.amount)&&z.type===x.type&&z.category===x.category); if(dup){ const who=dup.user?` (${dup.user})`:''; const msg=lang==='en'?`A similar record already exists${who}. Add it anyway?`:`\uc774\ubbf8 \ube44\uc2b7\ud55c \ub0b4\uc5ed\uc774 \uc788\uc5b4\uc694${who}. \uadf8\ub798\ub3c4 \ucd94\uac00\ud560\uae4c\uc694?`; if(!confirm(msg))return; } savingRef.current=true; setModal(null); await mut('addTxn',x); savingRef.current=false; }} />}
      {modal==="newAsset" && <AssetForm {...{C,t}} onClose={()=>setModal(null)} onSave={async(a)=>{ setModal(null); await mut('addAsset',a); }} />}
      {modal&&modal.asset && <AssetDetail {...{C,t,asset:modal.asset,goldPrice}} onClose={()=>setModal(null)} onFlow={(assetId,f)=>mut('addFlow',{assetId,...f})} onNow={(id,nowValue)=>mut('updateAsset',{id,nowValue})} onDel={async(id)=>{ setModal(null); await mut('delAsset',{id}); }} />}
      {modal==="newDebt" && <DebtForm {...{C,t}} onClose={()=>setModal(null)} onSave={async(d)=>{ setModal(null); await mut('addDebt',d); }} />}
      {modal&&modal.debt && <DebtDetail {...{C,t,lang,debt:modal.debt,accounts}} onClose={()=>setModal(null)} onPay={(debtId,pl)=>mut('payDebt',{debtId,...pl})} onDel={async(id)=>{ setModal(null); await mut('delDebt',{id}); }} />}
    </div>
  );
}

function Money({C,t,lang,rate,setRate,moneyKRW,krwCash,lkrCash,accounts,balanceOf,txns,toKRW,assetsKRW,lentKRW,oweKRW,netWorth,onSetStart,onDelTxn}){
  const [editRate,setEditRate]=useState(false);
  const [editAcc,setEditAcc]=useState(null);
  const ym=today().slice(0,7);
  const mtx=txns.filter(x=>x.date && String(x.date).slice(0,7)===ym);
  const accById=(id)=>accounts.find(a=>a.id===id)||{currency:"KRW",ko:"",en:""};
  const inc=mtx.filter(x=>x.type==="income").reduce((s,x)=>s+toKRW(x.amount,accById(x.accountId).currency),0);
  const exp=mtx.filter(x=>x.type==="expense").reduce((s,x)=>s+toKRW(x.amount,accById(x.accountId).currency),0);
  const byCat={}; mtx.filter(x=>x.type==="expense").forEach(x=>{ byCat[x.category]=(byCat[x.category]||0)+toKRW(x.amount,accById(x.accountId).currency); });
  const dData=Object.entries(byCat).map(([k,v],i)=>({k,v,color:DONUT[i%DONUT.length]}));
  const dTot=dData.reduce((s,d)=>s+d.v,0); let acc=0;
  const seg=dData.map(d=>{const a=(acc/dTot)*360;acc+=d.v;const b=(acc/dTot)*360;return `${d.color} ${a}deg ${b}deg`;}).join(", ");

  return (<>
    <div className="rounded-3xl p-5 mb-4" style={{background:`linear-gradient(150deg, ${C.hero1}, ${C.hero2})`,color:"#fff"}}>
      <div className="flex items-center justify-between"><span className="tracking-widest opacity-70" style={{fontSize:11}}>{t("spendable")}</span></div>
      <div className="mt-2 flex items-end gap-1" style={{fontVariantNumeric:"tabular-nums"}}><span className="text-4xl font-bold tracking-tight">{fmt(moneyKRW)}</span><span className="text-lg mb-0.5 opacity-80">{CCY.KRW.unit}</span></div>
      <div className="mt-4 grid grid-cols-2 gap-2"><Rail label={t("krwSum")} value={`${fmt(krwCash)}${CCY.KRW.unit}`} dot={ACCENT.krw}/><Rail label={t("lkrSum")} value={`${fmt(lkrCash)} Rs`} dot={ACCENT.lkr}/></div>
      <div className="mt-3 opacity-80" style={{fontSize:12}}>{editRate?(<span className="inline-flex items-center gap-1">1 Rs = <input autoFocus type="number" defaultValue={rate} onBlur={(e)=>{setRate(parseFloat(e.target.value)||0);setEditRate(false);}} className="w-16 px-1 rounded text-black text-center"/>{CCY.KRW.unit}</span>):(<button onClick={()=>setEditRate(true)} className="underline underline-offset-2">1 Rs = {rate}{CCY.KRW.unit} \u00b7 {t("rateEdit")}</button>)}</div>
    </div>

    <div className="rounded-2xl p-4 mb-4 grid grid-cols-3" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <Stat label={t("income")} value={inc} color={ACCENT.income} C={C}/><Stat label={t("expense")} value={exp} color={ACCENT.expense} C={C} border/><Stat label={t("left")} value={inc-exp} color={C.ink} C={C}/>
    </div>

    {dTot>0 && <div className="rounded-2xl p-4 mb-4 flex items-center gap-4" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <div className="relative" style={{width:96,height:96}}><div className="rounded-full w-full h-full" style={{background:`conic-gradient(${seg})`}}/><div className="absolute rounded-full flex items-center justify-center" style={{inset:14,background:C.card}}><span style={{fontSize:11,color:C.sub}}>{t("thisMonth")}</span></div></div>
      <div className="flex-1 space-y-1">{dData.slice().sort((a,b)=>b.v-a.v).slice(0,5).map(d=>(<div key={d.k} className="flex items-center gap-2" style={{fontSize:12}}><span className="w-2.5 h-2.5 rounded-full" style={{background:d.color}}/><span className="flex-1">{d.k}</span><span style={{color:C.sub,fontVariantNumeric:"tabular-nums"}}>{Math.round((d.v/dTot)*100)}%</span></div>))}</div>
    </div>}

    <SectionLabel C={C}>{t("accounts")}</SectionLabel>
    <div className="space-y-2 mb-4">{accounts.map(a=>{ const cur=CCY[a.currency]; const bal=balanceOf(a.id); return (
      <div key={a.id} className="rounded-2xl p-3.5" style={{background:C.card,border:`1px solid ${C.line}`}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="font-bold px-1.5 py-0.5 rounded" style={{fontSize:10,background:cur.color+"1A",color:cur.color}}>{a.currency}</span><span className="text-sm font-medium">{a[lang]}</span></div>
          <div className="flex items-center gap-2"><span className="text-lg font-bold" style={{fontVariantNumeric:"tabular-nums"}}>{fmt(bal)}<span className="text-xs font-normal ml-0.5" style={{color:C.sub}}>{cur.unit}</span></span><button onClick={()=>setEditAcc(editAcc===a.id?null:a.id)} style={{fontSize:11,color:C.sub}}>\u270E</button></div>
        </div>
        {editAcc===a.id && <div className="mt-2 flex items-center gap-2"><input type="number" defaultValue={a.start} className="flex-1 min-w-0 px-2 py-1.5 rounded-lg text-sm" style={{border:`1px solid ${C.line}`,background:C.soft,color:C.ink}} onBlur={(e)=>{ onSetStart(a.id, parseFloat(e.target.value)||0); }} /><button onClick={()=>setEditAcc(null)} className="px-3 py-1.5 rounded-lg text-sm text-white" style={{background:C.ink}}>OK</button></div>}
      </div>);})}</div>

    <SectionLabel C={C}>{t("recent")}</SectionLabel>
    {txns.length===0 ? <div className="rounded-2xl p-6 text-center text-sm mb-4" style={{background:C.card,border:`1px dashed ${C.line}`,color:C.sub}}>{t("noTxn")}</div>
     : <div className="space-y-1.5 mb-4">{txns.slice(0,15).map(x=>{ const a=accById(x.accountId); const cur=CCY[a.currency]; const pos=x.type==="income"; return (
        <div key={x.id} className="rounded-xl px-3 py-2.5 flex items-center gap-3" style={{background:C.card,border:`1px solid ${C.line}`}}>
          <div className="flex-1 min-w-0"><div className="text-sm font-medium truncate">{x.category}{x.memo?` \u00b7 ${x.memo}`:""}</div><div style={{fontSize:11,color:C.sub}}>{String(x.date).slice(0,10)} \u00b7 {a[lang]}</div></div>
          <div className="text-sm font-semibold whitespace-nowrap" style={{color:pos?ACCENT.income:ACCENT.expense,fontVariantNumeric:"tabular-nums"}}>{pos?"+":"\u2212"}{fmt(x.amount)}{cur.unit}</div>
          <button onClick={()=>onDelTxn(x.id)} className="text-lg leading-none px-1" style={{color:C.line}}>\u00d7</button>
        </div>);})}</div>}

    <SectionLabel C={C}>{t("overview")}</SectionLabel>
    <div className="rounded-2xl p-4" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <OverRow C={C} k={t("oMoney")} v={moneyKRW} dot={ACCENT.krw}/>
      <OverRow C={C} k={t("oAssets")} v={assetsKRW} dot={ACCENT.gold}/>
      {lentKRW>0 && <OverRow C={C} k={t("oLent")} v={lentKRW} dot={ACCENT.income}/>}
      {oweKRW>0 && <OverRow C={C} k={t("oDebt")} v={-oweKRW} dot={ACCENT.expense}/>}
      <div className="flex items-center justify-between pt-3 mt-1" style={{borderTop:`1px solid ${C.line}`}}><span className="text-sm font-bold">{t("netW")}</span><span className="text-xl font-bold" style={{fontVariantNumeric:"tabular-nums"}}>{fmt(netWorth)}{CCY.KRW.unit}</span></div>
    </div>
  </>);
}

function Assets({C,t,assets,goldPrice,toKRW,onAdd,onOpen}){
  const order=["realestate","gold","fd","invest","other"];
  const totalValue=assets.reduce((s,a)=>s+toKRW(computePL(a,goldPrice).current,a.currency),0);
  const totalPL=assets.reduce((s,a)=>s+toKRW(computePL(a,goldPrice).pl,a.currency),0);
  const good=totalPL>=0;
  return (<>
    <div className="flex items-center justify-between mb-3"><SectionLabel C={C} nomb>{t("assets")}</SectionLabel><button onClick={onAdd} className="text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{background:C.ink}}>{t("addAsset")}</button></div>
    <div className="rounded-2xl p-4 mb-4 flex items-center justify-between" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <div><div style={{fontSize:11,color:C.sub}}>{t("totalValue")}</div><div className="text-xl font-bold" style={{fontVariantNumeric:"tabular-nums"}}>{fmt(totalValue)}{CCY.KRW.unit}</div></div>
      <div className="text-right"><div style={{fontSize:11,color:C.sub}}>{t("totalPL")}</div><div className="text-xl font-bold" style={{color:good?ACCENT.good:ACCENT.bad,fontVariantNumeric:"tabular-nums"}}>{good?"+":"\u2212"}{fmt(Math.abs(totalPL))}{CCY.KRW.unit}</div></div>
    </div>
    {order.map(kind=>{ const items=assets.filter(a=>a.kind===kind); if(!items.length) return null; return (
      <div key={kind} className="mb-4"><div style={{fontSize:12,fontWeight:600,color:C.sub}} className="mb-2">{t(kind)}</div><div className="space-y-3">
        {items.map(a=>{ const p=computePL(a,goldPrice); const cur=CCY[a.currency]; const pct=p.invested>0?(p.pl/p.invested)*100:0; const g=p.pl>=0; return (
          <button key={a.id} onClick={()=>onOpen(a)} className="w-full text-left rounded-2xl p-4" style={{background:C.card,border:`1px solid ${C.line}`}}>
            <div className="flex items-center gap-2">{a.kind==="gold"&&<span>{JEWEL[a.jType]||"\u2728"}</span>}<span className="font-bold px-1.5 py-0.5 rounded" style={{fontSize:10,background:cur.color+"1A",color:cur.color}}>{a.currency}</span><span className="text-sm font-semibold">{a.name}</span>{a.kind==="gold"&&<span style={{fontSize:11,color:C.sub}}>{a.purity}K \u00b7 {a.weight}g</span>}</div>
            <div className="mt-3 rounded-xl p-3" style={{background:(g?ACCENT.good:ACCENT.bad)+"12"}}>
              <div className="flex items-center justify-between"><span className="text-xs font-semibold" style={{color:g?ACCENT.good:ACCENT.bad}}>{g?t("profit"):t("loss")}</span><span style={{fontSize:11,color:C.sub}}>{t("ret")} {pct>=0?"+":""}{pct.toFixed(1)}%</span></div>
              <div className="text-2xl font-bold mt-0.5" style={{color:g?ACCENT.good:ACCENT.bad,fontVariantNumeric:"tabular-nums"}}>{g?"+":"\u2212"}{fmt(Math.abs(p.pl))}<span className="text-sm font-normal ml-0.5">{cur.unit}</span></div>
            </div>
            <div className="mt-3 grid grid-cols-3 text-center" style={{fontSize:11}}>
              <MiniStat label={a.kind==="fd"?t("principal"):t("buyPrice")} value={fmt(p.invested)} C={C}/>
              <MiniStat label={a.kind==="fd"?t("accrued"):t("recovered")} value={fmt(a.kind==="fd"?p.accrued:p.recovered)} C={C}/>
              <MiniStat label={a.kind==="fd"?t("maturity"):t("nowValue")} value={fmt(a.kind==="fd"?a.principal:p.current)} C={C}/>
            </div>
          </button>);})}
      </div></div>);})}
  </>);
}

function AssetDetail({C,t,asset,goldPrice,onFlow,onNow,onDel,onClose}){
  const [a,setA]=useState(asset);
  const cur=CCY[a.currency]; const p=computePL(a,goldPrice);
  const [dir,setDir]=useState("out"); const [amt,setAmt]=useState(""); const [memo,setMemo]=useState("");
  const addFlow=()=>{ if(!(parseFloat(amt)>0))return; const f={dir,amount:parseFloat(amt),memo}; setA({...a,flows:[...(a.flows||[]),f]}); onFlow(a.id,f); setAmt("");setMemo(""); };
  const setNow=(v)=>{ setA({...a,nowValue:v}); onNow(a.id,v); };
  return (<Sheet C={C} onClose={onClose}>
    <div className="flex items-center justify-between mb-3"><span className="text-base font-bold">{a.kind==="gold"?`${JEWEL[a.jType]||"\u2728"} `:""}{a.name}</span><button onClick={()=>onDel(a.id)} className="text-xs" style={{color:ACCENT.bad}}>{t("del")}</button></div>
    {a.kind==="gold" && <div className="rounded-xl p-3 mb-3 text-sm" style={{background:C.soft}}>
      <Row C={C} k={t("purity")} v={`${a.purity}K`}/><Row C={C} k={t("weight")} v={`${a.weight} g`}/><Row C={C} k={t("pure")} v={`${p.pure.toFixed(1)} g`}/>
      <Row C={C} k={t("buyPrice")} v={`${fmt(a.buyPrice)}${cur.unit}`}/><Row C={C} k={t("buyGold")} v={`${fmt(a.buyGold)}${cur.unit}`}/>
      <Row C={C} k={t("nowGold")} v={`${fmt(p.price)}${cur.unit} (${a.buyGold>0?(p.price>=a.buyGold?"+":"")+Math.round((p.price/a.buyGold-1)*100):0}%)`}/>
      <Row C={C} k={t("nowValue")} v={`${fmt(p.current)}${cur.unit}`} last/>
    </div>}
    {a.kind==="fd" && <div className="rounded-xl p-3 mb-3 text-sm" style={{background:C.soft}}>
      <Row C={C} k={t("principal")} v={`${fmt(a.principal)}${cur.unit}`}/><Row C={C} k={t("rateY")} v={`${a.rateY}%`}/><Row C={C} k={t("monthly")} v={`${fmt(p.monthly)}${cur.unit}`}/><Row C={C} k={t("accrued")} v={`${fmt(p.accrued)}${cur.unit}`} last/>
    </div>}
    {(a.kind==="realestate"||a.kind==="invest"||a.kind==="other") && <>
      <div className="mb-3"><div style={{fontSize:12,color:C.sub}} className="mb-1">{t("nowValue")}</div><div className="flex items-center gap-2"><input type="number" defaultValue={a.nowValue} onBlur={(e)=>setNow(parseFloat(e.target.value)||0)} className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/><span className="text-sm" style={{color:C.sub}}>{cur.unit}</span></div></div>
      <div className="rounded-xl p-3 mb-3" style={{background:C.soft}}>
        <div className="grid grid-cols-2 gap-2 mb-2">{[["out",t("outflow")],["in",t("inflow")]].map(([dd,lbl])=>(<button key={dd} onClick={()=>setDir(dd)} className="py-2 rounded-lg text-xs font-semibold" style={{background:dir===dd?(dd==="out"?ACCENT.expense:ACCENT.income):C.chip,color:dir===dd?"#fff":C.sub}}>{lbl}</button>))}</div>
        <div className="flex gap-2"><input type="number" value={amt} onChange={(e)=>setAmt(e.target.value)} placeholder={t("amount")} className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm" style={{background:C.card,color:C.ink,border:`1px solid ${C.line}`}}/><input value={memo} onChange={(e)=>setMemo(e.target.value)} placeholder={t("memo")} className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm" style={{background:C.card,color:C.ink,border:`1px solid ${C.line}`}}/></div>
        <button onClick={addFlow} className="w-full mt-2 py-2 rounded-lg text-sm font-semibold text-white" style={{background:C.ink}}>{t("addFlow")}</button>
      </div>
      <div className="space-y-1">{(a.flows||[]).map((f,i)=>(<div key={i} className="flex items-center justify-between text-sm px-1"><span style={{color:C.sub}}>{f.dir==="out"?t("invested"):t("recovered")}{f.memo?` \u00b7 ${f.memo}`:""}</span><span style={{color:f.dir==="out"?ACCENT.expense:ACCENT.income,fontVariantNumeric:"tabular-nums"}}>{f.dir==="out"?"\u2212":"+"}{fmt(f.amount)}{cur.unit}</span></div>))}</div>
    </>}
    <div className="rounded-xl p-3 mt-3 flex items-center justify-between" style={{background:(p.pl>=0?ACCENT.good:ACCENT.bad)+"12"}}><span className="text-sm font-semibold" style={{color:p.pl>=0?ACCENT.good:ACCENT.bad}}>{p.pl>=0?t("profit"):t("loss")}</span><span className="text-lg font-bold" style={{color:p.pl>=0?ACCENT.good:ACCENT.bad,fontVariantNumeric:"tabular-nums"}}>{p.pl>=0?"+":"\u2212"}{fmt(Math.abs(p.pl))}{cur.unit}</span></div>
  </Sheet>);
}

function Debts({C,t,debts,onAdd,onOpen}){
  const label={loan:t("loan"),installment:t("installment"),lent:t("lent")};
  return (<>
    <div className="flex items-center justify-between mb-3"><SectionLabel C={C} nomb>{t("debts")}</SectionLabel><button onClick={onAdd} className="text-xs font-semibold px-3 py-1.5 rounded-full text-white" style={{background:C.ink}}>{t("addDebt")}</button></div>
    {debts.length===0? <div className="rounded-2xl p-6 text-center text-sm" style={{background:C.card,border:`1px dashed ${C.line}`,color:C.sub}}>\u2014</div>
     : <div className="space-y-2">{debts.map(d=>{ const cur=CCY[d.currency]; const lent=d.kind==="lent"; const done=Number(d.remain)<=0; return (
        <button key={d.id} onClick={()=>onOpen(d)} className="w-full text-left rounded-2xl p-4 flex items-center justify-between" style={{background:C.card,border:`1px solid ${C.line}`}}>
          <div><div className="text-sm font-semibold">{d.name}</div><div style={{fontSize:11,color:done?ACCENT.good:C.sub}}>{label[d.kind]}{done?` \u00b7 \u2713 ${t("done")}`:""}</div></div>
          <div className="text-lg font-bold" style={{color:done?C.sub:(lent?ACCENT.income:ACCENT.expense),fontVariantNumeric:"tabular-nums"}}>{lent?"+":"\u2212"}{fmt(d.remain)}<span className="text-xs font-normal ml-0.5" style={{color:C.sub}}>{cur.unit}</span></div>
        </button>);})}</div>}
  </>);
}

function DebtDetail({C,t,lang,debt,accounts,onPay,onDel,onClose}){
  const [d,setD]=useState(debt);
  const isLent=d.kind==="lent";
  const cur=CCY[d.currency];
  const accts=accounts.filter(a=>a.currency===d.currency);
  const [amt,setAmt]=useState("");
  const [accountId,setAccountId]=useState(accts[0]?accts[0].id:"");
  const [sent,setSent]=useState(false);
  const done=Number(d.remain)<=0;
  const act=isLent?t("collect"):t("pay");
  const label={loan:t("loan"),installment:t("installment"),lent:t("lent")};
  const submit=()=>{
    if(sent||!(parseFloat(amt)>0)||!accountId)return; setSent(true);
    setD({...d,remain:Math.max(0,Number(d.remain)-parseFloat(amt))});
    onPay(d.id,{amount:parseFloat(amt),accountId,kind:d.kind,category:d.name,memo:act,date:today()});
    setTimeout(onClose,300);
  };
  return (<Sheet C={C} onClose={onClose}>
    <div className="flex items-center justify-between mb-3"><span className="text-base font-bold">{d.name}</span><button onClick={()=>onDel(d.id)} className="text-xs" style={{color:ACCENT.bad}}>{t("del")}</button></div>
    <div className="rounded-2xl p-4 mb-3 text-center" style={{background:C.soft}}>
      <div style={{fontSize:11,color:C.sub}}>{label[d.kind]} \u00b7 {t("remain")}</div>
      <div className="text-2xl font-bold mt-0.5" style={{color:done?ACCENT.good:(isLent?ACCENT.income:ACCENT.expense),fontVariantNumeric:"tabular-nums"}}>{fmt(d.remain)}{cur.unit}</div>
      {done && <div className="text-xs font-semibold mt-1" style={{color:ACCENT.good}}>\u2713 {t("done")}</div>}
    </div>
    {!done && <>
      <div className="rounded-2xl px-4 py-3 mb-3 flex items-end gap-2" style={{background:C.soft}}><input autoFocus type="number" inputMode="numeric" value={amt} onChange={(e)=>setAmt(e.target.value)} placeholder="0" className="flex-1 min-w-0 bg-transparent text-3xl font-bold outline-none" style={{color:C.ink,fontVariantNumeric:"tabular-nums"}}/><span className="text-lg mb-1" style={{color:C.sub}}>{cur.unit}</span></div>
      <div className="mb-3"><div style={{fontSize:12,color:C.sub}} className="mb-1.5">{isLent?t("whichIn"):t("whichOut")}</div><div className="grid grid-cols-2 gap-1.5">{accts.map(a=>{const on=a.id===accountId;return(<button key={a.id} onClick={()=>setAccountId(a.id)} className="py-2 rounded-lg text-xs font-medium text-left px-2.5" style={{background:on?C.ink:C.chip,color:on?"#fff":C.ink}}>{a[lang]}</button>);})}</div></div>
      <button onClick={submit} disabled={!(parseFloat(amt)>0)||sent} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{background:(parseFloat(amt)>0&&!sent)?C.ink:"#B9C6C2"}}>{act}</button>
    </>}
  </Sheet>);
}

function Settings({C,t,lang,setLang,dark_,setDark,rate,setRate,goldPrice,setGoldPrice,cats}){
  return (<>
    <SectionLabel C={C}>{t("settings")}</SectionLabel>
    <div className="rounded-2xl overflow-hidden mb-4" style={{background:C.card,border:`1px solid ${C.line}`}}>
      <SettingRow C={C} label={t("darkmode")}><Toggle on={dark_} onClick={()=>setDark(!dark_)} C={C}/></SettingRow>
      <SettingRow C={C} label={t("language")}><div className="flex gap-1">{["ko","en"].map(l=>(<button key={l} onClick={()=>setLang(l)} className="px-3 py-1 rounded-full text-xs font-semibold" style={{background:lang===l?C.ink:C.chip,color:lang===l?"#fff":C.sub}}>{l==="ko"?"\ud55c\uad6d\uc5b4":"EN"}</button>))}</div></SettingRow>
      <SettingRow C={C} label={t("exrate")}><span className="inline-flex items-center gap-1 text-sm">1 Rs = <input type="number" defaultValue={rate} onBlur={(e)=>setRate(parseFloat(e.target.value)||0)} className="w-14 px-1 rounded text-center" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/>{CCY.KRW.unit}</span></SettingRow>
      <SettingRow C={C} label={`${t("goldPrice")} \u00b7 ${CCY.KRW.unit}`}><input type="number" defaultValue={goldPrice.KRW} onBlur={(e)=>setGoldPrice({...goldPrice,KRW:parseFloat(e.target.value)||0})} className="w-24 px-2 py-1 rounded text-sm text-right" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></SettingRow>
      <SettingRow C={C} label={`${t("goldPrice")} \u00b7 Rs`} last><input type="number" defaultValue={goldPrice.LKR} onBlur={(e)=>setGoldPrice({...goldPrice,LKR:parseFloat(e.target.value)||0})} className="w-24 px-2 py-1 rounded text-sm text-right" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></SettingRow>
    </div>
    <SectionLabel C={C}>{t("cats")}</SectionLabel>
    <div className="rounded-2xl p-4" style={{background:C.card,border:`1px solid ${C.line}`}}><div className="flex flex-wrap gap-1.5">{(cats.expense||[]).map((c,i)=>(<span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{background:C.chip,color:C.ink}}>{c[lang]}</span>))}</div></div>
  </>);
}

function TxForm({C,t,lang,accounts,cats,onSave,onClose}){
  const [type,setType]=useState("expense"); const [accountId,setAccountId]=useState(accounts[0]?accounts[0].id:"");
  const [amount,setAmount]=useState(""); const [category,setCategory]=useState(""); const [memo,setMemo]=useState(""); const [date,setDate]=useState(today());
  const acc=accounts.find(a=>a.id===accountId)||accounts[0]||{currency:"KRW"}; const cur=CCY[acc.currency]; const list=cats[type]||[]; const valid=parseFloat(amount)>0&&category;
  return (<Sheet C={C} onClose={onClose}>
    <div className="grid grid-cols-2 gap-2 mb-4">{[["expense",t("expense")],["income",t("income")]].map(([tp,lbl])=>{const on=type===tp;const col=tp==="income"?ACCENT.income:ACCENT.expense;return(<button key={tp} onClick={()=>{setType(tp);setCategory("");}} className="py-2.5 rounded-xl text-sm font-semibold" style={{background:on?col:C.chip,color:on?"#fff":C.sub}}>{lbl}</button>);})}</div>
    <div className="rounded-2xl px-4 py-3 mb-3 flex items-end gap-2" style={{background:C.soft}}><input autoFocus type="number" inputMode="numeric" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="0" className="flex-1 min-w-0 bg-transparent text-3xl font-bold outline-none" style={{color:C.ink,fontVariantNumeric:"tabular-nums"}}/><span className="text-lg mb-1" style={{color:C.sub}}>{cur.unit}</span></div>
    <div className="mb-3"><div style={{fontSize:12,color:C.sub}} className="mb-1.5">{type==="income"?t("whichIn"):t("whichOut")}</div><div className="grid grid-cols-2 gap-1.5">{accounts.map(a=>{const on=a.id===accountId;return(<button key={a.id} onClick={()=>setAccountId(a.id)} className="py-2 rounded-lg text-xs font-medium text-left px-2.5" style={{background:on?C.ink:C.chip,color:on?"#fff":C.ink}}>{a[lang]}</button>);})}</div></div>
    <div className="mb-3"><div style={{fontSize:12,color:C.sub}} className="mb-1.5">{t("category")}</div><div className="flex flex-wrap gap-1.5">{list.map((c,i)=>{const on=c[lang]===category;return(<button key={i} onClick={()=>setCategory(c[lang])} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{background:on?C.ink:C.chip,color:on?"#fff":C.sub}}>{c[lang]}</button>);})}</div></div>
    <div className="flex gap-2 mb-4"><input value={memo} onChange={(e)=>setMemo(e.target.value)} placeholder={t("memo")} className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm outline-none" style={{background:C.soft,color:C.ink}}/><input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{background:C.soft,color:C.ink}}/></div>
    <div className="flex gap-2"><button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-semibold" style={{background:C.chip,color:C.sub}}>{t("cancel")}</button><button onClick={()=>valid&&onSave({type,accountId,amount:parseFloat(amount),category,memo,date})} disabled={!valid} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{background:valid?C.ink:"#B9C6C2"}}>{t("save")}</button></div>
  </Sheet>);
}

function AssetForm({C,t,onSave,onClose}){
  const [kind,setKind]=useState("realestate"); const [name,setName]=useState(""); const [currency,setCurrency]=useState("KRW");
  const [principal,setPrincipal]=useState(""); const [rateY,setRateY]=useState(""); const [startDate,setStartDate]=useState(today()); const [nowValue,setNowValue]=useState("");
  const [jType,setJType]=useState("necklace"); const [purity,setPurity]=useState(24); const [weight,setWeight]=useState(""); const [buyPrice,setBuyPrice]=useState(""); const [buyGold,setBuyGold]=useState("");
  const isFD=kind==="fd"; const isGold=kind==="gold";
  const valid=name&&(isFD?parseFloat(principal)>0:isGold?parseFloat(weight)>0&&parseFloat(buyPrice)>0:true);
  const save=()=>{ if(!valid)return;
    if(isFD) onSave({kind,name,currency,principal:+principal,rateY:+rateY,startDate});
    else if(isGold) onSave({kind,name,currency,jType,purity:+purity,weight:+weight,buyPrice:+buyPrice,buyGold:+buyGold||0});
    else onSave({kind,name,currency,nowValue:+nowValue||0}); };
  const kinds=[["realestate",t("realestate")],["gold",t("gold")],["fd",t("fd")],["invest",t("invest")],["other",t("other")]];
  const jtypes=[["necklace",t("necklace")],["ring",t("ring")],["bracelet",t("bracelet")],["earring",t("earring")],["other",t("other")]];
  return (<Sheet C={C} onClose={onClose}>
    <div className="text-base font-bold mb-3">{t("addAsset")}</div>
    <div className="grid grid-cols-3 gap-1.5 mb-3">{kinds.map(([k,lbl])=>(<button key={k} onClick={()=>setKind(k)} className="py-2 rounded-lg font-medium" style={{fontSize:11,background:kind===k?C.ink:C.chip,color:kind===k?"#fff":C.sub}}>{lbl}</button>))}</div>
    <Field C={C} label={t("name")}><input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
    <Field C={C} label={t("currency")}><div className="flex gap-1.5">{["KRW","LKR"].map(c=>(<button key={c} onClick={()=>setCurrency(c)} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{background:currency===c?CCY[c].color:C.chip,color:currency===c?"#fff":C.sub}}>{c}</button>))}</div></Field>
    {isGold && <>
      <Field C={C} label={t("jType")}><div className="flex flex-wrap gap-1.5">{jtypes.map(([k,lbl])=>(<button key={k} onClick={()=>setJType(k)} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{background:jType===k?C.ink:C.chip,color:jType===k?"#fff":C.sub}}>{JEWEL[k]} {lbl}</button>))}</div></Field>
      <Field C={C} label={t("purity")}><div className="flex gap-1.5">{[24,22,18,14].map(k=>(<button key={k} onClick={()=>setPurity(k)} className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{background:purity===k?C.ink:C.chip,color:purity===k?"#fff":C.sub}}>{k}K</button>))}</div></Field>
      <div className="grid grid-cols-2 gap-2"><Field C={C} label={t("weight")}><input type="number" value={weight} onChange={(e)=>setWeight(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field><Field C={C} label={t("buyPrice")}><input type="number" value={buyPrice} onChange={(e)=>setBuyPrice(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field></div>
      <Field C={C} label={t("buyGold")}><input type="number" value={buyGold} onChange={(e)=>setBuyGold(e.target.value)} placeholder="0" className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
    </>}
    {isFD && <>
      <Field C={C} label={t("principal")}><input type="number" value={principal} onChange={(e)=>setPrincipal(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
      <Field C={C} label={t("rateY")+" (%)"}><input type="number" value={rateY} onChange={(e)=>setRateY(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
      <Field C={C} label={t("startDate")}><input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
    </>}
    {(kind==="realestate"||kind==="invest"||kind==="other") && <Field C={C} label={t("nowValue")}><input type="number" value={nowValue} onChange={(e)=>setNowValue(e.target.value)} placeholder="0" className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>}
    <div className="flex gap-2 mt-4"><button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-semibold" style={{background:C.chip,color:C.sub}}>{t("cancel")}</button><button onClick={save} disabled={!valid} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{background:valid?C.ink:"#B9C6C2"}}>{t("save")}</button></div>
  </Sheet>);
}

function DebtForm({C,t,onSave,onClose}){
  const [kind,setKind]=useState("loan"); const [name,setName]=useState(""); const [currency,setCurrency]=useState("KRW"); const [remain,setRemain]=useState("");
  const valid=name&&parseFloat(remain)>0; const kinds=[["loan",t("loan")],["installment",t("installment")],["lent",t("lent")]];
  return (<Sheet C={C} onClose={onClose}>
    <div className="text-base font-bold mb-3">{t("addDebt")}</div>
    <div className="grid grid-cols-3 gap-1.5 mb-3">{kinds.map(([k,lbl])=>(<button key={k} onClick={()=>setKind(k)} className="py-2 rounded-lg font-medium" style={{fontSize:11,background:kind===k?C.ink:C.chip,color:kind===k?"#fff":C.sub}}>{lbl}</button>))}</div>
    <Field C={C} label={t("name")}><input value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
    <Field C={C} label={t("currency")}><div className="flex gap-1.5">{["KRW","LKR"].map(c=>(<button key={c} onClick={()=>setCurrency(c)} className="px-4 py-1.5 rounded-lg text-xs font-semibold" style={{background:currency===c?CCY[c].color:C.chip,color:currency===c?"#fff":C.sub}}>{c}</button>))}</div></Field>
    <Field C={C} label={t("remain")}><input type="number" value={remain} onChange={(e)=>setRemain(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{background:C.soft,color:C.ink,border:`1px solid ${C.line}`}}/></Field>
    <div className="flex gap-2 mt-4"><button onClick={onClose} className="px-5 py-3 rounded-xl text-sm font-semibold" style={{background:C.chip,color:C.sub}}>{t("cancel")}</button><button onClick={()=>valid&&onSave({kind,name,currency,remain:+remain})} disabled={!valid} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{background:valid?C.ink:"#B9C6C2"}}>{t("save")}</button></div>
  </Sheet>);
}

function Sheet({C,children,onClose}){ return (<div className="fixed inset-0 z-50 flex flex-col justify-end items-center" style={{background:"rgba(0,0,0,.4)"}} onClick={onClose}><div className="w-full max-w-md rounded-t-3xl p-5 pb-8 overflow-y-auto" style={{background:C.card,color:C.ink,maxHeight:"90vh",fontFamily:"'Apple SD Gothic Neo','Noto Sans KR',sans-serif"}} onClick={(e)=>e.stopPropagation()}><div className="w-10 h-1 rounded-full mx-auto mb-4" style={{background:C.line}}/>{children}</div></div>); }
function Center({C,children}){ return (<div style={{background:C.bg,minHeight:"100vh",color:C.sub}} className="flex items-center justify-center text-sm px-6 text-center">{children}</div>); }
function Tab({label,icon,on,onClick,C}){ return (<button onClick={onClick} className="flex flex-col items-center gap-0.5 w-14"><span style={{fontSize:18,opacity:on?1:0.5}}>{icon}</span><span style={{fontSize:10,color:on?C.ink:C.sub,fontWeight:on?700:400}}>{label}</span></button>); }
function Rail({label,value,dot}){ return (<div className="rounded-xl px-3 py-2" style={{background:"rgba(255,255,255,.1)"}}><div className="flex items-center gap-1.5 opacity-80" style={{fontSize:11}}><span className="w-2 h-2 rounded-full" style={{background:dot}}/>{label}</div><div className="text-sm font-semibold mt-0.5" style={{fontVariantNumeric:"tabular-nums"}}>{value}</div></div>); }
function Stat({label,value,color,C,border}){ return (<div className="text-center" style={{borderLeft:border?`1px solid ${C.line}`:"none",borderRight:border?`1px solid ${C.line}`:"none"}}><div style={{fontSize:11,color:C.sub}}>{label}</div><div className="text-base font-bold mt-0.5" style={{color,fontVariantNumeric:"tabular-nums"}}>{fmt(value)}</div></div>); }
function MiniStat({label,value,C}){ return (<div><div style={{color:C.sub}}>{label}</div><div className="font-semibold mt-0.5" style={{color:C.ink,fontVariantNumeric:"tabular-nums"}}>{value}</div></div>); }
function OverRow({C,k,v,dot}){ const neg=v<0; return (<div className="flex items-center justify-between py-1.5"><span className="flex items-center gap-2 text-sm" style={{color:C.sub}}><span className="w-2 h-2 rounded-full" style={{background:dot}}/>{k}</span><span className="text-sm font-semibold" style={{fontVariantNumeric:"tabular-nums",color:neg?ACCENT.expense:C.ink}}>{neg?"\u2212":""}{fmt(Math.abs(v))}{CCY.KRW.unit}</span></div>); }
function SectionLabel({C,children,nomb}){ return <div className={nomb?"":"mb-2"} style={{fontSize:12,fontWeight:600,color:C.sub,letterSpacing:".02em"}}>{children}</div>; }
function SettingRow({C,label,children,last}){ return (<div className="flex items-center justify-between px-4 py-3" style={{borderBottom:last?"none":`1px solid ${C.line}`}}><span className="text-sm">{label}</span>{children}</div>); }
function Toggle({on,onClick,C}){ return (<button onClick={onClick} className="w-11 h-6 rounded-full flex items-center px-0.5" style={{background:on?ACCENT.income:C.line}}><span className="w-5 h-5 rounded-full bg-white" style={{marginLeft:on?20:0,transition:"margin .15s"}}/></button>); }
function Field({C,label,children}){ return (<div className="mb-3"><div style={{fontSize:12,color:C.sub}} className="mb-1">{label}</div>{children}</div>); }
function Row({C,k,v,last}){ return (<div className="flex items-center justify-between py-1.5" style={{borderBottom:last?"none":`1px solid ${C.line}`}}><span style={{color:C.sub}}>{k}</span><span className="font-semibold" style={{fontVariantNumeric:"tabular-nums"}}>{v}</span></div>); }

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
