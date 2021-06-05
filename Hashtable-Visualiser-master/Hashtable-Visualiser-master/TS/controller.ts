const hashtable = new HashTable(8, readMessageFromModel);
const view = new View(8, readMessageFromView);

async function readMessageFromView(
  message: ViewMessages,
  arg: any
): Promise<void> {
  switch (message) {
    case ViewMessages.Search:
      await hashtable.contains(<number>arg);
      break;
    case ViewMessages.Insert:
      await hashtable.add(<number>arg);
      break;
    case ViewMessages.Delete:
      await hashtable.delete(<number>arg);
      break;
    case ViewMessages.Clear:
      hashtable.clear();
      view.resetArray();
      break;
    default:
      throw "View has notified controller with unsupported type";
  }
}

async function readMessageFromModel(
  message: ModelMessages,
  arg: any
): Promise<void> {
  switch (message) {
    case ModelMessages.Searching:
      await view.highlightSearching(<number>arg);
      break;
    case ModelMessages.Found:
      await view.highlightFound(<number>arg);
      break;
    case ModelMessages.NotFound:
      await view.highlightNotFound(<number>arg);
      break;
    case ModelMessages.UpdateVal:
      view.updateCellValueAt.apply(view, <[number, number | null]>arg);
      break;
    case ModelMessages.ExpandArray:
      view.expandArray(<number>arg);
      break;
    default:
      throw "Model has notified controller with unsupported type";
  }
}
