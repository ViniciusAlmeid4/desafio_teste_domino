/**
 * Suíte 6: Vitória da Partida
 *
 * A partida termina quando um jogador chega a 10 pontos ou mais.
 */

const { Tile, Board, Game } = require("../src/domino");

function montarMesa(primeira, ...seguintes) {
  const board = new Board();
  board.placeFirst(primeira);
  seguintes.forEach((peca) => board.place(peca, "right"));
  return board;
}

function jogoComPlacar(placar, board, ultimaPeca) {
  const game = new Game();
  game.matchScore = placar;
  game.board = board;
  game.hands = [[ultimaPeca], [new Tile(0, 0), new Tile(1, 1)]];
  game.currentPlayer = 0;
  return game;
}

describe("6. Vitória da Partida", () => {
  it("Deve continuar a partida e iniciar nova rodada enquanto o placar for menor que 10", () => {
    const game = jogoComPlacar(
      [7, 0],
      montarMesa(new Tile(3, 1)),
      new Tile(3, 3),
    );

    const resultado = game.playTile(new Tile(3, 3), "left");

    expect(resultado).toEqual({ points: 2, roundOver: true, matchOver: false });
    expect(game.matchScore).toEqual([9, 0]);
    expect(game.isOver).toBe(false);

    game.startRound();

    const pecasNasMaos = game.hands[0].length + game.hands[1].length;
    const totalDePecas =
      pecasNasMaos + game.board.chain.length + game.graveyard.length;

    expect(pecasNasMaos).toBe(11);
    expect(game.board.chain).toHaveLength(1);
    expect(game.graveyard).toHaveLength(16);
    expect(totalDePecas).toBe(28);
    expect(game.matchScore).toEqual([9, 0]);
  });

  it("Deve finalizar a partida ao atingir exatamente 10 pontos", () => {
    const game = jogoComPlacar(
      [8, 0],
      montarMesa(new Tile(3, 1)),
      new Tile(3, 3),
    );

    const resultado = game.playTile(new Tile(3, 3), "left");

    expect(resultado.matchOver).toBe(true);
    expect(game.matchScore).toEqual([10, 0]);
    expect(game.isOver).toBe(true);
    expect(game.matchWinner).toBe(0);
  });

  it("Deve finalizar a partida ao ultrapassar 10 pontos", () => {
    const mesa = montarMesa(new Tile(4, 1), new Tile(1, 2), new Tile(2, 4));
    const game = jogoComPlacar([9, 0], mesa, new Tile(4, 4));

    game.playTile(new Tile(4, 4), "right");

    expect(game.matchScore).toEqual([13, 0]);
    expect(game.isOver).toBe(true);
    expect(game.matchWinner).toBe(0);
  });

  it("Não deve encerrar a partida com 9 pontos", () => {
    const game = jogoComPlacar(
      [8, 0],
      montarMesa(new Tile(3, 6)),
      new Tile(3, 1),
    );

    const resultado = game.playTile(new Tile(3, 1), "left");

    expect(resultado.points).toBe(1);
    expect(game.matchScore).toEqual([9, 0]);
    expect(game.isOver).toBe(false);
    expect(game.matchWinner).toBe(-1);
  });

  it("Deve finalizar a partida quando o ponto da vitória vem de um jogo fechado", () => {
    const game = new Game();
    game.matchScore = [0, 9];
    game.board = montarMesa(new Tile(6, 2));
    game.hands = [[new Tile(4, 5)], [new Tile(1, 3)]];
    game.graveyard = [];

    game.passTurn();
    const resultado = game.passTurn();

    expect(resultado).toEqual({ closed: true, matchOver: true });
    expect(game.matchScore).toEqual([0, 10]);
    expect(game.matchWinner).toBe(1);
  });
});
