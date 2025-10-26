# Backlog Prioritário do MVP

## Épico 1 – Plataforma Base
- **História**: Como cidadão autenticado, desejo listar propostas públicas para entender o que está em debate.
  - Critérios de aceite:
    - Endpoint `GET /proposals` com filtros por status, tag e busca textual.
    - Página inicial exibe cards com título, resumo, tags e status.
- **História**: Como cidadão, quero visualizar uma proposta com README, timeline de commits e votação.
  - Critérios de aceite:
    - Endpoint `GET /proposals/{slug}` retorna detalhes completos.
    - UI renderiza Markdown, estatísticas de votos e commits.

## Épico 2 – Colaboração
- **História**: Como cidadão, desejo forkar uma proposta para sugerir mudanças.
  - Critérios:
    - Endpoint `POST /proposals/{slug}/fork` cria branch derivada.
    - Branch aparece na lista de branches da proposta.
- **História**: Como mantenedor, quero receber um PR com alterações documentadas.
  - Critérios:
    - Endpoint `POST /proposals/{slug}/pull-requests` cria commit e PR associados.
    - Audit log registra abertura.
- **História**: Como mantenedor, preciso mesclar PR aprovado.
  - Critérios:
    - Endpoint `POST /proposals/{slug}/pull-requests/{id}/merge` atualiza branch destino e README.

## Épico 3 – Debate e Governança
- **História**: Como cidadão, desejo abrir issues com templates.
  - Critérios:
    - Endpoint `POST /proposals/{slug}/issues` exige título, descrição e labels.
    - Issues aparecem listadas na UI.
- **História**: Como governança, quero configurar regras municipais.
  - Critérios:
    - Endpoint `GET /governance/rules` expõe configurações.

## Épico 4 – Votação
- **História**: Como eleitor elegível, quero registrar voto aprovando ou rejeitando uma proposta.
  - Critérios:
    - Endpoint `POST /proposals/{slug}/vote` aceita payload `{choice}`.
    - Votos duplicados atualizam registro existente.
    - Interface mostra total de votos sim/não.

## Épico 5 – Transparência
- **História**: Como auditor externo, desejo consultar trilha de auditoria.
  - Critérios:
    - Endpoint `GET /audit` filtra por entidade e `entityId`.
    - Cada ação relevante gera entrada (criação de proposta, commit, voto etc.).
- **História**: Como cidadão, quero autenticar-me de forma simples.
  - Critérios:
    - Endpoint `POST /auth/login` retorna token de sessão.
    - Cabeçalho `x-user-id` autoriza ações protegidas.

## Itens Futuros (não MVP)
- Integração com Gov.br.
- Métodos de votação ranked choice e quadrática.
- Moderação assistida por ML.
- Busca full-text.
- Notificações e-mails / push.
- Exportação de dados em formato aberto.
