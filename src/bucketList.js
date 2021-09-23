import * as utilities from './utilities';
const api_url = "https://bucketlisty-api.herokuapp.com/api/";

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

    // Verify if item already exists
    (!(this.name in bucketList)) ? this.addItemToDB(): this.updateItemToDB();

    bucketList[this.name] = this.checked;

    localStorage.setItem('bucketList', JSON.stringify(bucketList));
  }

  // Remove
  async remove() {
    await this.removeItemFromDB();

    let ls = localStorage.getItem('bucketList');
    let bucketList = JSON.parse(ls);

    delete bucketList[this.name];
    localStorage.setItem('bucketList', JSON.stringify(bucketList));
  }

  async addItemToDB() {
    // Verify if user's token is present
    const userToken = utilities.getURLParams('token');
    if (userToken) {
      const url = `${api_url}users/${userToken}`

      await fetch(url, {
          method: "post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item: this.name,
            checked: this.checked
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Connection problem');
          }
          return response.json();
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    }
  }

  async updateItemToDB() {
    // Verify if user's token is present
    const userToken = utilities.getURLParams('token');
    if (userToken) {
      const url = `${api_url}users/${userToken}/${this.name}`
      await fetch(url, {
          method: "put",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            checked: this.checked
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Connection problem');
          }
          return response.json();
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    }
  }

  async removeItemFromDB() {
    // Verify if user's token is present
    const userToken = utilities.getURLParams('token');
    if (userToken) {
      const url = `${api_url}users/${userToken}/${this.name}`
      await fetch(url, {
          method: "delete",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Connection problem');
          }
          return response.json();
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    }
  }
}

export default class BucketList {
  constructor() {
    this.items = {};
  }

  async populate() {
    await this.getBucketListFromDB();
    this.getBucketListFromLS();
  }

  // Get bucket list items from the online database
  async getBucketListFromDB() {
    // Verify if user's token is present
    const userToken = utilities.getURLParams('token');
    if (userToken) {
      const url = `${api_url}users/token/${userToken}`

      // Get user's info and items
      await fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Connection problem or user not found');
          }
          return response.json();
        })
        .then(async data => {
          const bucketListDB = data[0]['items'];

          // Reset LS
          localStorage.removeItem('bucketList');
          this.items = {}

          // Get each item's name
          for (const item of bucketListDB) {
            const itemId = item.item,
              checked = item.checked;

            let urlItem = `${api_url}items/id/${itemId}`
            await fetch(urlItem)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Connection problem or item not found');
                }

                const name = response.name;
                this.setItem(name, checked);

                return response.json();
              })
          };
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    }
  }

  // Get bucket list items from local storage
  getBucketListFromLS() {
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
        this.setItem(item[0], false);
      }
    }
  }
}