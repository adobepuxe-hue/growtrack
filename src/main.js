import QRCode from 'qrcode';
import {KEY, phases, load, updatePlant, validateGenetics, qrPayload} from './store.js';
import './style.css';
const app = document.querySelector('#app');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const date = s => s ? s.split('-').reverse().join('/') : '—';
let data, tab = 'plants', edit = null, selected = new Set(), blocked = false;
try { data = load(localStorage); } catch { data = {plants:[], genetics:[]}; blocked = true; }
function persist(next) {
  if (blocked) throw new Error('Não é possível salvar: os dados locais não puderam ser lidos. Preserve os dados existentes antes de continuar.');
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { throw new Error('Não foi possível salvar no navegador. Verifique a permissão de armazenamento e o espaço disponível.'); }
  data = next;
}
const field = (label, name, value = '', type = 'text', extra = '') => `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" ${extra}></label>`;
function render() {
  app.innerHTML = `<header><div class="brand">🌱 GrowTrack</div><span>Seu cultivo, registro por registro.</span></header><main><aside>${blocked ? 'Não foi possível ler os dados locais. Gravação bloqueada para preservar os registros.' : 'Dados salvos somente neste navegador. Sem conta ou sincronização. Limpar os dados do navegador remove os registros; o modo privado pode descartá-los ao fechar.'}</aside><nav aria-label="Seções"><button data-tab="plants" aria-pressed="${tab==='plants'}">Minhas plantas (${data.plants.length})</button><button data-tab="genetics" aria-pressed="${tab==='genetics'}">Banco de Genéticas (${data.genetics.length})</button></nav><div id="notice" role="status"></div><section class="heading"><div><h1>${tab==='plants'?'Minhas plantas':'Banco de Genéticas'}</h1><p>${tab==='plants'?'Acompanhe as fases e imprima suas etiquetas.':'Uma biblioteca reutilizável para suas plantas.'}</p></div><button class="primary" id="new">${tab==='plants'?'+ Cadastrar planta':'+ Cadastrar genética'}</button></section><div id="form-area"></div>${tab==='plants'?plantsView():geneticsView()}</main>`;
  app.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => {tab=b.dataset.tab; edit=null; render();});
  document.querySelector('#new').onclick = () => showForm();
  app.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => showForm(b.dataset.edit));
  app.querySelectorAll('[data-select]').forEach(b => b.onchange = () => {b.checked?selected.add(b.dataset.select):selected.delete(b.dataset.select);});
  app.querySelectorAll('[data-print]').forEach(b => b.onclick = () => printLabels(b.dataset.print ? [b.dataset.print] : [...selected]));
}
function plantsView() {
  if (!data.plants.length) return '<section class="empty"><h2>Seu primeiro registro começa aqui</h2><p>Cadastre uma planta com nome, data de início e fase. A genética é opcional.</p></section>';
  return `<button data-print="">Imprimir etiquetas selecionadas</button><div class="cards">${data.plants.map(p => `<article><div class="card-top"><span class="badge">${esc(p.phase)}</span><label class="select"><input type="checkbox" data-select="${p.id}" ${selected.has(p.id)?'checked':''}> Etiqueta</label></div><h2>${esc(p.name)}</h2><p>${esc(data.genetics.find(g=>g.id===p.geneticsId)?.name || 'Sem genética associada')}</p><p>Início: ${date(p.startDate)}</p><small>ID: ${esc(p.id)}</small><details><summary>Histórico de fases</summary><ol>${p.history.map(h=>`<li>${esc(h.phase)} · ${date(h.date)}</li>`).join('')}</ol></details><div class="actions"><button data-edit="${p.id}">Editar planta</button><button data-print="${p.id}">Imprimir QR</button></div></article>`).join('')}</div>`;
}
function geneticsView() {
  if (!data.genetics.length) return '<section class="empty"><h2>Conheça e organize suas genéticas</h2><p>Cadastre uma genética uma vez e associe a várias plantas.</p></section>';
  return `<div class="cards">${data.genetics.map(g=>`<article><h2>${esc(g.name)}</h2>${g.alias?`<p>${esc(g.alias)}</p>`:''}<dl>${[['Banco/criador',g.breeder],['Linhagem/parentais',g.lineage],['Classificação declarada',g.type],['Floração anunciada (semanas)',`${g.minWeeks || 'Não informada'} a ${g.maxWeeks || 'Não informada'}`],['Características',g.traits],['Notas pessoais',g.notes],['Fonte',g.source]].map(([k,v])=>v?`<dt>${k}</dt><dd>${esc(v)}</dd>`:'').join('')}</dl><p>${data.plants.filter(p=>p.geneticsId===g.id).length} planta(s) associada(s)</p><small>ID: ${esc(g.id)}</small><div class="actions"><button data-edit="${g.id}">Editar genética</button></div></article>`).join('')}</div>`;
}
function showForm(id) {
  edit = id ? (tab==='plants'?data.plants:data.genetics).find(x=>x.id===id) : null;
  const v = edit || {};
  const content = tab==='plants' ? `${field('Nome da planta *','name',v.name,'text','required maxlength="100"')}${field('Data de início *','startDate',v.startDate||today(),'date','required')}<label>Genética (opcional)<select name="geneticsId"><option value="">Sem genética</option>${data.genetics.map(g=>`<option value="${g.id}" ${v.geneticsId===g.id?'selected':''}>${esc(g.name)}</option>`).join('')}</select></label><label>Fase atual *<select name="phase">${phases.map(p=>`<option ${v.phase===p?'selected':''}>${p}</option>`).join('')}</select></label>${edit?field('Data da mudança de fase (ao alterar a fase)','phaseDate',today(),'date','required'):''}` : `${field('Nome da genética *','name',v.name,'text','required maxlength="100"')}${field('Nome alternativo','alias',v.alias)}${field('Banco/criador','breeder',v.breeder)}${field('Linhagem/parentais','lineage',v.lineage)}${field('Tipo/classificação declarada','type',v.type)}${field('Floração anunciada: mínimo (semanas)','minWeeks',v.minWeeks,'number','min="0.1" step="0.1"')}${field('Floração anunciada: máximo (semanas)','maxWeeks',v.maxWeeks,'number','min="0.1" step="0.1"')}<p class="wide">Estimativa do criador, sem previsão automática de datas.</p>${['traits','notes'].map((n,i)=>`<label>${i?'Notas pessoais':'Características gerais'}<textarea name="${n}">${esc(v[n])}</textarea></label>`).join('')}<label>Fonte dos dados<select name="source">${['Rótulo','Catálogo','Observação pessoal'].map(s=>`<option ${v.source===s?'selected':''}>${s}</option>`).join('')}</select></label>`;
  document.querySelector('#form-area').innerHTML = `<form><h2 class="wide">${edit?'Editar':'Cadastrar'} ${tab==='plants'?'planta':'genética'}</h2>${content}<p id="form-error" class="wide error" role="alert"></p><div class="actions wide"><button type="submit" class="primary">Salvar ${tab==='plants'?'planta':'genética'}</button><button type="button" id="cancel">Cancelar</button></div></form>`;
  document.querySelector('#cancel').onclick = () => {edit=null;document.querySelector('#form-area').innerHTML='';};
  document.querySelector('form').onsubmit = event => {
    event.preventDefault(); const values=Object.fromEntries(new FormData(event.target));
    try {
      const key=tab==='plants'?'plants':'genetics';
      if(key==='genetics') validateGenetics(values);
      const record=key==='plants'?updatePlant(edit,values):{...values,name:values.name.trim(),id:edit?.id||crypto.randomUUID()};
      persist({...data,[key]:edit?data[key].map(x=>x.id===edit.id?record:x):[...data[key],record]});
      edit=null;render();document.querySelector('#notice').textContent='Registro salvo neste navegador.';
    } catch(e) {document.querySelector('#form-error').textContent=e.message;}
  };
  document.querySelector('form input').focus();
}
async function printLabels(ids) {
  const area=document.querySelector('#print-area'); area.replaceChildren();
  if (!ids.length) {document.querySelector('#notice').textContent='Selecione pelo menos uma planta para imprimir.';return;}
  try {
    for(const id of ids) {
      const p=data.plants.find(p=>p.id===id); if(!p) continue;
      const label=document.createElement('section'); label.className='print-label';
      const img=document.createElement('img'); img.alt=`QR local de ${p.name}`;
      img.src=await QRCode.toDataURL(qrPayload(id),{width:300,margin:4,errorCorrectionLevel:'M'});
      await img.decode();
      const name=document.createElement('h2');name.textContent=p.name;
      const code=document.createElement('p');code.textContent=`ID: ${id}`;
      const note=document.createElement('small');note.textContent='GrowTrack • Identificador local, sem link público';
      label.append(img,name,code,note);area.append(label);
    }
    window.print();
  } catch {document.querySelector('#notice').textContent='Não foi possível gerar as etiquetas. Tente novamente.';}
}
render();
