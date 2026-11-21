# Desafio de Testes — Dominó (`desafio_teste_domino`)

## 1. Identificação do Desafio

Este repositório é a entrega do **Desafio de Testes: Dominó**, proposto na disciplina de Projeto, Implementação e Teste de Software da **Unicesumar**. O objetivo é implementar, em JavaScript, as regras de uma partida de Dominó para 2 jogadores e uma suíte de testes automatizados que valide essas regras.

A especificação completa está em [`especifica_o_e_fluxo_desafio_domin.md`](./especifica_o_e_fluxo_desafio_domin.md).

---

## 2. Como instalar e executar os testes

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm 9 ou superior (já vem com o Node.js)

### Instalação

```bash
npm install
```

### Executar a suíte completa

```bash
npm test
```

Roda o Jest nos seis arquivos de `tests/` e lista cada caso de teste no terminal.

### Outras formas de executar

```bash
npm run test:coverage                  # suíte completa com relatório de cobertura em coverage/
npx jest tests/05_scoring.test.js      # apenas um arquivo
npx jest -t "jogo fechado"             # apenas os casos cujo nome contém o texto
```

---

## 3. Estrutura do Projeto

```text
desafio_teste_domino/
├── src/
│   └── domino.js                # Regras e estado do jogo
├── tests/
│   ├── 01_preparation.test.js   # Suíte 1: preparação e distribuição
│   ├── 02_start_order.test.js   # Suíte 2: definição de quem inicia
│   ├── 03_placement.test.js     # Suíte 3: encaixe e movimentação
│   ├── 04_graveyard.test.js     # Suíte 4: cemitério e passagem de vez
│   ├── 05_scoring.test.js       # Suíte 5: pontuação da rodada
│   └── 06_victory.test.js       # Suíte 6: vitória da partida
├── package.json
└── README.md
```

---

## 4. Como os testes funcionam

### Modelo usado pela engine

Cada peça é um `Tile` com dois lados, `left` e `right`, de 0 a 6. A mesa (`Board`) guarda a cadeia de peças jogadas e as duas pontas abertas, `leftEnd` e `rightEnd`. Ao encaixar uma peça numa ponta, o lado que casa fica virado para dentro da cadeia e o outro lado passa a ser a nova ponta.

A classe `Game` guarda o estado da partida: as duas mãos, o cemitério, a mesa, o jogador da vez, o contador de passes consecutivos e o placar geral (`matchScore`). A partida termina quando um jogador chega a 10 pontos ou mais, e nesse momento `isOver` fica `true` e `matchWinner` recebe o índice do vencedor.

A API usada nos testes é:

- `generateFullSet()` gera as 28 peças, de `[0|0]` a `[6|6]`.
- `dealTiles(baralho?)` distribui 6 peças para cada jogador e deixa 16 no cemitério.
- `determineStartingPlayer(maos)` aplica a ordem de início: duplo-6, maior dupla e maior soma.
- `board.place(peca, "left" | "right")` encaixa uma peça numa ponta e lança erro se ela não casar.
- `game.startRound(baralho?)` inicia uma rodada e já baixa a peça de quem começa.
- `game.playTile(peca, ponta)` joga uma peça da mão do jogador da vez.
- `game.drawUntilPlayable()` compra do cemitério até o jogador ter jogada ou o monte acabar.
- `game.passTurn()` passa a vez. Só é aceito sem jogada na mão e com o cemitério vazio.
- `classifyWin(peca, pontas)` diz quantos pontos vale a batida, a partir das pontas de antes da jogada.
- `resolveClosedGame(maos)` soma as mãos no jogo fechado e indica quem venceu, ou `-1` no empate.

`playTile` devolve `points`, `roundOver` e `matchOver`, e `passTurn` devolve `closed` e `matchOver`. Os testes conferem esse retorno e também o estado do jogo depois da jogada.

### Como os cenários são montados

Uma rodada real começa com as peças embaralhadas, o que deixaria os testes imprevisíveis. Por isso os cenários usam dados fixos:

- As suítes 1 a 3 montam mãos e mesas com `new Tile(...)` e chamam as funções isoladas.
- As suítes 4 a 6 montam um `Game` já no ponto que interessa ao teste, escrevendo direto em `board`, `hands`, `graveyard` e `matchScore`. Cada arquivo tem uma função auxiliar curta para isso: `prepararJogo`, `montarMesa`, `jogoNaUltimaPeca` ou `jogoComPlacar`.
- A compra do cemitério sorteia a peça com `Math.random`. Na suíte 4, `jest.spyOn(Math, "random").mockReturnValue(0)` faz o jogador comprar sempre a primeira peça do monte, então dá para saber de antemão em que compra a peça válida aparece. O mock é desfeito no `afterEach`.

O primeiro teste da suíte 6 chama `startRound()` sem baralho fixo. Ele só confere quantidades (11 peças nas mãos, 1 na mesa, 16 no cemitério, 28 no total), que valem para qualquer embaralhamento.

### O que cada suíte verifica

- **Suíte 1:** o baralho tem 28 peças únicas, todas entre 0 e 6, e a distribuição deixa 6 peças por jogador e 16 no cemitério, sem peça repetida.
- **Suíte 2:** começa quem tem o duplo-6. Sem ele, começa quem tem a maior dupla. Sem duplas, começa quem tem a maior soma, e o empate de soma é decidido pelo maior número individual.
- **Suíte 3:** o encaixe nas duas pontas atualiza as extremidades. Uma peça incompatível é recusada com erro e a mesa não muda.
- **Suíte 4:** o jogador compra do cemitério até achar peça válida e não compra se já tem jogada. Quando o monte acaba sem peça válida, ele passa a vez. Dois passes seguidos fecham o jogo. Não é possível passar tendo jogada ou com peças no cemitério.
- **Suíte 5:** a batida vale 1, 2, 3 ou 4 pontos conforme o tipo, tanto chamando `classifyWin` direto quanto jogando pelo `Game`. No jogo fechado, a menor soma ganha 1 ponto e, no empate, ninguém pontua.
- **Suíte 6:** a partida segue com nova rodada enquanto o placar está abaixo de 10. Ela termina ao chegar exatamente a 10, ao passar de 10 e também quando o ponto da vitória vem de um jogo fechado.

---

## 5. Regras validadas nos casos ambíguos

A seção 3 da especificação deixa alguns pontos em aberto. A engine segue estas decisões:

- **Comprar ou passar:** o jogador sem jogada compra do cemitério enquanto houver peças e só passa a vez com o monte vazio. O `passTurn` recusa o passe fora dessa situação.
- **Jogo fechado:** só fecha com 2 passes consecutivos. Se um jogador passa e o adversário consegue jogar, o contador volta a zero e o jogo continua.
- **Empate no jogo fechado:** a rodada termina sem ponto para ninguém (`winnerIndex: -1`).
- **Batida em duas pontas:** vale quando a última peça casa com as duas pontas ao mesmo tempo. Com pontas `2` e `5`, a peça `[2|5]` vale 3 pontos. Com pontas `4` e `4`, a carroça `[4|4]` vale 4 pontos. Com pontas `3` e `3`, a peça `[3|5]` encaixa em só uma delas e vale 1 ponto.

---

## 6. Observações sobre a engine

- **Correção feita na pontuação (suíte 5):** `classifyWin` olhava as pontas da mesa depois que a última peça já tinha sido encaixada. Jogando pelo `Game`, uma batida com `[2|5]` na mesa com pontas 2 e 5 valia 1 ponto em vez de 3, e uma batida com `[3|5]` na mesa com pontas 3 e 3 valia 3 em vez de 1. Agora `playTile` guarda as pontas antes da jogada e as passa para `classifyWin`. Os testes da seção "batida durante a partida" cobrem os dois casos.
- **Compra até encaixar e passe controlado (suíte 4):** a engine não tinha o fluxo de comprar até achar peça válida e deixava o jogador passar a vez mesmo com jogada na mão. Entraram `hasPlayableTile()` e `drawUntilPlayable()`, e o `passTurn()` passou a lançar erro quando o passe não é permitido.
- **Cobertura abaixo de 100%:** o relatório indica cerca de 97% das linhas e 94% dos ramos. Ficam sem teste três proteções do motor: `board.place` com a mesa vazia (a primeira peça sempre entra por `placeFirst`), a ponta inválida diferente de `"left"` e `"right"` e a tentativa de jogar uma peça que não está na mão.

---

## 7. Casos de Teste Cobertos

| Suíte | Categoria                   | Cenários principais                                                         | Testes | Arquivo                  |
| :---- | :-------------------------- | :-------------------------------------------------------------------------- | :----- | :----------------------- |
| 1     | Preparação e Distribuição   | Baralho com 28 peças únicas; 6 peças por jogador e 16 no cemitério          | 6      | `01_preparation.test.js` |
| 2     | Definição de Início         | Duplo-6, maior dupla, maior soma e desempate pelo maior número              | 6      | `02_start_order.test.js` |
| 3     | Encaixe e Movimentação      | Encaixe nas duas pontas; recusa de peça incompatível; `canPlace`            | 10     | `03_placement.test.js`   |
| 4     | Cemitério e Passagem de Vez | Compra até encaixar; passe com monte vazio; jogo fechado; passe indevido    | 7      | `04_graveyard.test.js`   |
| 5     | Pontuação da Rodada         | Batidas de 1, 2, 3 e 4 pontos; menor soma no jogo fechado; empate           | 12     | `05_scoring.test.js`     |
| 6     | Vitória da Partida          | Nova rodada abaixo de 10; fim da partida com 10, acima de 10 e jogo fechado | 5      | `06_victory.test.js`     |

Total: **46 testes**.

---

## 8. Colaboradores

| Nome                 | GitHub          | E-mail                    |
| :------------------- | :-------------- | :------------------------ |
| Vinicius Almeida     | ViniciusAlmeid4 | cmpalmeidaa@gmail.com     |
| Luiz Augusto Holanda | LUIZAUGUSTO1113 | luizholanda.dev@gmail.com |
