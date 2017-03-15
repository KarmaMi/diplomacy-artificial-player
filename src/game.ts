import * as diplomacy from "js-diplomacy"

export class HistoryElement<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus> {
  constructor (
    public board: diplomacy.board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>,
    public orders: Set<diplomacy.rule.Order<Power, MilitaryBranch>>
  ) {}
}

export class Game<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus> {
  constructor (
    public history: Array<HistoryElement<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>>,
    public board: diplomacy.board.Board<Power, MilitaryBranch, State, UnitStatus, ProvinceStatus>
  ) {}
}
