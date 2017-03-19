import * as chai from "chai"
import * as diplomacy from "js-diplomacy"
import { SerializedData } from "./../src/serialized-data"

const should = chai.should()


describe("Serialized data", () => {
  it("creates an array with the constant length.", () => {
    const d = new SerializedData(10)
    d.data.length.should.equal(10)
  })
  it("can be created from the byte-array.", () => {
    const d = new SerializedData(Uint8Array.from([0x00, 0xff]))
    d.data.length.should.equal(2)
  })
  it("creates 32-bit integer if the target is in 32bit.", () => {
    const d1 = new SerializedData(Uint8Array.from([0x00, 0xff]))
    should.equal(d1.toInteger(), 0xff00)

    const d2 = new SerializedData(Uint8Array.from([0x00, 0x00, 0x00, 0x01, 0x02]))
    should.equal(d2.toInteger(), null)
  })

  it("appends data.", () => {
    const d = new SerializedData(4)
    // 00 02 01 ff
    d.append(Uint8Array.from([0x00, 0x02]))
    d.append(Uint8Array.from([0x01, 0xff]))
    should.equal(d.toInteger(), (0xff010200) >> 0)

    should.throw(() => d.append(Uint8Array.from([0x00, 0x01])))
  })

  it("extracts the head sub-array.", () => {
    const d = new SerializedData(Uint8Array.from([0x00, 0x02, 0x01, 0xff]))
    const d1 = d.consume(2)
    const d2 = d.consume(2)

    should.equal(d1.toInteger(), 0x0200)
    should.equal(d2.toInteger(), 0xff01)

    should.throw(() => d.consume(2))
  })

  it("appends the data using number (32bit integer).", () => {
    const d = new SerializedData(3)
    d.append(0x000102, 3)
    Array.from(d.data).should.deep.equal([2, 1, 0])

    should.throw(() => new SerializedData(5).append(0, 5))
  })
})
