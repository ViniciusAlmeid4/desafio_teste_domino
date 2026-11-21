/**
 * Suíte 3: Encaixe e Movimentação
 *
 * Valida:
 *   - Encaixe de peça compatível e atualização correta das extremidades;
 *   - Rejeição de peça incompatível com lançamento de erro;
 *   - Encaixe nas duas extremidades (esquerda e direita);
 *   - Colocação da primeira peça (mesa vazia).
 */

const { Tile, Board } = require('../src/domino');

describe('3. Encaixe e Movimentação', () => {
  // -------------------------------------------------------------------------
  // Caso 3.1 — Encaixe compatível e atualização das extremidades
  // -------------------------------------------------------------------------
  it('Deve encaixar peça compatível na extremidade direita e atualizar extremidades', () => {
    const board = new Board();
    board.placeFirst(new Tile(6, 4)); // mesa: [6|4]  → left=6, right=4

    // Jogador baixa [4|2] na ponta direita (4)
    board.place(new Tile(4, 2), 'right');

    const { left, right } = board.getEnds();
    expect(left).toBe(6);
    expect(right).toBe(2);
  });

  it('Deve encaixar peça compatível na extremidade esquerda e atualizar extremidades', () => {
    const board = new Board();
    board.placeFirst(new Tile(6, 4)); // mesa: left=6, right=4

    // Jogador baixa [3|6] na ponta esquerda (6)
    board.place(new Tile(3, 6), 'left');

    const { left, right } = board.getEnds();
    expect(left).toBe(3);
    expect(right).toBe(4);
  });

  it('Deve encaixar uma sequência de peças e manter extremidades corretas', () => {
    const board = new Board();
    board.placeFirst(new Tile(5, 5)); // left=5, right=5

    board.place(new Tile(5, 3), 'right'); // right=3
    board.place(new Tile(1, 5), 'left');  // left=1
    board.place(new Tile(3, 2), 'right'); // right=2

    const { left, right } = board.getEnds();
    expect(left).toBe(1);
    expect(right).toBe(2);
  });

  // -------------------------------------------------------------------------
  // Caso 3.2 — Rejeição de peça incompatível
  // -------------------------------------------------------------------------
  it('Deve rejeitar jogada com peça incompatível na extremidade esquerda', () => {
    const board = new Board();
    board.placeFirst(new Tile(6, 2)); // left=6, right=2

    // Peça [5|3] não casa com 6 (esquerda)
    expect(() => board.place(new Tile(5, 3), 'left')).toThrow();
  });

  it('Deve rejeitar jogada com peça incompatível na extremidade direita', () => {
    const board = new Board();
    board.placeFirst(new Tile(6, 2)); // left=6, right=2

    // Peça [5|3] não casa com 2 (direita)
    expect(() => board.place(new Tile(5, 3), 'right')).toThrow();
  });

  it('Deve manter estado da mesa inalterado após jogada inválida', () => {
    const board = new Board();
    board.placeFirst(new Tile(6, 2)); // left=6, right=2

    try {
      board.place(new Tile(5, 3), 'right');
    } catch (_) {
      // esperado
    }

    // Extremidades não devem ter mudado
    const { left, right } = board.getEnds();
    expect(left).toBe(6);
    expect(right).toBe(2);
    // Cadeia não cresceu
    expect(board.chain).toHaveLength(1);
  });

  // -------------------------------------------------------------------------
  // Caso 3.3 — Primeira peça (mesa vazia)
  // -------------------------------------------------------------------------
  it('Deve colocar a primeira peça e definir as extremidades corretamente', () => {
    const board = new Board();
    expect(board.isEmpty()).toBe(true);

    board.placeFirst(new Tile(3, 5));

    expect(board.isEmpty()).toBe(false);
    const { left, right } = board.getEnds();
    expect(left).toBe(3);
    expect(right).toBe(5);
  });

  // -------------------------------------------------------------------------
  // Caso 3.4 — canPlace
  // -------------------------------------------------------------------------
  it('canPlace deve retornar true para peça que casa com alguma extremidade', () => {
    const board = new Board();
    board.placeFirst(new Tile(6, 4)); // left=6, right=4

    expect(board.canPlace(new Tile(6, 2))).toBe(true); // casa na esquerda
    expect(board.canPlace(new Tile(4, 1))).toBe(true); // casa na direita
    expect(board.canPlace(new Tile(6, 4))).toBe(true); // casa nos dois lados
  });

  it('canPlace deve retornar false para peça sem nenhum lado compatível', () => {
    const board = new Board();
    board.placeFirst(new Tile(6, 4)); // left=6, right=4

    expect(board.canPlace(new Tile(5, 3))).toBe(false);
    expect(board.canPlace(new Tile(2, 1))).toBe(false);
  });

  it('canPlace deve retornar true para qualquer peça quando a mesa está vazia', () => {
    const board = new Board();
    expect(board.canPlace(new Tile(0, 0))).toBe(true);
    expect(board.canPlace(new Tile(6, 6))).toBe(true);
  });
});
