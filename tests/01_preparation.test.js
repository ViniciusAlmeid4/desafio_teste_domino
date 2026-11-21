/**
 * Suíte 1: Preparação e Distribuição
 *
 * Valida a geração do baralho completo de 28 peças únicas e a distribuição
 * inicial para 2 jogadores (6 peças cada, 16 no cemitério).
 */

const { Tile, generateFullSet, dealTiles } = require('../src/domino');

describe('1. Preparação e Distribuição', () => {
  // -------------------------------------------------------------------------
  // Caso 1.1 — Geração do baralho completo
  // -------------------------------------------------------------------------
  it('Deve gerar baralho completo de dominó com 28 peças únicas', () => {
    const tiles = generateFullSet();

    // Deve conter exatamente 28 peças
    expect(tiles).toHaveLength(28);

    // Todas devem ser instâncias de Tile
    tiles.forEach(t => expect(t).toBeInstanceOf(Tile));

    // Não deve haver duplicatas: cada par (left, right) deve ser único
    const keys = tiles.map(t => `${t.left}|${t.right}`);
    const unique = new Set(keys);
    expect(unique.size).toBe(28);
  });

  it('Deve conter todas as peças de [0|0] até [6|6]', () => {
    const tiles = generateFullSet();
    for (let i = 0; i <= 6; i++) {
      for (let j = i; j <= 6; j++) {
        const found = tiles.some(t => t.left === i && t.right === j);
        expect(found).toBe(true);
      }
    }
  });

  it('Nenhuma peça deve ter valor fora do intervalo 0–6', () => {
    const tiles = generateFullSet();
    tiles.forEach(t => {
      expect(t.left).toBeGreaterThanOrEqual(0);
      expect(t.left).toBeLessThanOrEqual(6);
      expect(t.right).toBeGreaterThanOrEqual(0);
      expect(t.right).toBeLessThanOrEqual(6);
    });
  });

  // -------------------------------------------------------------------------
  // Caso 1.2 — Distribuição das mãos iniciais
  // -------------------------------------------------------------------------
  it('Deve distribuir mãos iniciais corretamente: 6 peças por jogador e 16 no cemitério', () => {
    const { hands, graveyard } = dealTiles();

    expect(hands).toHaveLength(2);
    expect(hands[0]).toHaveLength(6);
    expect(hands[1]).toHaveLength(6);
    expect(graveyard).toHaveLength(16);
  });

  it('Nenhuma peça deve aparecer em dois lugares ao mesmo tempo', () => {
    const { hands, graveyard } = dealTiles();
    const all = [...hands[0], ...hands[1], ...graveyard];

    expect(all).toHaveLength(28);

    const keys = all.map(t => `${t.left}|${t.right}`);
    const unique = new Set(keys);
    expect(unique.size).toBe(28);
  });

  it('Deve aceitar um baralho customizado e distribuir as primeiras 12 peças', () => {
    const customDeck = generateFullSet(); // ordem fixa
    const { hands, graveyard } = dealTiles(customDeck);

    // As 6 primeiras do deck vão para o jogador 0
    expect(hands[0][0].left).toBe(customDeck[0].left);
    expect(hands[0][0].right).toBe(customDeck[0].right);

    // As 6 seguintes vão para o jogador 1
    expect(hands[1][0].left).toBe(customDeck[6].left);
    expect(hands[1][0].right).toBe(customDeck[6].right);

    // O restante fica no cemitério
    expect(graveyard).toHaveLength(16);
  });
});
