import * as chai from "chai"
import * as diplomacy from "js-diplomacy"
import { Player } from "./../src/player"
import { Game } from "./../src/game"

const should = chai.should()

class MockPlayer extends Player<string, string, string, string, string> {
  constructor (
    power: string, private procedure: (game: Game<string, string, string, string, string>) => void
  ) {
    super(power)
  }
  protected findNextOrders (
    game: Game<string, string, string, string, string>,
    callback?: (progress: number) => void
  ): Set<diplomacy.rule.Order<string, string>> {
    if (callback) {
      callback(0)
    }

    this.procedure(game)

    if (callback) {
      callback(1)
    }
    return new Set()
  }
}

describe("A player", () => {
  const b = new diplomacy.board.Board(
    new diplomacy.board.DiplomacyMap<string, string>(
      new diplomacy.graph.LabeledUndirectedGraph<diplomacy.board.Location<string, string>, Set<string>>([])
    ),
    "", new Set(), new Map(), new Map()
  )
  it("stores previous boards and orders.", () => {
    let historyNum = 0

    const p = new MockPlayer("foo", (game) => {
      game.history.length.should.equal(historyNum)
    })

    const orders = p.nextState(new Set(), b)
    Array.from(orders).should.have.deep.members([])

    historyNum += 1
    p.nextState(new Set(), b)
  })
})
