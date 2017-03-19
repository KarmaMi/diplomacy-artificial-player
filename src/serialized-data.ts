export class SerializedData {
  data: Uint8Array
  private firstEmptyIndex: number
  private lastAvailableIndex: number | null

  constructor (length: number);
  constructor (data: Uint8Array);
  constructor (arg: number | Uint8Array) {
    if (arg instanceof Uint8Array) {
      this.data = arg
      this.firstEmptyIndex = this.data.length
      this.lastAvailableIndex = 0
    } else {
      this.data = new Uint8Array(arg)
      this.firstEmptyIndex = 0
      this.lastAvailableIndex = null
    }
  }

  append(data: number, bytes: number): SerializedData;
  append(data: Uint8Array): SerializedData;
  append(arg1: number | Uint8Array, arg2?: number): SerializedData {
    console.assert(this.firstEmptyIndex < this.data.length)

    if (arg1 instanceof Uint8Array) {
      console.assert(this.firstEmptyIndex + arg1.length <= this.data.length)
      for (let i = 0; i < arg1.length; i++) {
        this.data[this.firstEmptyIndex] = arg1[i]
        this.firstEmptyIndex += 1
      }
    } else {
      if (arg2 === undefined) {
        throw null
      }

      console.assert(0 <= arg2 && arg2 <= 4)
      console.assert(this.firstEmptyIndex + arg2 <= this.data.length)
      for (let i = 0; i < arg2; i++) {
        this.data[this.firstEmptyIndex] = ((arg1 >>> 0) >> (8 * i)) & 0xff
        this.firstEmptyIndex += 1
      }
    }

    this.lastAvailableIndex = this.lastAvailableIndex || 0

    return this
  }

  consume (length: number): SerializedData {
    console.assert(this.lastAvailableIndex !== null)
    if (this.lastAvailableIndex === null) {
      throw null
    }

    console.assert(this.lastAvailableIndex + length <= this.data.length)
    const value = new Uint8Array(length)

    for (let i = 0; i < length; i++) {
      value[i] = this.data[this.lastAvailableIndex]
      this.lastAvailableIndex += 1
    }

    return new SerializedData(value)
  }

  toInteger (): number | null {
    if (this.data.length <= 4) {
      let value = 0
      if (this.data[0]) {
        value |= this.data[0]
      }
      if (this.data[1]) {
        value |= (this.data[1] << 8)
      }
      if (this.data[2]) {
        value |= (this.data[2] << 16)
      }
      if (this.data[3]) {
        value |= (this.data[3] << 24)
      }
      return value
    } else {
      return null
    }
  }

  toString(): string {
    return Array.from(this.data).map(d => (d >>> 0).toString(16)).join(' ')
  }
}
