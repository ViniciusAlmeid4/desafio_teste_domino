# desafio_teste_domino

## 1. Identificação do Desafio

Suíte de testes automatizados em **JavaScript (Jest)** para validar as regras e o fluxo de uma partida de **Dominó para 2 jogadores**, desenvolvida como parte do desafio proposto pela disciplina de Qualidade de Software – **Cesumar / Choma**.

> Especificação original: [`especifica_o_e_fluxo_desafio_domin.md`](./especifica_o_e_fluxo_desafio_domin.md)

---

## 2. Como Executar os Testes

### Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### Instalação

```bash
npm install
```

### Executar todos os testes

```bash
npm test
```

### Executar com relatório de cobertura

```bash
npm run test:coverage
```

### Executar uma suíte específica

```bash
npx jest tests/01_preparation.test.js --verbose
```

---

## 3. Estrutura do Projeto

```
desafio_teste_domino/
├── src/
│   └── domino.js                  # Motor do jogo (Tile, Board, Game, funções auxiliares)
├── tests/
│   ├── 01_preparation.test.js     # Suíte 1 – Preparação e Distribuição
│   ├── 02_start_order.test.js     # Suíte 2 – Definição de Início
│   ├── 03_placement.test.js       # Suíte 3 – Encaixe e Movimentação
│   ├── 04_graveyard.test.js       # Suíte 4 – Cemitério e Passagem de Vez
│   ├── 05_scoring.test.js         # Suíte 5 – Pontuação da Rodada
│   └── 06_victory.test.js         # Suíte 6 – Vitória da Partida
├── package.json
└── README.md
```

---

## 4. Matriz de Casos de Teste

| Suíte | Descrição |
|-------|-----------|
| **1 – Preparação e Distribuição** | Baralho completo de 28 peças únicas; distribuição de 6 por jogador; 16 no cemitério |
| **2 – Definição de Início** | Duplo-6 → maior dupla → maior soma → desempate por maior número individual |
| **3 – Encaixe e Movimentação** | Aceitar/rejeitar encaixe; atualização das extremidades da mesa |
| **4 – Cemitério e Passagem de Vez** | Comprar do cemitério até encontrar peça válida; passar a vez com cemitério vazio |
| **5 – Pontuação da Rodada** | Batida simples (+1), carroça (+2), simples 2 pontas (+3), carroça 2 pontas (+4), jogo fechado |
| **6 – Vitória da Partida** | Nova rodada enquanto placar < 10; encerramento ao atingir ≥ 10 pontos |

---

## 5. Abordagem (TDD)

O desenvolvimento seguiu a abordagem **TDD (Test-Driven Development)**:

1. Os casos de teste foram escritos primeiro, refletindo diretamente a especificação;
2. O motor do jogo (`src/domino.js`) foi implementado para satisfazer os testes;
3. Todos os cenários da especificação — inclusive casos de borda — possuem cobertura de teste.

---

## 6. Colaboradores

| Nome | Contribuição |
|------|-------------|
| **[Seu nome aqui]** | Motor do jogo (`src/domino.js`), Suítes 1, 2 e 3 de testes, configuração do projeto |
| **[Nome do parceiro aqui]** | Suítes 4, 5 e 6 de testes (Cemitério, Pontuação e Vitória) |

---

## 7. Prazo de Entrega

**22/11/2026** — [Formulário de Entrega](https://forms.gle/bgbV2TwrreR8LiAGA)
