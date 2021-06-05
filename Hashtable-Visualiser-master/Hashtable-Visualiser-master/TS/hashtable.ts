const enum ModelMessages {
  Searching,
  Found,
  UpdateVal,
  ExpandArray,
  NotFound,
}

// implementation of a hashtable with linear probing
class HashTable {
  private readonly notifyController: (message: ModelMessages, arg: any) => void;
  private readonly LOAD_FACTOR: number;
  private keys: (number | null)[];
  private entryCount: number;
  private arrayLength: number;

  constructor(
    initialCapacity: number,
    notify: (message: ModelMessages, arg: any) => void
  ) {
    this.notifyController = notify;
    this.LOAD_FACTOR = 0.75;
    this.keys = [];
    this.entryCount = 0;
    this.arrayLength = initialCapacity;
  }

  public async add(key: number): Promise<void> {
    let index;
    let offset = 0;

    do {
      index = this.hashFunction(key + offset);
      offset++;
      await this.notifyController(ModelMessages.Searching, index);
    } while (this.keys[index] !== undefined && this.keys[index] !== key);

    await this.notifyController(ModelMessages.Found, index);
    await this.notifyController(ModelMessages.UpdateVal, [index, key]);

    this.entryCount += this.keys[index] === undefined ? 1 : 0;
    this.keys[index] = key;
    this.handleArrayResize();
  }

  public async contains(key: number): Promise<boolean> {
    return (await this.getIndexOfKey(key)) !== -1;
  }

  public clear(): void {
    this.keys = [];
    this.entryCount = 0;
  }

  public async delete(key: number): Promise<boolean> {
    const index = await this.getIndexOfKey(key);

    if (index === -1) {
      return false;
    }

    this.keys[index] = null;

    await this.notifyController(ModelMessages.UpdateVal, [index, null]);

    return true;
  }

  private handleArrayResize(): void {
    if (this.arrayLength * this.LOAD_FACTOR < this.entryCount) {
      this.expandArray();
    }
  }

  private hashFunction(arg: number): number {
    return Math.abs(arg) % this.arrayLength;
  }

  private async expandArray(): Promise<void> {
    const oldKeyArray = this.keys;

    this.clear();
    this.arrayLength *= 2;
    await this.notifyController(ModelMessages.ExpandArray, this.arrayLength);

    for (let i = 0; i < this.arrayLength / 2; i++) {
      if (oldKeyArray[i] !== undefined && oldKeyArray[i] !== null) {
        await this.add(<number>oldKeyArray[i]);
      }
    }
  }

  private async getIndexOfKey(key: number): Promise<number> {
    let index;
    let offset = 0;

    do {
      index = this.hashFunction(key + offset);
      await this.notifyController(ModelMessages.Searching, index);

      if (this.keys[index] === undefined) {
        await this.notifyController(ModelMessages.NotFound, index);
        return -1;
      }

      offset++;
    } while (this.keys[index] !== key);

    await this.notifyController(ModelMessages.Found, index);

    return index;
  }
}
