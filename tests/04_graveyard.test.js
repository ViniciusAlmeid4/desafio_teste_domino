/**
 * Suíte 4: Cemitério e Passagem de Vez
 *
 * ⚠️  ARQUIVO PARA O(A) PARCEIRO(A) COMPLETAR
 *
 * Casos de teste a implementar (seguindo a spec e os exemplos das suítes 1-3):
 *
 *  4.1 — Deve comprar do cemitério até encontrar peça válida e então jogá-la
 *         Cenário: Mesa com pontas 6 e 2; mão do jogador sem 6 ou 2;
 *                  a 3ª peça do monte é [2|1].
 *         Esperado: Jogador compra 3 peças (fica com +2 na mão, pois baixa a 3ª)
 *                   e baixa [2|1]; extremidade direita da mesa passa a ser 1.
 *
 *  4.2 — Deve passar a vez se cemitério esvaziar sem peça válida
 *         Cenário: Mão do jogador sem nenhum encaixe; cemitério contém 1 peça inválida.
 *         Esperado: Jogador compra a última peça (não encaixa) e passes consecutivos
 *                   é incrementado; estado da mesa permanece inalterado.
 *
 *  4.3 — Deve detectar jogo fechado após 2 passes consecutivos
 *         Cenário: Cemitério vazio; nenhum jogador consegue jogar.
 *         Esperado: Após o 2º passe, `passTurn()` retorna `{ closed: true }`.
 *
 *  4.4 — Não deve fechar o jogo se apenas 1 passe ocorreu
 *         Cenário: Apenas o jogador atual passou; o adversário ainda pode jogar.
 *         Esperado: `passTurn()` retorna `{ closed: false }`.
 *
 * COMO COMEÇAR:
 *   1. Importe o que precisar de '../src/domino';
 *   2. Crie um `describe('4. Cemitério e Passagem de Vez', () => { ... })`;
 *   3. Adicione os `it(...)` para cada caso acima;
 *   4. Use `Game` para cenários de integração ou `Board`/funções isoladas para unitários.
 *
 * DICA: Veja como as suítes 1–3 usam dados fixos (mãos customizadas, baralhos
 *       pré-ordenados) para tornar os testes determinísticos.
 */

const { Tile, Board, Game, dealTiles, generateFullSet } = require('../src/domino');

describe('4. Cemitério e Passagem de Vez', () => {
  // TODO: implementar os casos 4.1 a 4.4 descritos acima
  it.todo('Deve comprar do cemitério até encontrar peça válida e então jogá-la');
  it.todo('Deve passar a vez se cemitério esvaziar sem peça válida');
  it.todo('Deve detectar jogo fechado após 2 passes consecutivos');
  it.todo('Não deve fechar o jogo se apenas 1 passe ocorreu');
});
