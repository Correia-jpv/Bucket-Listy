import variables from './scss/_export.module.scss';
import * as utilities from './utilities';
import BucketList from './libs/bucketList';

init()

function init() {
  let currentPage = window.location.pathname;

  console.log(currentPage)
  if (currentPage == '/' || "/index.html") {
    document.addEventListener('DOMContentLoaded', getBucketList);

    const elNewItem = document.querySelector('#add-new-item-button');
    const elAddRandom = document.querySelector('#add-random');

    elNewItem.addEventListener('click', addItem);
    elAddRandom.addEventListener('click', addRandomItems);
  }
}


// Check for stored data and populate bucket list
async function getBucketList() {
  let bucketList = new BucketList;
  await bucketList.populate()
  createBucketList(bucketList);
}

// Create HTML item elements
async function createBucketList(bucketList = new BucketList) {
  // Get the stored bucket list
  const lsBucketList = new BucketList
  lsBucketList.getBucketListFromLS();

  // Get the item index
  let elItemRow = document.querySelectorAll("#bucket-list .row:last-child")[0];
  let itemIndex = (elItemRow) ? Math.abs(lsBucketList.numberOfItems - bucketList.numberOfItems) + 1 : 1;

  const items = bucketList.items;

  // Create each item
  for (const item in items) {
    const itemChecked = items[item];
    const itemName = item;
    const itemId = `bucket-item-check-${itemIndex}`;
    const isEvenItem = itemIndex % 2;

    // Create a new row every 2 items
    if (isEvenItem) {
      elItemRow = document.createElement('div');
      elItemRow.className = 'row g-0';
      const elBucketListDiv = document.querySelector('#bucket-list');
      elBucketListDiv.appendChild(elItemRow);
    }

    // Item
    const elItemDiv = document.createElement('div');
    elItemDiv.className = 'bucket-item col-12 col-md-6 box';
    elItemRow.appendChild(elItemDiv);

    const elItemLabel = document.createElement('label');
    elItemLabel.className = 'bucket-item-label';
    elItemLabel.htmlFor = itemId;
    elItemDiv.appendChild(elItemLabel);

    const elItemTextDiv = document.createElement('div');
    elItemTextDiv.className = 'p-3 h-100 box';
    elItemLabel.appendChild(elItemTextDiv);

    // Remove
    const elItemRemoveDiv = document.createElement('div');
    elItemRemoveDiv.className = 'p-3 bucket-item-remove';
    elItemRemoveDiv.addEventListener('click', RemoveItem);
    elItemDiv.appendChild(elItemRemoveDiv);

    const elItemRemoveI = document.createElement('i');
    elItemRemoveI.className = 'bi bi-trash-fill fa-lg'
    elItemRemoveDiv.appendChild(elItemRemoveI);

    // Tick
    const elItemTickLabel = document.createElement('label');
    elItemTickLabel.className = 'checkbox';
    elItemTextDiv.appendChild(elItemTickLabel);

    const elItemTickInput = document.createElement('input');
    elItemTickInput.id = itemId;
    elItemTickInput.type = 'checkbox';
    elItemTickInput.checked = itemChecked;
    elItemTickInput.addEventListener('click', tickItem);
    elItemTickLabel.appendChild(elItemTickInput);

    const elItemTickSpan = document.createElement('span');
    elItemTickLabel.appendChild(elItemTickSpan);

    // Text
    const elItemTextSpan = document.createElement('span');
    elItemTextSpan.innerHTML = itemName;
    elItemTextSpan.classList.add('default');
    elItemTextDiv.appendChild(elItemTextSpan);

    itemIndex++;

    // Smooth show item transition
    await utilities.sleep(100);
    elItemDiv.classList.toggle('show');
  }

}

// Style New Item
function newItemButtonSuccessTransition() {
  const elNewItemButton = document.querySelector('#add-new-item-button');
  const elNewItemIcon = elNewItemButton.querySelector('i');
  const elNewItemText = elNewItemButton.querySelector('span');
  const elNewItemInput = document.querySelector('#new-item-input');

  if (elNewItemIcon.classList.contains('bi-plus-square-fill')) {
    elNewItemButton.style.backgroundColor = variables.secondaryColor;
    elNewItemText.innerHTML = "New";
    elNewItemText.style.color = variables.primaryColor;
    elNewItemIcon.classList.toggle('bi-plus-square-fill');
    elNewItemIcon.classList.toggle('bi-plus-square');
    elNewItemInput.value = '';
  }
}


// *** Event Handlers ***

// New item click event
function addItem() {
  const elNewItemButton = document.querySelector('#add-new-item-button');
  const elNewItemIcon = elNewItemButton.querySelector('i');
  const elNewItemText = elNewItemButton.querySelector('span');
  const elNewItemInput = document.querySelector('#new-item-input');
  const elNewItem = document.querySelector('#add-items > :first-child');

  // Swap new item button icon and text 
  if (elNewItemIcon.classList.contains('bi-plus-square')) {
    elNewItemText.innerHTML = "Save";
    elNewItemIcon.classList.toggle('bi-plus-square');
    elNewItemIcon.classList.toggle('bi-plus-square-fill');

    // New item success transition
    elNewItem.style.transition = 'all 600ms';
    elNewItem.classList.toggle('show');
    elNewItemButton.addEventListener('transitionend', newItemButtonSuccessTransition);

  } else {
    let item = elNewItemInput.value;

    // Check for empty input
    if (item === '') {
      elNewItemInput.placeholder = "Type Here...";
    } else {
      let bucketList = new BucketList();
      bucketList.setItem(item);
      createBucketList(bucketList);

      // Success transition
      elNewItemButton.style.backgroundColor = variables.successColor;
      elNewItemText.innerHTML = 'Success!';
      elNewItemText.style.color = variables.secondaryColor;
      elNewItem.classList.toggle('show');
      elNewItemInput.placeholder = "";
    }
  }
}

// Add Random Items Click Event
function addRandomItems() {
  let bucketList = new BucketList;
  bucketList.newRandomItems();
  createBucketList(bucketList);
}

// Tick Event
function tickItem(e) {
  if (e.currentTarget.parentElement.parentElement.querySelector(":scope > span") !== null) {
    const elItem = e.currentTarget.parentElement.parentElement.querySelector(":scope > span");
    const item = elItem.textContent;
    const bucketList = new BucketList;
    const lsBucketList = localStorage.getItem('bucketList');

    bucketList.items = (JSON.parse(lsBucketList));
    const checked = !bucketList.getItem(item);
    bucketList.setItem(item, checked);

    e.stopPropagation();
  }
}

// Remove Event
async function RemoveItem(e) {
  let bucketList = new BucketList;
  bucketList.getBucketListFromLS();

  let item, elItem;

  // Remove from HTML
  if (e.target.classList.contains('bucket-item-remove')) {
    elItem = e.target.parentElement;
  } else {
    elItem = e.target.parentElement.parentElement;
  }
  item = elItem.textContent;

  // Remove from storage
  bucketList.removeItem(item);

  // Remove item transition
  elItem.classList.toggle('show');
  await utilities.sleep(300);
  elItem.remove();
}