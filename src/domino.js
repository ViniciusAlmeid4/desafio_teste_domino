/**
 * domino.js
 * Motor do jogo de Dominó para 2 jogadores.
 *
 * Exporta as classes e funções utilizadas tanto pelo jogo quanto pelos testes.
 */

// ---------------------------------------------------------------------------
// 1. PEÇA (Tile)
// ---------------------------------------------------------------------------

/**
 * Representa uma peça de dominó com dois lados (left, right).
 */
class Tile {
  /**
   * @param {number} left  - Valor do lado esquerdo (0–6)
   * @param {number} right - Valor do lado direito  (0–6)
   */
  constructor(left, right) {
    this.left = left;
    this.right = right;
  }

  /** Retorna true se a peça é uma carroça (dupla). */
  isDouble() {
    return this.left === this.right;
  }

  /** Soma dos dois lados. */
  sum() {
    return this.left + this.right;
  }

  /** Maior valor individual da peça. */
  maxSide() {
    return Math.max(this.left, this.right);
  }

  /** Verifica se a peça possui o valor `v` em algum dos lados. */
  hasSide(v) {
    return this.left === v || this.right === v;
  }

  /**
   * Retorna a peça orientada de forma que `matchSide` fique à esquerda
   * (útil para encaixar na extremidade esquerda da mesa).
   */
  orientedLeft(matchSide) {
    if (this.left === matchSide) return { left: this.left, right: this.right };
    return { left: this.right, right: this.left };
  }

  /**
   * Retorna a peça orientada de forma que `matchSide` fique à direita
   * (útil para encaixar na extremidade direita da mesa).
   */
  orientedRight(matchSide) {
    if (this.right === matchSide) return { left: this.left, right: this.right };
    return { left: this.right, right: this.left };
  }

  toString() {
    return `[${this.left}|${this.right}]`;
  }
}

// ---------------------------------------------------------------------------
// 2. GERAÇÃO E EMBARALHAMENTO DO BARALHO
// ---------------------------------------------------------------------------

/**
 * Gera o conjunto completo de 28 peças únicas de dominó ([0|0] a [6|6]).
 * @returns {Tile[]}
 */
function generateFullSet() {
  const tiles = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      tiles.push(new Tile(i, j));
    }
  }
  return tiles; // 28 peças
}

/**
 * Embaralha um array in-place usando o algoritmo Fisher-Yates.
 * @param {any[]} arr
 * @returns {any[]} O mesmo array embaralhado
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------------------
// 3. DISTRIBUIÇÃO DAS PEÇAS
// ---------------------------------------------------------------------------

/**
 * Distribui as peças para 2 jogadores e retorna as mãos e o cemitério.
 *
 * @param {Tile[]} [tiles] - Conjunto de peças (padrão: baralho completo embaralhado)
 * @returns {{ hands: [Tile[], Tile[]], graveyard: Tile[] }}
 */
function dealTiles(tiles) {
  const deck = tiles ? [...tiles] : shuffle(generateFullSet());
  const hand0 = deck.splice(0, 6);
  const hand1 = deck.splice(0, 6);
  return { hands: [hand0, hand1], graveyard: deck };
}

// ---------------------------------------------------------------------------
// 4. DEFINIÇÃO DE QUEM INICIA A RODADA
// ---------------------------------------------------------------------------

/**
 * Determina qual jogador inicia a rodada e qual peça deve ser baixada primeiro,
 * seguindo a hierarquia:
 *   1. Duplo-6
 *   2. Maior dupla
 *   3. Maior soma (desempate: maior número individual)
 *
 * @param {Tile[][]} hands - Array com as 2 mãos dos jogadores
 * @returns {{ playerIndex: number, startTile: Tile }}
 */
function determineStartingPlayer(hands) {
  // 1. Procura o duplo-6
  for (let i = 0; i < hands.length; i++) {
    const double6 = hands[i].find((t) => t.left === 6 && t.right === 6);
    if (double6) return { playerIndex: i, startTile: double6 };
  }

  // 2. Maior dupla entre todos os jogadores
  let bestDoublePlayer = -1;
  let bestDoubleValue = -1;
  let bestDoubleTile = null;

  for (let i = 0; i < hands.length; i++) {
    const doubles = hands[i].filter((t) => t.isDouble());
    for (const t of doubles) {
      if (t.left > bestDoubleValue) {
        bestDoubleValue = t.left;
        bestDoublePlayer = i;
        bestDoubleTile = t;
      }
    }
  }

  if (bestDoublePlayer !== -1) {
    return { playerIndex: bestDoublePlayer, startTile: bestDoubleTile };
  }

  // 3. Maior soma (desempate pelo maior número individual)
  let bestSumPlayer = 0;
  let bestSumTile = null;
  let bestSum = -1;
  let bestMax = -1;

  for (let i = 0; i < hands.length; i++) {
    for (const t of hands[i]) {
      const s = t.sum();
      const m = t.maxSide();
      if (s > bestSum || (s === bestSum && m > bestMax)) {
        bestSum = s;
        bestMax = m;
        bestSumPlayer = i;
        bestSumTile = t;
      }
    }
  }

  return { playerIndex: bestSumPlayer, startTile: bestSumTile };
}

// ---------------------------------------------------------------------------
// 5. MESA (Board)
// ---------------------------------------------------------------------------

/**
 * Representa a cadeia de peças na mesa e suas extremidades abertas.
 */
class Board {
  constructor() {
    /** @type {Tile[]} cadeia de peças já jogadas */
    this.chain = [];
    /** Extremidade esquerda aberta */
    this.leftEnd = null;
    /** Extremidade direita aberta */
    this.rightEnd = null;
  }

  /** Verifica se a mesa ainda está vazia. */
  isEmpty() {
    return this.chain.length === 0;
  }

  /**
   * Coloca a primeira peça na mesa (abre a cadeia).
   * @param {Tile} tile
   */
  placeFirst(tile) {
    this.chain.push(tile);
    this.leftEnd = tile.left;
    this.rightEnd = tile.right;
  }

  /**
   * Verifica se a peça `tile` pode ser jogada em alguma das extremidades.
   * @param {Tile} tile
   * @returns {boolean}
   */
  canPlace(tile) {
    if (this.isEmpty()) return true;
    return tile.hasSide(this.leftEnd) || tile.hasSide(this.rightEnd);
  }

  /**
   * Encaixa `tile` na extremidade `side` ('left' ou 'right').
   * Lança erro se a jogada for inválida.
   *
   * @param {Tile} tile
   * @param {'left'|'right'} side - Extremidade escolhida
   */
  place(tile, side) {
    if (this.isEmpty()) {
      this.placeFirst(tile);
      return;
    }

    if (side === "left") {
      if (!tile.hasSide(this.leftEnd)) {
        throw new Error(
          `Jogada inválida: ${tile} não possui lado ${this.leftEnd} (extremidade esquerda).`,
        );
      }
      // O lado que casa fica "para dentro"; o outro lado vira a nova extremidade
      const oriented = tile.orientedLeft(this.leftEnd);
      this.chain.unshift(new Tile(oriented.left, oriented.right));
      this.leftEnd = oriented.right; // o lado livre agora é o direito da peça virada
    } else if (side === "right") {
      if (!tile.hasSide(this.rightEnd)) {
        throw new Error(
          `Jogada inválida: ${tile} não possui lado ${this.rightEnd} (extremidade direita).`,
        );
      }
      const oriented = tile.orientedRight(this.rightEnd);
      this.chain.push(new Tile(oriented.left, oriented.right));
      this.rightEnd = oriented.left; // o lado livre é o esquerdo da peça virada
    } else {
      throw new Error('Extremidade inválida: use "left" ou "right".');
    }
  }

  /**
   * Retorna as extremidades abertas da mesa.
   * @returns {{ left: number|null, right: number|null }}
   */
  getEnds() {
    return { left: this.leftEnd, right: this.rightEnd };
  }
}

// ---------------------------------------------------------------------------
// 6. LÓGICA DE PONTUAÇÃO DA RODADA
// ---------------------------------------------------------------------------

/**
 * Classifica o tipo de batida e retorna os pontos ganhos.
 *
 * @param {Tile} lastTile - A última peça baixada
 * @param {{ left: number, right: number }} ends - Pontas da mesa antes da jogada
 * @returns {number} Pontos (1, 2, 3 ou 4)
 */
function classifyWin(lastTile, ends) {
  const { left, right } = ends;

  if (lastTile.isDouble()) {
    const twoEnds = left === right && lastTile.left === left;
    return twoEnds ? 4 : 2;
  }

  const twoEnds =
    left !== right && lastTile.hasSide(left) && lastTile.hasSide(right);
  return twoEnds ? 3 : 1;
}

/**
 * Determina o vencedor do jogo fechado (trancado).
 * Retorna o índice do jogador com menor soma, ou -1 em caso de empate.
 *
 * @param {Tile[][]} hands - Mãos dos jogadores
 * @returns {{ winnerIndex: number, scores: number[] }}
 */
function resolveClosedGame(hands) {
  const scores = hands.map((hand) => hand.reduce((acc, t) => acc + t.sum(), 0));
  if (scores[0] < scores[1]) return { winnerIndex: 0, scores };
  if (scores[1] < scores[0]) return { winnerIndex: 1, scores };
  return { winnerIndex: -1, scores }; // empate
}

// ---------------------------------------------------------------------------
// 7. MOTOR DA PARTIDA (Game)
// ---------------------------------------------------------------------------

/**
 * Gerencia o estado completo de uma partida de dominó para 2 jogadores.
 */
class Game {
  constructor() {
    /** Placar geral da partida [jogador0, jogador1] */
    this.matchScore = [0, 0];
    /** Mãos atuais dos jogadores */
    this.hands = [[], []];
    /** Cemitério */
    this.graveyard = [];
    /** Mesa */
    this.board = new Board();
    /** Índice do jogador atual */
    this.currentPlayer = 0;
    /** Contador de passes consecutivos */
    this.consecutivePasses = 0;
    /** true se a partida já terminou */
    this.isOver = false;
    /** Índice do vencedor da partida (-1 = nenhum ainda) */
    this.matchWinner = -1;
  }

  /**
   * Inicializa (ou reinicia) uma rodada com um baralho opcional.
   * @param {Tile[]} [customDeck] - Baralho pré-ordenado (para testes)
   */
  startRound(customDeck) {
    const { hands, graveyard } = dealTiles(customDeck);
    this.hands = hands;
    this.graveyard = graveyard;
    this.board = new Board();
    this.consecutivePasses = 0;

    const { playerIndex, startTile } = determineStartingPlayer(this.hands);
    this.currentPlayer = playerIndex;

    // Remove a peça inicial da mão do jogador e joga na mesa
    const tileIdx = this.hands[playerIndex].findIndex(
      (t) => t.left === startTile.left && t.right === startTile.right,
    );
    this.hands[playerIndex].splice(tileIdx, 1);
    this.board.placeFirst(startTile);
  }

  /**
   * Tenta jogar a peça `tile` na extremidade `side`.
   * @param {Tile}          tile
   * @param {'left'|'right'} side
   * @returns {{ points: number|null, roundOver: boolean, matchOver: boolean }}
   */
  playTile(tile, side) {
    const pi = this.currentPlayer;
    const hand = this.hands[pi];

    // Valida que a peça está na mão do jogador
    const tileIdx = hand.findIndex(
      (t) => t.left === tile.left && t.right === tile.right,
    );
    if (tileIdx === -1) {
      throw new Error(`O jogador ${pi} não possui a peça ${tile} em sua mão.`);
    }

    const endsBefore = this.board.getEnds();
    // Encaixa na mesa (pode lançar erro se inválido)
    this.board.place(tile, side);

    // Remove da mão
    hand.splice(tileIdx, 1);
    this.consecutivePasses = 0;

    // Verifica batida
    if (hand.length === 0) {
      const pts = classifyWin(tile, endsBefore);
      this._addScore(pi, pts);
      return { points: pts, roundOver: true, matchOver: this.isOver };
    }

    this._nextTurn();
    return { points: null, roundOver: false, matchOver: false };
  }

  /**
   * Compra uma peça do cemitério.
   * @returns {Tile|null} A peça comprada, ou null se cemitério vazio.
   */
  drawFromGraveyard() {
    if (this.graveyard.length === 0) return null;
    const idx = Math.floor(Math.random() * this.graveyard.length);
    const [tile] = this.graveyard.splice(idx, 1);
    this.hands[this.currentPlayer].push(tile);
    return tile;
  }

  hasPlayableTile() {
    return this.hands[this.currentPlayer].some((t) => this.board.canPlace(t));
  }

  // Retorna as peças compradas (vazio se o jogador já tinha jogada).
  drawUntilPlayable() {
    const drawn = [];
    while (!this.hasPlayableTile() && this.graveyard.length > 0) {
      drawn.push(this.drawFromGraveyard());
    }
    return drawn;
  }

  /**
   * Passa a vez do jogador atual (incrementa passes consecutivos).
   * @returns {{ closed: boolean, matchOver: boolean }}
   */
  passTurn() {
    if (this.hasPlayableTile()) {
      throw new Error(
        `O jogador ${this.currentPlayer} possui jogada e não pode passar a vez.`,
      );
    }
    if (this.graveyard.length > 0) {
      throw new Error(
        "Ainda há peças no cemitério: o jogador deve comprar antes de passar.",
      );
    }

    this.consecutivePasses++;
    if (this.consecutivePasses >= 2) {
      // Jogo fechado
      const { winnerIndex } = resolveClosedGame(this.hands);
      if (winnerIndex !== -1) {
        this._addScore(winnerIndex, 1);
      }
      return { closed: true, matchOver: this.isOver };
    }
    this._nextTurn();
    return { closed: false, matchOver: false };
  }

  /** Avança para o próximo jogador. */
  _nextTurn() {
    this.currentPlayer = (this.currentPlayer + 1) % 2;
  }

  /** Adiciona pontos ao placar e verifica vitória. */
  _addScore(playerIndex, pts) {
    this.matchScore[playerIndex] += pts;
    if (this.matchScore[playerIndex] >= 10) {
      this.isOver = true;
      this.matchWinner = playerIndex;
    }
  }

  /** Retorna as extremidades abertas da mesa. */
  getBoardEnds() {
    return this.board.getEnds();
  }
}

// ---------------------------------------------------------------------------
// EXPORTS
// ---------------------------------------------------------------------------

module.exports = {
  Tile,
  Board,
  Game,
  generateFullSet,
  shuffle,
  dealTiles,
  determineStartingPlayer,
  classifyWin,
  resolveClosedGame,
};
