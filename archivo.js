async function loadArchive(){
  const status=document.getElementById('archive-status');
  const grid=document.getElementById('archive-grid');
  try{
    const response=await fetch('data/archivo.json', {cache:'no-store'});
    if(!response.ok) throw new Error('archive unavailable');
    const data=await response.json();
    const records=(data.records||[]).filter(r=>r.publicado!==false);
    if(!records.length){
      status.textContent='ARCHIVO PÚBLICO: AÚN SIN EXPEDIENTES PUBLICADOS.';
      grid.innerHTML='<div class="file-card"><div class="fake-photo photo-a"><span>LA CALLE<br>ESTÁ SIENDO<br>CATALOGADA</span></div><div class="file-meta"><strong>NINGÚN EXPEDIENTE PÚBLICO TODAVÍA</strong><p>Los avisos recibidos pasan primero por revisión, catalogación y archivo.</p></div></div>';
      return;
    }
    status.textContent=`${records.length} EXPEDIENTE${records.length===1?'':'S'} PÚBLICO${records.length===1?'':'S'}`;
    grid.innerHTML=records.map(r=>{
      const id=r.expediente||r.numero||'SIN NÚMERO';
      const title=r.titulo||r.tecnica||'INTERVENCIÓN URBANA';
      const artist=r.artista||'ANÓNIMO';
      const state=r.estado||'DESCONOCIDO';
      const score=r.stratascore||'';
      const image=r.imagen||'';
      return `<article class="file-card">${image?`<img src="${escapeAttr(image)}" alt="${escapeAttr(title)}" style="width:100%;aspect-ratio:1;object-fit:cover;display:block">`:`<div class="fake-photo photo-b"><span>DOCUMENTO<br>DE CALLE</span></div>`}<div class="file-meta"><span>5a GALERIA / ${escapeHtml(id)}</span><strong>${escapeHtml(title)}</strong><p>Autor: ${escapeHtml(artist)} · Estado: ${escapeHtml(state)}</p>${score?`<b>${escapeHtml(score)}</b>`:''}</div></article>`;
    }).join('');
  }catch(e){
    status.textContent='ERROR DE LECTURA DEL ARCHIVO PÚBLICO.';
  }
}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function escapeAttr(value){return escapeHtml(value);}
loadArchive();
