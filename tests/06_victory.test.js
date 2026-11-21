/**
 * Suíte 6: Vitória da Partida
 *
 * ⚠️  ARQUIVO PARA O(A) PARCEIRO(A) COMPLETAR
 *
 * Casos de teste a implementar:
 *
 *  6.1 — Deve continuar a partida enquanto nenhum jogador atingir 10 pontos
 *         Cenário: Jogador vai de 7 para 9 pontos (ganha rodada com +2 de carroça).
 *         Esperado: `game.isOver` é false; `game.matchScore[player]` é 9.
 *
 *  6.2 — Deve finalizar a partida ao atingir exatamente 10 pontos
 *         Cenário: Jogador com 8 pontos faz batida de carroça (+2 pontos).
 *         Esperado: `game.isOver` é true; `game.matchWinner` é o índice do jogador;
 *                   `game.matchScore[player]` é 10.
 *
 *  6.3 — Deve finalizar a partida ao ultrapassar 10 pontos (≥ 10)
 *         Cenário: Jogador com 9 pontos faz batida de carroça em 2 pontas (+4 pontos).
 *         Esperado: `game.isOver` é true; `game.matchScore[player]` é 13.
 *
 *  6.4 — Não deve encerrar a partida com 9 pontos
 *         Cenário: Jogador vai de 8 para 9 pontos (batida simples +1).
 *         Esperado: `game.isOver` é false.
 *
 * COMO COMEÇAR:
 *   1. Importe `Game`, `Tile` e qualquer outra necessidade de '../src/domino';
 *   2. Use `game._addScore(playerIndex, pts)` para simular pontuações já acumuladas;
 *   3. Chame `game.playTile(tile, side)` para simular a última jogada e verifique
 *      o retorno `{ points, roundOver, matchOver }`.
 *
 * DICA: Você pode inicializar o `game.matchScore` diretamente para simular
 *       um placar já parcialmente acumulado:
 *         game.matchScore = [8, 0];
 *       e então acionar a batida final via `game.playTile(...)`.
 */

const { Game, Tile, Board } = require('../src/domino');

describe('6. Vitória da Partida', () => {
  // TODO: implementar os casos 6.1 a 6.4 descritos acima
  it.todo('Deve continuar a partida enquanto nenhum jogador atingir 10 pontos');
  it.todo('Deve finalizar a partida ao atingir exatamente 10 pontos');
  it.todo('Deve finalizar a partida ao ultrapassar 10 pontos');
  it.todo('Não deve encerrar a partida com 9 pontos');
});
