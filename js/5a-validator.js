/* 5a GALERIA · PUBLIC ARCHIVE VALIDATOR
   Control de integridad previo a publicación.
   Coordenadas NO son requisito del archivo: sólo del mapa.
*/

function validateArchive(records){
  const errors=[];
  const ids=new Set();
  (records||[]).forEach((r,index)=>{
    const id=String(r.expediente||'').trim();
    if(!/^5a-\d{6}$/.test(id)) errors.push(`Registro ${index}: ID inválido`);
    if(ids.has(id)) errors.push(`Duplicado: ${id}`);
    ids.add(id);
    if(r.publicado===true && !String(r.imagen||'').trim()) errors.push(`${id}: falta imagen`);
  });
  return {ok:errors.length===0, errors};
}

function validateMapRecord(r){
  const p=String(r?.coordenadas||'').split(',').map(Number);
  return p.length===2&&Number.isFinite(p[0])&&Number.isFinite(p[1])&&p[0]>=-90&&p[0]<=90&&p[1]>=-180&&p[1]<=180;
}
