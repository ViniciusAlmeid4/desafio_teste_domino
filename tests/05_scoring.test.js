/**
 * Suíte 5: Pontuação da Rodada
 *
 * classifyWin recebe as pontas da mesa de antes da última jogada.
 */

const {
  Tile,
  Board,
  Game,
  classifyWin,
  resolveClosedGame,
} = require("../src/domino");

function montarMesa(primeira, ...seguintes) {
  const board = new Board();
  board.placeFirst(primeira);
  seguintes.forEach((peca) => board.place(peca, "right"));
  return board;
}

function jogoNaUltimaPeca(board, ultimaPeca) {
  const game = new Game();
  game.board = board;
  game.hands = [[ultimaPeca], [new Tile(0, 0), new Tile(1, 1)]];
  game.currentPlayer = 0;
  return game;
}

describe("5. Pontuação da Rodada", () => {
  describe("classifyWin", () => {
    it("Deve atribuir 1 ponto para batida simples em 1 ponta", () => {
      expect(classifyWin(new Tile(3, 1), { left: 3, right: 6 })).toBe(1);
    });

    it("Deve atribuir 2 pontos para batida de carroça em 1 ponta", () => {
      expect(classifyWin(new Tile(3, 3), { left: 3, right: 1 })).toBe(2);
    });

    it("Deve atribuir 3 pontos para batida simples em 2 pontas", () => {
      expect(classifyWin(new Tile(2, 5), { left: 2, right: 5 })).toBe(3);
      expect(classifyWin(new Tile(5, 2), { left: 2, right: 5 })).toBe(3);
    });

    it("Deve atribuir 4 pontos para batida de carroça em 2 pontas", () => {
      expect(classifyWin(new Tile(4, 4), { left: 4, right: 4 })).toBe(4);
    });

    it("Não deve considerar 2 pontas quando a peça simples só tem um dos valores", () => {
      expect(classifyWin(new Tile(3, 5), { left: 3, right: 3 })).toBe(1);
    });
  });

  describe("batida durante a partida", () => {
    it("Deve somar 3 pontos ao bater com [2|5] na mesa com pontas 2 e 5", () => {
      const mesa = montarMesa(new Tile(2, 3), new Tile(3, 5));
      const game = jogoNaUltimaPeca(mesa, new Tile(2, 5));

      const resultado = game.playTile(new Tile(2, 5), "left");

      expect(resultado).toEqual({
        points: 3,
        roundOver: true,
        matchOver: false,
      });
      expect(game.matchScore).toEqual([3, 0]);
    });

    it("Deve somar 4 pontos ao bater com [4|4] na mesa com pontas 4 e 4", () => {
      const mesa = montarMesa(new Tile(4, 1), new Tile(1, 2), new Tile(2, 4));
      const game = jogoNaUltimaPeca(mesa, new Tile(4, 4));

      const resultado = game.playTile(new Tile(4, 4), "right");

      expect(resultado.points).toBe(4);
      expect(game.matchScore).toEqual([4, 0]);
    });

    it("Deve somar 1 ponto ao bater com [3|5] na mesa com pontas 3 e 3", () => {
      const mesa = montarMesa(new Tile(3, 1), new Tile(1, 3));
      const game = jogoNaUltimaPeca(mesa, new Tile(3, 5));

      expect(game.playTile(new Tile(3, 5), "left").points).toBe(1);
    });
  });

  describe("jogo fechado", () => {
    it("Deve premiar o jogador com menor soma na mão", () => {
      const maos = [[new Tile(1, 3)], [new Tile(4, 5)]];

      expect(resolveClosedGame(maos)).toEqual({
        winnerIndex: 0,
        scores: [4, 9],
      });
    });

    it("Deve retornar empate (winnerIndex: -1) quando as somas são iguais", () => {
      const maos = [[new Tile(1, 3)], [new Tile(0, 4)]];

      expect(resolveClosedGame(maos).winnerIndex).toBe(-1);
    });

    it("Deve encerrar por jogo fechado e dar +1 ponto para a menor soma", () => {
      const game = new Game();
      game.board = montarMesa(new Tile(6, 2));
      game.hands = [[new Tile(1, 3)], [new Tile(4, 5)]];
      game.graveyard = [];

      game.passTurn();
      const resultado = game.passTurn();

      expect(resultado.closed).toBe(true);
      expect(game.matchScore).toEqual([1, 0]);
    });

    it("Não deve dar ponto a ninguém quando o jogo fechado termina empatado", () => {
      const game = new Game();
      game.board = montarMesa(new Tile(6, 2));
      game.hands = [[new Tile(1, 3)], [new Tile(0, 4)]];
      game.graveyard = [];

      game.passTurn();
      game.passTurn();

      expect(game.matchScore).toEqual([0, 0]);
    });
  });
});
