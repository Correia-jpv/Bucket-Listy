import * as utilities from './utilities';

class Item {
  constructor(name = "", checked = false) {
    this.name = name;
    this.checked = checked;
    this.save();
  }

  // Add or Edit
  save() {
    let ls = localStorage.getItem('bucketList');
    let bucketList;

    if (ls == null) {
      bucketList = {};
    } else {
      bucketList = JSON.parse(ls);
    }

    // Item doesn't exist yet
    if (!(this.name in bucketList)) {
      bucketList[this.name] = false;
    } else {
      bucketList[this.name] = this.checked;
    }

    localStorage.setItem('bucketList', JSON.stringify(bucketList));
  }

  // Remove
  remove() {
    let ls = localStorage.getItem('bucketList');
    let bucketList = JSON.parse(ls);

    delete bucketList[this.name];
    localStorage.setItem('bucketList', JSON.stringify(bucketList));
  }

}


export default class BucketList {
  constructor() {
    this.items = {};
  }

  populate() {
    let ls = localStorage.getItem('bucketList');

    if (ls != null && ls.length > 2) {
      this.items = JSON.parse(ls);
    } else {
      this.newRandomItems();
    }
  }

  setItem(name = "", checked = false) {
    let item = new Item(name, checked);
    this.items[item.name] = item.checked;
  }

  getItem(name) {
    return this.items[name];
  }

  removeItem(name = "") {
    let item = new Item(name);
    item.remove();
  }


  set setItems(items = {}) {
    for (const item in items) {
      let _item = new Item(item, items[item]);
      this.setItem(_item.name, _item.checked);
    }
  }

  get getItems() {
    return this.items;
  }

  // Get current number of items in bucket list
  get numberOfItems() {
    return Object.keys(this.items).length;
  }

  // Create New Random Items
  newRandomItems(countItems = 4) {
    const randomItems = require('./bucketList.json');
    let ls = localStorage.getItem('bucketList');
    const lsBucketList = JSON.parse(ls) || {};
    let initialItemsLength = this.numberOfItems;

    // Grab new unique item
    let currentItemsLength = initialItemsLength;
    while (currentItemsLength < initialItemsLength + countItems) {
      let item = utilities.getRandomElementsFromArray(randomItems, 1);
      if (!(item in lsBucketList)) {
        currentItemsLength++;
        this.setItem(item, false);
      }
    }
  }
}