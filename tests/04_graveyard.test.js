/**
 * Suíte 4: Cemitério e Passagem de Vez
 *
 * A compra do cemitério é aleatória, então o Math.random é fixado em 0
 * para que o jogador sempre compre a primeira peça do monte.
 */

const { Tile, Board, Game } = require("../src/domino");

function prepararJogo({ mesa, maos, cemiterio }) {
  const game = new Game();
  game.board = new Board();
  game.board.placeFirst(mesa);
  game.hands = maos;
  game.graveyard = cemiterio;
  game.currentPlayer = 0;
  return game;
}

describe("4. Cemitério e Passagem de Vez", () => {
  beforeEach(() => {
    jest.spyOn(Math, "random").mockReturnValue(0);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("Deve comprar do cemitério até encontrar peça válida e então jogá-la", () => {
    const game = prepararJogo({
      mesa: new Tile(6, 2),
      maos: [[new Tile(1, 3), new Tile(4, 5)], [new Tile(0, 0)]],
      cemiterio: [
        new Tile(0, 1),
        new Tile(3, 5),
        new Tile(2, 1),
        new Tile(4, 4),
      ],
    });

    const compradas = game.drawUntilPlayable();

    expect(compradas.map(String)).toEqual(["[0|1]", "[3|5]", "[2|1]"]);
    expect(game.hands[0]).toHaveLength(5);
    expect(game.graveyard).toHaveLength(1);

    game.playTile(new Tile(2, 1), "right");

    expect(game.hands[0]).toHaveLength(4);
    expect(game.getBoardEnds()).toEqual({ left: 6, right: 1 });
  });

  it("Não deve comprar do cemitério quando o jogador já tem jogada", () => {
    const game = prepararJogo({
      mesa: new Tile(6, 2),
      maos: [[new Tile(2, 4)], [new Tile(0, 0)]],
      cemiterio: [new Tile(1, 1), new Tile(3, 3)],
    });

    expect(game.drawUntilPlayable()).toEqual([]);
    expect(game.hands[0]).toHaveLength(1);
    expect(game.graveyard).toHaveLength(2);
  });

  it("Deve passar a vez se cemitério esvaziar sem peça válida", () => {
    const game = prepararJogo({
      mesa: new Tile(6, 2),
      maos: [[new Tile(1, 3)], [new Tile(6, 6)]],
      cemiterio: [new Tile(4, 5)],
    });

    const compradas = game.drawUntilPlayable();
    expect(compradas).toHaveLength(1);
    expect(game.graveyard).toHaveLength(0);
    expect(game.hasPlayableTile()).toBe(false);

    const resultado = game.passTurn();

    expect(resultado.closed).toBe(false);
    expect(game.consecutivePasses).toBe(1);
    expect(game.currentPlayer).toBe(1);
    expect(game.board.chain).toHaveLength(1);
    expect(game.getBoardEnds()).toEqual({ left: 6, right: 2 });
  });

  it("Deve detectar jogo fechado após 2 passes consecutivos", () => {
    const game = prepararJogo({
      mesa: new Tile(6, 2),
      maos: [[new Tile(1, 3)], [new Tile(0, 4)]],
      cemiterio: [],
    });

    expect(game.passTurn().closed).toBe(false);
    expect(game.passTurn().closed).toBe(true);
  });

  it("Não deve fechar o jogo se o adversário ainda consegue jogar", () => {
    const game = prepararJogo({
      mesa: new Tile(6, 2),
      maos: [[new Tile(1, 3)], [new Tile(2, 5), new Tile(0, 0)]],
      cemiterio: [],
    });

    expect(game.passTurn().closed).toBe(false);

    const jogada = game.playTile(new Tile(2, 5), "right");

    expect(jogada.roundOver).toBe(false);
    expect(game.consecutivePasses).toBe(0);
    expect(game.currentPlayer).toBe(0);
  });

  it("Não deve permitir passar a vez com peça que encaixa na mão", () => {
    const game = prepararJogo({
      mesa: new Tile(6, 2),
      maos: [[new Tile(2, 3)], [new Tile(0, 0)]],
      cemiterio: [],
    });

    expect(() => game.passTurn()).toThrow();
    expect(game.consecutivePasses).toBe(0);
  });

  it("Não deve permitir passar a vez enquanto houver peças no cemitério", () => {
    const game = prepararJogo({
      mesa: new Tile(6, 2),
      maos: [[new Tile(1, 3)], [new Tile(0, 0)]],
      cemiterio: [new Tile(4, 5)],
    });

    expect(() => game.passTurn()).toThrow();
    expect(game.currentPlayer).toBe(0);
  });
});
