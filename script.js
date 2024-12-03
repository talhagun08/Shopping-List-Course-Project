const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const itemClear = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}


function onAddItemSubmit(e){
    e.preventDefault();
    const newItem = itemInput.value;
    //validate input
    if (newItem ==='') {
        alert('Please add an item');
        return;
    }

    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    }else {
        if (checkItem(newItem)) {
            alert('That item already exists!');
            return;
            
        }
    }
    //Create item DOM element
    addItemToDOM(newItem);

    // add item to local storage
    addItemToStorage(newItem);
    
    
    checkUI();
    
    itemInput.value = '';
    // itemForm.reset();
    

}

function addItemToStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    

    // add new item to array
    itemsFromStorage.push(item);

    //convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

function addItemToDOM(item){
    //create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    
    // Add li to the DOM
    itemList.appendChild(li);
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function getItemsFromStorage(){
    let itemsFromStorage;

    if (localStorage.getItem('items')=== null) {
        itemsFromStorage = [];
        
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
        }else{
            setItemToEdit(e.target);
        }
}

function checkItem(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}

function setItemToEdit(item){
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}


function removeItem(item){
    if(confirm('Are you sure?')){
        //remove item from DOM
        item.remove();

        // remove item from storage
        removeItemFromStorage(item.textContent);
        checkUI();
    }

}


function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
  
    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
  
    // Re-set to localstorage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
  }
  




function clearAll(){
    while ( itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    localStorage.removeItem('items');
    checkUI();
}


function filterItems(e){
    const text = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');

    items.forEach(item => {
        const  itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) != -1){
            item.style.display='flex';
        }else{
            item.style.display='none';
        }
    });

}



function checkUI(){
    const items = itemList.querySelectorAll('li');
    if(items.length === 0){
        itemClear.style.display = 'none';
        itemFilter.style.display = 'none';
    }else {
        itemClear.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

function init(){
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    itemClear.addEventListener('click', clearAll);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    checkUI();
}
//event Listeners
init();