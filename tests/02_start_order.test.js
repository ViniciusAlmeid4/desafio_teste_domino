/**
 * Suíte 2: Definição de Início
 *
 * Valida a lógica de hierarquia para determinar qual jogador começa a rodada:
 *   1. Quem tem o duplo-6
 *   2. Quem tem a maior dupla (na ausência do duplo-6)
 *   3. Quem tem a maior soma (na ausência de qualquer dupla)
 *   4. Desempate de soma pelo maior número individual
 */

const { Tile, determineStartingPlayer } = require('../src/domino');

describe('2. Definição de Início', () => {
  // -------------------------------------------------------------------------
  // Caso 2.1 — Duplo-6 define o início
  // -------------------------------------------------------------------------
  it('Deve iniciar quem possui o duplo-6', () => {
    const hand0 = [new Tile(6, 6), new Tile(5, 3), new Tile(2, 1)];
    const hand1 = [new Tile(5, 5), new Tile(6, 5), new Tile(3, 2)];

    const { playerIndex, startTile } = determineStartingPlayer([hand0, hand1]);

    expect(playerIndex).toBe(0);
    expect(startTile.left).toBe(6);
    expect(startTile.right).toBe(6);
  });

  it('Deve iniciar o jogador 2 se ele tiver o duplo-6', () => {
    const hand0 = [new Tile(5, 5), new Tile(6, 4), new Tile(3, 1)];
    const hand1 = [new Tile(6, 6), new Tile(4, 3), new Tile(2, 0)];

    const { playerIndex, startTile } = determineStartingPlayer([hand0, hand1]);

    expect(playerIndex).toBe(1);
    expect(startTile.left).toBe(6);
    expect(startTile.right).toBe(6);
  });

  // -------------------------------------------------------------------------
  // Caso 2.2 — Maior dupla (sem duplo-6)
  // -------------------------------------------------------------------------
  it('Deve iniciar pela maior dupla na ausência do duplo-6', () => {
    // J1 tem [2|2]; J2 tem [4|4] → J2 começa com [4|4]
    const hand0 = [new Tile(2, 2), new Tile(5, 3), new Tile(1, 0)];
    const hand1 = [new Tile(4, 4), new Tile(3, 1), new Tile(2, 0)];

    const { playerIndex, startTile } = determineStartingPlayer([hand0, hand1]);

    expect(playerIndex).toBe(1);
    expect(startTile.left).toBe(4);
    expect(startTile.right).toBe(4);
  });

  it('Deve iniciar pela maior dupla quando ambos têm duplas diferentes', () => {
    // J1 tem [5|5]; J2 tem [3|3] → J1 começa com [5|5]
    const hand0 = [new Tile(5, 5), new Tile(4, 1), new Tile(2, 0)];
    const hand1 = [new Tile(3, 3), new Tile(6, 4), new Tile(5, 2)];

    const { playerIndex, startTile } = determineStartingPlayer([hand0, hand1]);

    expect(playerIndex).toBe(0);
    expect(startTile.left).toBe(5);
    expect(startTile.right).toBe(5);
  });

  // -------------------------------------------------------------------------
  // Caso 2.3 — Maior soma (sem duplas)
  // -------------------------------------------------------------------------
  it('Deve iniciar pela maior soma quando não há duplas', () => {
    // J1: maior peça é [6|4]=10; J2: maior peça é [6|5]=11 → J2 começa com [6|5]
    const hand0 = [new Tile(6, 4), new Tile(5, 2), new Tile(3, 1)];
    const hand1 = [new Tile(6, 5), new Tile(4, 2), new Tile(3, 0)];

    const { playerIndex, startTile } = determineStartingPlayer([hand0, hand1]);

    expect(playerIndex).toBe(1);
    expect(startTile.left).toBe(6);
    expect(startTile.right).toBe(5);
  });

  // -------------------------------------------------------------------------
  // Caso 2.4 — Desempate de soma pelo maior número individual
  // -------------------------------------------------------------------------
  it('Deve desempatar soma igual pelo maior número individual', () => {
    // J1: [6|3]=9, maior_individual=6 ; J2: [5|4]=9, maior_individual=5 → J1 vence desempate
    const hand0 = [new Tile(6, 3), new Tile(2, 1), new Tile(0, 0)];
    // Note: [0|0] é dupla, mas como estamos testando a lógica de maior soma, as
    // duplas tornariam o jogador 0 elegível pela regra 2 — usamos mão sem duplas:
    const hand0NoDbl = [new Tile(6, 3), new Tile(4, 1), new Tile(3, 0)];
    const hand1 = [new Tile(5, 4), new Tile(3, 2), new Tile(2, 0)];

    const { playerIndex, startTile } = determineStartingPlayer([hand0NoDbl, hand1]);

    expect(playerIndex).toBe(0);
    expect(startTile.left).toBe(6);
    expect(startTile.right).toBe(3);
  });
});
