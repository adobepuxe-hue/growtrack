# GrowTrack — Módulo futuro: diário de cultivo e fertilização

Status: **especificação para etapa posterior**. Não implementar durante o primeiro protótipo de plantas + genéticas + QR Code. Evitar conflitos com o trabalho que o Codex está executando.

## Princípios
- Interface mobile-first, quase toda em opções, sliders, calendário e botões.
- Digitação apenas onde acrescenta valor (nome de produto, observações).
- Métodos de cultivo por planta: **Orgânico**, **Mineral**, **Organomineral**.
- Fases por planta: **Broto**, **Vega**, **Flora**; registrar data de início de cada fase e preservar o histórico.
- Frequência de rega é lembrete configurável, não ordem automática de regar.
- Sem sensores por enquanto. Tudo lançado manualmente.

## Cadastro de produtos / insumos
Cada item de catálogo tem ID próprio, nome, marca opcional, natureza (mineral, orgânico), apresentação (líquido, sólido), unidade padrão (mL, g), e opcionalmente fórmula NPK do rótulo (N, P2O5, K2O) e observações.
Separar composição (ex.: NPK 10-10-10 do rótulo) da dose efetivamente aplicada. Não inferir massa de nutrientes sem teor, unidade e concentração apropriados. Insumos orgânicos podem não possuir fórmula NPK conhecida.

## Novo registro
- Escolher planta; data/hora predefinida como agora e editável.
- Tipo: Rega; Fertilização; Rega + Fertilização; Medição; Observação.
- Rega: volume (mL, com slider e valor numérico editável), meio/método opcional, observação.
- Fertilização: seleção de 1 ou mais produtos do catálogo, dose de cada um, unidade e eventualmente volume final da solução.
- Medições opcionais: pH, EC (mS/cm), temperatura, umidade, sempre rotuladas com unidades.
- Anexar foto: versão futura.
- Salvar evento com a fase vigente naquela data (ou apontador para histórico de fases) e informação do método de cultivo naquele momento.
- Permitir editar/excluir após confirmação, mantendo consistência do histórico.

## Variantes de interface por método
- Orgânico: destaque lista de insumos orgânicos, adubações e regas; não obrigar pH/EC.
- Mineral: destaque NPK, produto, dose, pH e EC opcionais.
- Organomineral: permitir ambos os tipos no mesmo registro.
- Sempre permitir registros fora do padrão sem bloquear o usuário (ex.: insumo orgânico aplicado a planta classificada como mineral), com aviso não impeditivo.

## Próximos lembretes
Opções: sem periodicidade; diariamente; a cada 2 dias; a cada 3 dias; intervalo personalizado. Todas editáveis e com acionamento manual; aviso não implica necessidade biológica.

## Relatórios sob demanda
Botão 'Gerar relatório' dentro da planta; não mostrar gráficos de modo permanente.
Filtros: período, fase, produtos, tipo de evento.
Gráficos: volume das regas ao longo do tempo; doses por produto (separar g e mL); fórmulas NPK usadas por aplicação, identificadas como composição de rótulo, não absorção efetiva.
Exportar PDF/CSV futuramente apenas mediante comando.

## Critérios de aceitação futuros
1. Duas plantas com métodos diferentes podem registrar eventos com formulários adaptados.
2. Cadastro único de um fertilizante é reutilizado em vários eventos sem redigitar composição.
3. Todas as doses guardam unidade e data.
4. Mudança Broto → Vega → Flora preserva históricos e datas.
5. Dados salvos permanecem após recarregar.
6. Nenhum relatório gráfico é exibido automaticamente.

## Notas
Esta especificação é de UX e registro histórico, não de recomendação automática de cultivo, doses ou calendário agronômico.
