/* 5a GALERIA · PUBLIC ARCHIVE VALIDATOR
   Control de integridad previo a publicación.
*/

function validateArchive(records){
  const errors=[];
  const ids=new Set();

  (records||[]).forEach((r,index)=>{
    const id=String(r.expediente||'').trim();
    if(!/^5a-\d{6}$/.test(id)) errors.push(`Registro ${index}: ID inválido`);
    if(ids.has(id)) errors.push(`Duplicado: ${id}`);
    ids.add(id);

    if(r.publicado===true){
      if(!String(r.imagen||'').trim()) errors.push(`${id}: falta imagen`);
      if(!String(r.coordenadas||'').trim()) errors.push(`${id}: falta coordenada`);
    }
  });

  return {ok:errors.length===0, errors};
}
