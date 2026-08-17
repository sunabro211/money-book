/*  MoneyBook — Apps Script 백엔드
    ─────────────────────────────────────────────
    구글시트를 데이터베이스로 쓰고, 화면(index.html, GitHub Pages)과 통신합니다.
    대호AS와 같은 방식입니다.

    ▶ 처음 한 번만: 상단 메뉴에서 함수 [setupSheets] 선택 후 실행 (시트/헤더 자동 생성)
    ▶ 코드 수정 후: 반드시 "배포 관리 → 기존 배포 수정" 으로 재배포 (URL 유지)
    ─────────────────────────────────────────────
*/

// 부부 접속 키 (원하면 뒤 숫자만 바꿔도 됨). 링크: ...exec 를 index.html에 넣고, 접속은 GitHub 주소 ?k=아래키
var USERS = {
  'mb-suneth-7364': { name: 'SUNETH', lang: 'ko' },
  'mb-amandi-2918': { name: 'AMANDI', lang: 'en' }
};

// 시트 이름과 컬럼(세로) 정의 — setupSheets가 이대로 만들어줍니다
var SCHEMA = {
  'Accounts':  ['id','ko','en','currency','start'],
  'Txns':      ['id','date','type','accountId','amount','category','memo','user','createdAt'],
  'Assets':    ['id','kind','name','currency','nowValue','principal','rateY','startDate','jType','purity','weight','buyPrice','buyGold'],
  'AssetFlows':['id','assetId','dir','amount','memo','date'],
  'Debts':     ['id','kind','name','currency','remain'],
  'Settings':  ['key','value']
};

function ss(){ return SpreadsheetApp.getActiveSpreadsheet(); }
function sh(name){ return ss().getSheetByName(name); }

// ───────── 처음 1회 실행 ─────────
function setupSheets(){
  var book = ss();
  Object.keys(SCHEMA).forEach(function(name){
    var s = book.getSheetByName(name) || book.insertSheet(name);
    var headers = SCHEMA[name];
    s.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold');
    s.setFrozenRows(1);
  });
  // 기본 계좌 4개 (이미 있으면 안 넣음)
  var acc = sh('Accounts');
  if (acc.getLastRow() < 2){
    var rows = [
      ['kr_bank','한국 통장','Korea Bank','KRW',0],
      ['kr_cash','한국 현금·지갑','Korea Cash','KRW',0],
      ['lk_bank','스리랑카 통장','Sri Lanka Bank','LKR',0],
      ['lk_cash','스리랑카 현금','Sri Lanka Cash','LKR',0]
    ];
    acc.getRange(2,1,rows.length,5).setValues(rows);
  }
  // 기본 설정 (없을 때만)
  var defaults = {
    rate: 4.5, goldKRW: 120000, goldLKR: 35000,
    cats: JSON.stringify({
      expense:[{ko:'식비',en:'Food'},{ko:'생활용품',en:'Household'},{ko:'교통',en:'Transport'},{ko:'통신',en:'Telecom'},{ko:'월세·주거',en:'Housing'},{ko:'의료',en:'Medical'},{ko:'문화',en:'Leisure'},{ko:'기타',en:'Other'}],
      income:[{ko:'월급',en:'Salary'},{ko:'부업',en:'Side'},{ko:'용돈',en:'Allowance'},{ko:'이자',en:'Interest'},{ko:'기타',en:'Other'}]
    })
  };
  var cur = readObjects('Settings').reduce(function(m,r){ m[r.key]=true; return m; },{});
  var setS = sh('Settings');
  Object.keys(defaults).forEach(function(k){
    if(!cur[k]) setS.appendRow([k, defaults[k]]);
  });
  SpreadsheetApp.getUi && SpreadsheetApp.getActive().toast('setupSheets 완료!');
}

// ───────── 공통 유틸 ─────────
function readObjects(name){
  var s = sh(name); if(!s) return [];
  var vals = s.getDataRange().getValues();
  if(vals.length < 2) return [];
  var head = vals[0];
  return vals.slice(1).map(function(row){
    var o = {}; head.forEach(function(h,i){ o[h]=row[i]; }); return o;
  }).filter(function(o){ return o.id !== '' && o.id != null || name==='Settings'; });
}
function appendObj(name, obj){
  var s = sh(name); var head = SCHEMA[name];
  s.appendRow(head.map(function(h){ return obj[h]!=null ? obj[h] : ''; }));
}
function findRow(name, id){
  var s = sh(name); var vals = s.getDataRange().getValues();
  for(var i=1;i<vals.length;i++){ if(String(vals[i][0])===String(id)) return i+1; }
  return -1;
}
function updateObj(name, id, partial){
  var s = sh(name); var head = SCHEMA[name]; var r = findRow(name,id); if(r<0) return;
  head.forEach(function(h,i){ if(partial[h]!=null) s.getRange(r,i+1).setValue(partial[h]); });
}
function deleteById(name, id){
  var r = findRow(name,id); if(r>0) sh(name).deleteRow(r);
}
function newId(){ return Utilities.getUuid().slice(0,8); }
function json(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

// ───────── 진입점 ─────────
function doGet(e){
  var p = e.parameter;
  return handle(p.k, p.action, p.payload ? JSON.parse(p.payload) : {});
}
function doPost(e){
  var body = {};
  try { body = JSON.parse(e.postData.contents); } catch(err){}
  return handle(body.k, body.action, body.payload || {});
}

function handle(k, action, d){
  var u = USERS[k];
  if(!u) return json({ ok:false, error:'접속 키가 올바르지 않아요' });

  try{
    switch(action){
      case 'load': {
        var settingsRows = readObjects('Settings');
        var settings = {};
        settingsRows.forEach(function(r){ settings[r.key] = r.value; });
        var cats = {};
        try { cats = JSON.parse(settings.cats); } catch(e){ cats = {expense:[],income:[]}; }
        return json({
          ok:true, user:u.name, lang:u.lang,
          accounts: readObjects('Accounts'),
          txns: readObjects('Txns'),
          assets: readObjects('Assets'),
          flows: readObjects('AssetFlows'),
          debts: readObjects('Debts'),
          settings: {
            rate: Number(settings.rate)||4.5,
            goldKRW: Number(settings.goldKRW)||0,
            goldLKR: Number(settings.goldLKR)||0,
            cats: cats
          }
        });
      }
      case 'addTxn': {
        var id = newId();
        appendObj('Txns', { id:id, date:d.date, type:d.type, accountId:d.accountId,
          amount:Number(d.amount), category:d.category, memo:d.memo||'', user:u.name, createdAt:new Date().toISOString() });
        return json({ ok:true, id:id });
      }
      case 'delTxn': deleteById('Txns', d.id); return json({ ok:true });

      case 'setStart': updateObj('Accounts', d.accountId, { start:Number(d.start) }); return json({ ok:true });

      case 'addAsset': {
        var aid = newId();
        appendObj('Assets', {
          id:aid, kind:d.kind, name:d.name, currency:d.currency,
          nowValue:num(d.nowValue), principal:num(d.principal), rateY:num(d.rateY), startDate:d.startDate||'',
          jType:d.jType||'', purity:num(d.purity), weight:num(d.weight), buyPrice:num(d.buyPrice), buyGold:num(d.buyGold)
        });
        return json({ ok:true, id:aid });
      }
      case 'updateAsset': updateObj('Assets', d.id, { nowValue:num(d.nowValue) }); return json({ ok:true });
      case 'delAsset': {
        deleteById('Assets', d.id);
        // 딸린 흐름도 삭제
        var flows = readObjects('AssetFlows').filter(function(f){ return String(f.assetId)===String(d.id); });
        flows.forEach(function(f){ deleteById('AssetFlows', f.id); });
        return json({ ok:true });
      }
      case 'addFlow': {
        appendObj('AssetFlows', { id:newId(), assetId:d.assetId, dir:d.dir, amount:Number(d.amount), memo:d.memo||'', date:d.date||new Date().toISOString().slice(0,10) });
        return json({ ok:true });
      }

      case 'addDebt': {
        var did = newId();
        appendObj('Debts', { id:did, kind:d.kind, name:d.name, currency:d.currency, remain:Number(d.remain) });
        return json({ ok:true, id:did });
      }
      case 'delDebt': deleteById('Debts', d.id); return json({ ok:true });

      case 'payDebt': {
        // 남은 금액 차감
        var cur = null;
        readObjects('Debts').forEach(function(r){ if(String(r.id)===String(d.debtId)) cur=r; });
        if(cur){ var nr = Math.max(0, Number(cur.remain) - Number(d.amount)); updateObj('Debts', d.debtId, { remain:nr }); }
        // 계좌 자동연동: 대출/할부=지출, 빌려준돈=수입 으로 내역 기록
        var isLent = d.kind==='lent';
        appendObj('Txns', { id:newId(), date:d.date, type:isLent?'income':'expense', accountId:d.accountId,
          amount:Number(d.amount), category:d.category, memo:d.memo||'', user:u.name, createdAt:new Date().toISOString() });
        return json({ ok:true });
      }

      case 'saveSetting': {
        var r = findRow('Settings', d.key);
        if(r>0) sh('Settings').getRange(r,2).setValue(d.value);
        else sh('Settings').appendRow([d.key, d.value]);
        return json({ ok:true });
      }
    }
    return json({ ok:false, error:'알 수 없는 action: '+action });
  } catch(err){
    return json({ ok:false, error:String(err) });
  }
}
function num(v){ return v==null || v==='' ? '' : Number(v); }