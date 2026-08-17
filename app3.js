/* Allur Business – automatic books sync fix */
(function(){
  function normalizeBooksData(){
    db.income=(db.income||[]).map(x=>({
      ...x,
      clientId:x.clientId||'',
      amount:Number(x.amount||0),
      vat:Number(x.vat||0),
      incomeMode:x.incomeMode||(x.payment==='Gotovina'?'cash':x.payment==='Banka'?'bank':'other'),
      documentNo:x.documentNo||''
    }));
    db.expenses=(db.expenses||[]).map(x=>({
      ...x,
      amount:Number(x.amount||0),
      vat:Number(x.vat||0),
      expenseClass:x.expenseClass||(x.category==='Materijal'?'material':x.category==='Porezi i doprinosi'?'contrib':'other'),
      documentNo:x.documentNo||''
    }));
    db.epo=db.epo||[]; db.kp=db.kp||[]; db.assets=db.assets||[];
  }
  normalizeBooksData();
  localStorage.setItem(KEY,JSON.stringify(db));

  // Base save in v1 did not reliably repaint the upgraded book panes on the live bundle.
  // Replace it so every transaction immediately refreshes Dashboard + all FBiH books.
  save=function(){
    normalizeBooksData();
    localStorage.setItem(KEY,JSON.stringify(db));
    if(typeof render==='function') render();
  };

  // Repaint once after all upgrade scripts are loaded, including existing historical entries.
  setTimeout(()=>{ try{ if(typeof render==='function') render(); }catch(e){ console.error('Books sync render:',e); } },0);

  // When returning to Poslovne knjige always refresh from the current transaction database.
  document.addEventListener('click',e=>{
    const btn=e.target.closest && e.target.closest('[data-page="books"]');
    if(btn) setTimeout(()=>{ try{ if(typeof render==='function') render(); }catch(err){console.error(err);} },0);
  });
})();
