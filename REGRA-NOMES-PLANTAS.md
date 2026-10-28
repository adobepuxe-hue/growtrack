# GrowTrack — Regra de nomenclatura automática de plantas

## Regra solicitada
Ao cadastrar uma planta, selecionar obrigatoriamente uma genética do Banco de Genéticas. O nome padrão é gerado automaticamente no formato:

**<nome da genética> #<número sequencial cadastrado para essa genética>**

Exemplo:
- Manga Rosa #1
- Manga Rosa #2
- Blue Dream #1
- Manga Rosa #3

## Regras de dados
- A sequência é **independente por genética**, baseada no ID interno da genética (e não em comparação de nomes digitados).
- Não exigir que o usuário digite o nome da planta.
- Guardar `geneticId`, `sequenceNumber` e `displayName` (derivado), além de um ID único e imutável da planta para QR.
- Não reutilizar números ao excluir plantas: manter contador persistente por genética ou calcular próximo número pelo maior valor histórico, incluindo registros excluídos. Ex.: excluir #2 não faz a próxima voltar a #2.
- Renomear a genética pode atualizar o nome exibido das plantas vinculadas, mantendo sequência, IDs e QR Codes.
- Para esta versão, preservar o nome automático como padrão. Apelidos podem ser previstos para versão futura sem alterar o identificador.
- A criação da planta e o incremento do contador devem ocorrer atomicamente quando existir backend multiusuário; evitar duplicações em cadastros simultâneos.
- Formulário: escolher genética em lista/botões; exibir prévia do nome gerado antes de salvar.
- Ao migrar registros antigos sem genética, pedir associação ou apresentar nome anterior até que se complete a migração; jamais descartar os dados.
- Testes: sequência independente entre genéticas, exclusão sem reciclagem, persistência após recarregar e estabilidade do QR Code.
