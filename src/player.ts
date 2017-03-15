import * as diplomacy from "js-diplomacy"
import { HistoryElement, Game } from "./game"

export abstract class Player<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus> {
  private game: Game<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus> | null
  constructor (protected power: Power) {
    this.game = null
  }

  nextState (
    previousOrders: Set<diplomacy.rule.Order<Power, MilitaryBranch>>,
    board: diplomacy.board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
    callback?: (progress: number) => void
  ): Set<diplomacy.rule.Order<Power, MilitaryBranch>> {
    const game = (this.game === null)
      ? new Game([], board)
      : new Game([...this.game.history, new HistoryElement(this.game.board, previousOrders)], board)
    this.game = game
    return this.findNextOrders(game, callback)
  }

  protected abstract findNextOrders (
    game: Game<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
    callback?: (progress: number) => void
  ): Set<diplomacy.rule.Order<Power, MilitaryBranch>>
}
