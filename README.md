# GrowTrack

Protótipo pessoal em português para cadastrar plantas, manter um Banco de Genéticas e imprimir etiquetas com QR Codes. Interface responsiva, sem backend, conta ou serviços externos em tempo de execução.

## Executar

Requer Node.js 20.19+ ou 22.12+ e npm.

```sh
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite no Opera GX atualizado. Para gerar a versão de produção, use `npm run build`; `npm run preview` serve o resultado para conferência. Use sempre a mesma origem (protocolo, endereço e porta) para acessar os mesmos dados. Não abra `index.html` diretamente pelo sistema de arquivos.

## Uso e limites

- Cadastre uma genética opcionalmente e associe a várias plantas. Somente o nome da genética é obrigatório. As estimativas de floração do criador não geram previsões de cultivo.
- Cadastre a planta com nome, data inicial e fase. Edite a planta para mudar a fase e informar a data da mudança. O histórico anterior permanece registrado.
- Edite uma genética para atualizar sua biblioteca sem apagar o histórico das plantas associadas.
- Use **Imprimir QR** em uma planta ou marque etiquetas e use **Imprimir etiquetas selecionadas**. A janela de impressão permite imprimir ou salvar como PDF. As etiquetas contêm nome, ID completo e um QR com `growtrack:planta:<ID>`. É um identificador textual local; não abre página pública, não transfere os dados e não há leitor integrado nesta fase.
- Os registros ficam em `localStorage`, na chave `growtrack.v1`. Limpar dados do site, trocar de navegador/perfil/origem ou usar navegação privada pode tornar os registros indisponíveis. Ainda não há backup ou sincronização. Falhas de leitura bloqueiam gravações para preservar os dados existentes.
- Imagens, regas, fertilização, calendário, relatórios e contas estão fora desta fase.

## Verificação

```sh
npm test
npm run build
npm run test:e2e
```

Os testes de unidade cobrem histórico, IDs, intervalos de floração e armazenamento inválido. Os testes de navegador cobrem cadastro, associação reutilizável, edição, recarregamento, histórico, geração e leitura do QR, mídia de impressão, layout móvel e falhas de armazenamento.

O Playwright usa `/usr/bin/chromium` neste ambiente. Em outro sistema, defina `CHROMIUM_PATH` com o caminho do executável Chromium/Chrome. A validação automatizada em Chromium não substitui uma conferência no Opera GX e em uma impressora física.
