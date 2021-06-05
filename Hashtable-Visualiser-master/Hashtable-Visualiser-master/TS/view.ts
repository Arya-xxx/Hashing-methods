const enum ViewMessages {
  Insert,
  Search,
  Delete,
  Clear,
}

class View {
  private arrayLength: number;
  private readonly notifyController: (message: ViewMessages, arg: any) => void;
  private readonly ARRAY_WIDTH: number = 1500;

  constructor(
    defaultLength: number,
    notify: (message: ViewMessages, arg: any) => void
  ) {
    this.arrayLength = defaultLength;
    this.notifyController = notify;
    this.initialiseView();
  }

  public async highlightFound(index: number): Promise<void> {
    await this.highlightGeneric(index, "#32CD32");
  }

  public async highlightSearching(index: number): Promise<void> {
    await this.highlightGeneric(index, "#33D5FF");
  }

  public async highlightNotFound(index: number): Promise<void> {
    await this.highlightGeneric(index, "red");
  }

  public updateCellValueAt(index: number, val: number | null): void {
    if (val !== null) {
      this.getCellInDOM(index).innerHTML = `${val}`;
    } else {
      this.getCellInDOM(index).innerHTML = "⚰️";
    }
  }

  public expandArray(newSize: number): void {
    this.arrayLength = newSize;
    this.resetArray();
  }

  public resetArray(): void {
    this.clearArray();
    this.createArrayInDOM();
  }

  private async highlightGeneric(index: number, color: string): Promise<void> {
    this.getCellInDOM(index).style.backgroundColor = color;

    await this.delay();

    this.getCellInDOM(index).style.backgroundColor = "white";
  }

  private clearArray(): void {
    const array = this.getArrayinDOM(document.querySelector("#array"));

    array.innerHTML = "";
  }

  private initialiseView(): void {
    this.createArrayInDOM();
    this.addMenuClickListeners();
  }

  private addMenuClickListeners(): void {
    document
      .querySelector("#search")
      ?.addEventListener("click", () => this.searchForKey());
    document
      .querySelector("#insert")
      ?.addEventListener("click", () => this.insertKey());
    document
      .querySelector("#delete")
      ?.addEventListener("click", () => this.deleteKey());
    document
      .querySelector("#clear")
      ?.addEventListener("click", () => this.clear());
  }

  private clear(): void {
    this.notifyController(ViewMessages.Clear, null);
  }

  private async notifyControllerWithInputValue(
    inputField: HTMLInputElement | null,
    message: ViewMessages
  ): Promise<void> {
    this.blockMenuButtons();

    if (inputField !== null) {
      const input = <HTMLInputElement>inputField;

      if (!isNaN(parseInt(input.value))) {
        await this.notifyController(message, parseInt(input.value));
      }
    } else {
      throw "Input field argument was null";
    }

    this.enableMenuButtons();
  }

  private searchForKey(): void {
    this.notifyControllerWithInputValue(
      document.querySelector("#search-input"),
      ViewMessages.Search
    );
  }

  private insertKey(): void {
    this.notifyControllerWithInputValue(
      document.querySelector("#insert-input"),
      ViewMessages.Insert
    );
  }

  private deleteKey(): void {
    this.notifyControllerWithInputValue(
      document.querySelector("#delete-input"),
      ViewMessages.Delete
    );
  }

  private blockMenuButtons(): void {
    this.getButtonInDOM(document.querySelector("#search")).style.pointerEvents =
      "none";
    this.getButtonInDOM(document.querySelector("#insert")).style.pointerEvents =
      "none";
    this.getButtonInDOM(document.querySelector("#delete")).style.pointerEvents =
      "none";
    this.getButtonInDOM(document.querySelector("#clear")).style.pointerEvents =
      "none";
  }

  private enableMenuButtons(): void {
    this.getButtonInDOM(document.querySelector("#search")).style.pointerEvents =
      "auto";
    this.getButtonInDOM(document.querySelector("#insert")).style.pointerEvents =
      "auto";
    this.getButtonInDOM(document.querySelector("#delete")).style.pointerEvents =
      "auto";
    this.getButtonInDOM(document.querySelector("#clear")).style.pointerEvents =
      "auto";
  }

  private getButtonInDOM(button: HTMLButtonElement | null): HTMLButtonElement {
    if (button === null) {
      throw "Button supplied is null";
    } else {
      return <HTMLButtonElement>button;
    }
  }

  private createArrayInDOM(): void {
    const array = this.getArrayinDOM(document.querySelector("#array"));
    const row = document.createElement("tr");

    array.style.width = `${this.ARRAY_WIDTH}px`;
    array.append(row);

    for (let i = 0; i < this.arrayLength; i++) {
      row.append(this.createCellInDOM(i));
    }
  }

  private createCellInDOM(index: number): HTMLTableCellElement {
    const newCell = document.createElement("td");

    newCell.style.width = `${this.ARRAY_WIDTH / this.arrayLength}px`;
    newCell.style.height = `${this.ARRAY_WIDTH / this.arrayLength}px`;
    newCell.style.fontSize = `${(this.ARRAY_WIDTH / this.arrayLength) * 4}%`;
    newCell.className = "cell";

    return newCell;
  }

  private getCellInDOM(index: number): HTMLTableCellElement {
    const arrayDOM = this.getArrayinDOM(document.querySelector("#array"));
    const rowDOM = arrayDOM.rows[0];
    const cellDOM = rowDOM.cells[index];

    return cellDOM;
  }

  private getArrayinDOM(array: HTMLTableElement | null): HTMLTableElement {
    if (array === null) {
      throw "Element supplied is null";
    } else {
      return <HTMLTableElement>array;
    }
  }

  private delay(): Promise<string> {
    const delayTimeInMilliseconds = 300;

    return new Promise((resolve) => {
      setTimeout(resolve, delayTimeInMilliseconds);
    });
  }
}
