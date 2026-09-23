let archiveRecords=[];
const $=id=>document.getElementById(id);
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

function publicRecord(r){
  const id=String(r.expediente||'');
  const coords=String(r.coordenadas||'').trim();
  return r.publicado===true&&coords&&/^5a-\d{6}$/.test(id);
}
function unique(field){
  return [...new Set(archiveRecords.map(r=>String(r[field]||'').trim()).filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b,'es',{sensitivity:'base'}));
}
function fillSelect(id,field){
  const el=$(id);
  unique(field).forEach(v=>el.insertAdjacentHTML('beforeend',`<option value="${escapeAttr(v)}">${escapeHtml(v)}</option>`));
}
function filters(){
  return {
    q:norm($('archive-search').value),city:$('filter-city').value,technique:$('filter-technique').value,
    artist:$('filter-artist').value,state:$('filter-state').value,score:$('filter-score').value,
    destino:$('filter-destino').value,advisory:$('filter-advisory').value,sort:$('archive-sort').value
  };
}
function filteredRecords(){
  const f=filters();
  let rows=archiveRecords.filter(r=>{
    const hay=norm([
      r.expediente,r.titulo,r.artista,r.ciudad,r.ubicacion,r.tecnica,r.estado,
      r.stratascore,r.destino_curatorial,r.observaciones
    ].join(' '));
    return (!f.q||hay.includes(f.q))
      &&(!f.city||r.ciudad===f.city)
      &&(!f.technique||r.tecnica===f.technique)
      &&(!f.artist||r.artista===f.artist)
      &&(!f.state||r.estado===f.state)
      &&(!f.score||r.stratascore===f.score)
      &&(!f.destino||r.destino_curatorial===f.destino)
      &&(!f.advisory||(f.advisory==='yes'?r.methacrylate_advisory===true:r.methacrylate_advisory!==true));
  });
  rows.sort((a,b)=>{
    if(f.sort==='oldest')return String(a.fecha||'').localeCompare(String(b.fecha||''));
    if(f.sort==='id-asc')return a.expediente.localeCompare(b.expediente);
    if(f.sort==='id-desc')return b.expediente.localeCompare(a.expediente);
    return String(b.fecha||'').localeCompare(String(a.fecha||''));
  });
  return rows;
}
function updateStats(){
  const calabozo=archiveRecords.filter(r=>r.destino_curatorial==='Calabozo del Metacrilato™'||r.destino_curatorial==='Ambos').length;
  const advisory=archiveRecords.filter(r=>r.methacrylate_advisory===true).length;
  $('stat-total').textContent=archiveRecords.length;
  $('stat-cities').textContent=new Set(archiveRecords.map(r=>norm(r.ciudad)).filter(Boolean)).size;
  $('stat-artists').textContent=new Set(archiveRecords.map(r=>norm(r.artista)).filter(Boolean)).size;
  $('stat-calabozo').textContent=calabozo;
  $('stat-advisory').textContent=advisory;
}
function updateSortNote(){
  const notes={
    newest:'Fecha del avistamiento · más recientes primero',
    oldest:'Fecha del avistamiento · más antiguos primero',
    'id-asc':'Número de expediente · ascendente',
    'id-desc':'Número de expediente · descendente'
  };
  const el=$('archive-sort-note');
  if(el)el.textContent=notes[$('archive-sort').value]||'';
}
function updateActiveFilters(){
  const f=filters(),chips=[];
  if(f.q)chips.push(['BÚSQUEDA',f.q]);
  if(f.city)chips.push(['CIUDAD',f.city]);
  if(f.technique)chips.push(['TÉCNICA',f.technique]);
  if(f.artist)chips.push(['ARTISTA',f.artist]);
  if(f.state)chips.push(['ESTADO',f.state]);
  if(f.score)chips.push(['STRATASCORE',f.score]);
  if(f.destino)chips.push(['DESTINO',f.destino]);
  if(f.advisory)chips.push(['ADVISORY',f.advisory==='yes'?'METHACRYLATE':'SIN ADVISORY']);
  const box=$('active-filters');
  box.innerHTML=chips.map(([k,v])=>`<span><b>${escapeHtml(k)}</b> ${escapeHtml(v)}</span>`).join('');
}
function strataGrade(r){
  const s=String(r.stratascore_validado||r.stratascore||'').trim();
  const m=s.match(/^([A-E])(?:\\s|$)/i);
  if(m)return m[1].toUpperCase();
  const n=Number(r.strata_index_validado??r.strata_index);
  if(Number.isFinite(n)&&n>=0&&n<=20)return n<=3?'A':n<=7?'B':n<=11?'C':n<=15?'D':'E';
  return '';
}
function strataImage(r){const g=strataGrade(r);if(!g)return '';if(String(r.expediente||'')==='5a-000009')return 'assets/C.png?v=20260923-EXP9C';return 'assets/'+g+'.png?v='+encodeURIComponent(g);}
function render(){
  const grid=$('archive-grid'),status=$('archive-status'),summary=$('archive-summary');
  updateSortNote();updateActiveFilters();
  const rows=filteredRecords();
  status.textContent=`ARCHIVO PÚBLICO / ${archiveRecords.length} EXPEDIENTE${archiveRecords.length===1?'':'S'} CATALOGADO${archiveRecords.length===1?'':'S'}`;
  summary.textContent=`MOSTRANDO ${rows.length} DE ${archiveRecords.length}`;
  if(!rows.length){
    grid.innerHTML='<div class="archive-empty"><strong>NINGÚN EXPEDIENTE COINCIDE.</strong><p>La calle existe. Este filtro, de momento, no.</p></div>';
    return;
  }
  grid.innerHTML=rows.map(r=>{
    const href=`expediente.html?id=${encodeURIComponent(r.expediente)}`;
    const score=r.strata_index!==undefined&&r.strata_index!==null&&r.strata_index!==''?`${escapeHtml(r.strata_index)}/20 · ${escapeHtml(r.stratascore||'SIN CLASIFICAR')}`:escapeHtml(r.stratascore||'SIN STRATASCORE');
    const date=r.fecha?new Date(r.fecha+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'numeric'}):'FECHA NO REGISTRADA';
    return `<article class="file-card">
      <a href="${href}" aria-label="Abrir expediente ${escapeAttr(r.expediente)}"><img src="${escapeAttr(r.imagen)}" alt="${escapeAttr(r.titulo||r.expediente)}" loading="lazy"></a>
      <div class="file-meta">
        <span>5a GALERIA / ${escapeHtml(r.expediente)}</span>
        <strong><a href="${href}">${escapeHtml(r.titulo||r.expediente)}</a></strong>
        <p>${escapeHtml(r.artista||'ANÓNIMO')}</p>
        <p>${escapeHtml(r.ciudad||'SIN CIUDAD')} · ${escapeHtml(r.tecnica||'SIN CLASIFICAR')}</p>
        <div class="file-card-date">${escapeHtml(date)}</div>
        <div class="file-score-line"><b>${score}</b></div>${strataImage(r)?'<div class="file-strata-badge"><img src="'+escapeAttr(strataImage(r))+'" alt="StrataScore™ '+escapeAttr(strataGrade(r))+'" loading="lazy"></div>':''}
        <div class="file-tags">
          ${r.estado?`<small>${escapeHtml(r.estado)}</small>`:''}
          ${r.methacrylate_advisory?`<small>METHACRYLATE ADVISORY™</small>`:''}
          ${r.destino_curatorial==='Calabozo del Metacrilato™'||r.destino_curatorial==='Ambos'?'<small>CALABOZO DEL METACRILATO™</small>':''}
          ${(r.destino_curatorial==='Calabozo del Metacrilato™'||r.destino_curatorial==='Ambos')?'<small><a href="calabozo.html">VER EN CALABOZO →</a></small>':''}
        </div>
      </div>
    </article>`;
  }).join('');
}
async function loadArchive(){
  try{
    const response=await fetch('data/archivo.json?v='+Date.now(),{cache:'no-store'});
    if(!response.ok)throw new Error();
    const data=await response.json();
    archiveRecords=(data.records||[]).filter(publicRecord);
    updateStats();
    fillSelect('filter-city','ciudad');fillSelect('filter-technique','tecnica');fillSelect('filter-artist','artista');
    fillSelect('filter-state','estado');fillSelect('filter-score','stratascore');fillSelect('filter-destino','destino_curatorial');
    const requestedDestino=new URLSearchParams(location.search).get('destino');
    if(requestedDestino)$('filter-destino').value=requestedDestino;
    ['archive-search','filter-city','filter-technique','filter-artist','filter-state','filter-score','filter-destino','filter-advisory','archive-sort']
      .forEach(id=>$(id).addEventListener(id==='archive-search'?'input':'change',render));
    $('archive-reset').addEventListener('click',()=>{
      ['archive-search','filter-city','filter-technique','filter-artist','filter-state','filter-score','filter-destino','filter-advisory'].forEach(id=>$(id).value='');
      $('archive-sort').value='newest';render();
    });
    render();
  }catch(e){
    $('archive-status').textContent='ERROR DE LECTURA DEL ARCHIVO PÚBLICO.';
    $('archive-grid').innerHTML='';
  }
}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function escapeAttr(value){return escapeHtml(value);}
loadArchive();
