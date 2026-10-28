export const KEY = 'growtrack.v1';
export const phases = ['Broto', 'Vega', 'Flora'];
export function validateGenetics(g) {
  if (!g.name?.trim()) throw new Error('Informe o nome da genética.');
  for (const k of ['minWeeks', 'maxWeeks']) if (g[k] !== '' && (!Number.isFinite(Number(g[k])) || Number(g[k]) <= 0)) throw new Error('As semanas devem ser números maiores que zero.');
  if (g.minWeeks !== '' && g.maxWeeks !== '' && Number(g.minWeeks) > Number(g.maxWeeks)) throw new Error('A duração mínima não pode superar a máxima.');
}
export function updatePlant(previous, values, id = crypto.randomUUID()) {
  if (!values.name?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(values.startDate) || !phases.includes(values.phase)) throw new Error('Preencha nome, data de início e fase válida.');
  if (previous && values.startDate > previous.history[0].date) throw new Error('A data de início não pode ser posterior ao primeiro registro de fase.');
  const history = previous ? [...previous.history] : [{phase: values.phase, date: values.startDate}];
  if (previous && previous.phase !== values.phase) {
    if (!values.phaseDate || values.phaseDate < history.at(-1).date || values.phaseDate < values.startDate) throw new Error('A mudança de fase deve ocorrer após o último registro e o início da planta.');
    history.push({phase: values.phase, date: values.phaseDate});
  }
  return {id: previous?.id || id, name: values.name.trim(), startDate: values.startDate, geneticsId: values.geneticsId || '', phase: values.phase, history};
}
export function load(storage) {
  const raw = storage.getItem(KEY);
  if (!raw) return {plants: [], genetics: []};
  const data = JSON.parse(raw);
  if (!Array.isArray(data.plants) || !Array.isArray(data.genetics) || data.plants.some(p => !p.id || !p.name || !Array.isArray(p.history)) || data.genetics.some(g => !g.id || !g.name)) throw new Error('Formato local inválido');
  return data;
}
export const qrPayload = id => `growtrack:planta:${id}`;
