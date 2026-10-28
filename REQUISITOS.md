# GrowTrack — Requisitos do protótipo

## Objetivo
Aplicativo pessoal de registro de plantas, com futura possibilidade de disponibilização para outros usuários. Começar pequeno, com interface amigável em português e pouca digitação.

## MVP fase 1
- Cadastro de plantas: nome, data de início, genética associada (opcional), fase atual (Broto, Vega, Flora).
- Biblioteca de genéticas reutilizável, independente das plantas.
- QR Code individual por planta, para imprimir etiqueta com nome e ID; QR local não deve fingir abrir uma URL pública.
- Persistência local durante testes. Ainda não há backend nem sincronização.
- Layout mobile-first compatível com Opera GX.

## Banco de Genéticas
Campos:
- Nome e nome alternativo (opcional)
- Banco/criador (opcional)
- Linhagem/parentais (texto opcional)
- Tipo/classificação declarada (opcional)
- Floração estimada anunciada pelo criador: duração mínima e máxima em semanas, ambas opcionais
- Características gerais e notas pessoais (opcionais)
- Fonte dos dados (rótulo, catálogo ou observação pessoal)
- Imagem de referência (etapa posterior)
- ID estável, criado em cada cadastro

Uma genética pode estar ligada a múltiplas plantas. Editar dados da genética não deve apagar o histórico das plantas. Duração estimada de floração e datas reais do cultivo são campos distintos; não inventar previsões.

## Fases
Três fases: Broto, Vega e Flora. Guardar data de início e histórico de mudanças de fase de cada planta, separadamente das estimativas de floração da genética.

## Próximas etapas (não implementar ainda)
- Registro de regas, fertilizantes NPK e insumos orgânicos
- Perfil orgânico, mineral ou organomineral
- Gráficos e relatórios gerados apenas sob demanda, nunca fixos no dashboard
- Calendário e notificações, fotos e backups
- Conta, armazenamento em nuvem e multiusuário

## UX
Preferir seletores, botões, sliders e calendários. Para valores precisos, permitir entrada numérica opcional. Evitar muitos campos obrigatórios.

## Segurança
Não publicar dados privados, segredos ou chaves em repositório público. Quando houver backend, autenticar e isolar os dados por usuário.
