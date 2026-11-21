/**
 * Suíte 5: Pontuação da Rodada
 *
 * ⚠️  ARQUIVO PARA O(A) PARCEIRO(A) COMPLETAR
 *
 * Casos de teste a implementar:
 *
 *  5.1 — Deve atribuir 1 ponto para batida simples em 1 ponta
 *         Cenário: Jogador baixa última peça simples (ex.: [3|1]) em uma ponta.
 *         Esperado: `classifyWin(tile, board)` retorna 1.
 *
 *  5.2 — Deve atribuir 2 pontos para batida de carroça em 1 ponta
 *         Cenário: Jogador baixa última peça dupla (ex.: [3|3]) em uma ponta.
 *         Esperado: `classifyWin(tile, board)` retorna 2.
 *
 *  5.3 — Deve atribuir 3 pontos para batida simples em 2 pontas
 *         Cenário: Mesa com pontas 2 e 5; jogador bate com [2|5].
 *         Esperado: `classifyWin(tile, board)` retorna 3.
 *
 *  5.4 — Deve atribuir 4 pontos para batida de carroça em 2 pontas iguais
 *         Cenário: Mesa com pontas 4 e 4; jogador bate com [4|4].
 *         Esperado: `classifyWin(tile, board)` retorna 4.
 *
 *  5.5 — Deve encerrar por jogo fechado e premiar quem tem menor soma
 *         Cenário: Cemitério vazio; J1 soma 4 pts na mão, J2 soma 9 pts.
 *         Esperado: `resolveClosedGame(hands)` retorna `{ winnerIndex: 0, scores: [4, 9] }`.
 *
 *  5.6 — Deve retornar empate (winnerIndex: -1) quando somas são iguais no jogo fechado
 *         Cenário: J1 e J2 com mesma soma na mão.
 *         Esperado: `resolveClosedGame(hands)` retorna `{ winnerIndex: -1 }`.
 *
 * COMO COMEÇAR:
 *   1. Importe `Tile`, `Board`, `classifyWin` e `resolveClosedGame` de '../src/domino';
 *   2. Para os casos 5.1–5.4, crie uma Board com as pontas corretas e chame `classifyWin`;
 *   3. Para os casos 5.5–5.6, monte arrays de Tile e chame `resolveClosedGame` diretamente.
 *
 * DICA: Você pode usar `board.placeFirst()` seguido de `board.place()` para configurar
 *       as extremidades da mesa antes de chamar `classifyWin`.
 */

const { Tile, Board, classifyWin, resolveClosedGame } = require('../src/domino');

describe('5. Pontuação da Rodada', () => {
  // TODO: implementar os casos 5.1 a 5.6 descritos acima
  it.todo('Deve atribuir 1 ponto para batida simples em 1 ponta');
  it.todo('Deve atribuir 2 pontos para batida de carroça em 1 ponta');
  it.todo('Deve atribuir 3 pontos para batida simples em 2 pontas');
  it.todo('Deve atribuir 4 pontos para batida de carroça em 2 pontas iguais');
  it.todo('Deve encerrar por jogo fechado e premiar quem tem menor soma');
  it.todo('Deve retornar empate (winnerIndex: -1) quando somas são iguais no jogo fechado');
});
