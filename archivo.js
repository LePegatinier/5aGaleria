async function loadArchive(){
  const status=document.getElementById('archive-status');
  const grid=document.getElementById('archive-grid');
  try{
    const response=await fetch('data/archivo.json',{cache:'no-store'});
    if(!response.ok) throw new Error('archive unavailable');
    const data=await response.json();
    const records=(data.records||[]).filter(r=>{
      const coords=String(r.coordenadas||'').trim();
      const id=String(r.expediente||'');
      return r.publicado===true && coords && /^5a-\d{6}$/.test(id);
    });
    if(!records.length){
      status.textContent='ARCHIVO PÚBLICO: AÚN SIN EXPEDIENTES PUBLICADOS.';
      grid.innerHTML='<div class="file-card"><div class="fake-photo photo-a"><span>LA CALLE<br>ESTÁ SIENDO<br>CATALOGADA</span></div><div class="file-meta"><strong>NINGÚN EXPEDIENTE PÚBLICO</strong></div></div>';
      return;
    }
    status.textContent=`${records.length} EXPEDIENTE${records.length===1?'':'S'} PÚBLICO${records.length===1?'':'S'}`;
    grid.innerHTML=records.map(r=>{
      const id=r.expediente;
      const href=`expediente.html?id=${encodeURIComponent(id)}`;
      return `<article class="file-card"><a href="${href}">${r.imagen?`<img src="${escapeAttr(r.imagen)}" alt="${escapeAttr(r.titulo||id)}" style="width:100%;aspect-ratio:1;object-fit:cover;display:block">`:'<div class="fake-photo photo-b"><span>DOCUMENTO<br>DE CALLE</span></div>'}</a><div class="file-meta"><span>5a GALERIA / ${escapeHtml(id)}</span><strong>${escapeHtml(r.titulo||id)}</strong><p>${escapeHtml(r.ciudad||'')} · ${escapeHtml(r.tecnica||'')}</p></div></article>`;
    }).join('');
  }catch(e){status.textContent='ERROR DE LECTURA DEL ARCHIVO PÚBLICO.';}
}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function escapeAttr(value){return escapeHtml(value);}
loadArchive();
