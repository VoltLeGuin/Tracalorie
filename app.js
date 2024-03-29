//point of project is to immitate React/Angular structure with vanilla JavaScript
//van. javascript to change State - when click pencil, different buttons appear to update list
//because edit button is added after and item is listed, it is not there initially, 
//have to use EVENT DELEGATION...find a parent element

//change to carb counter and make it look nicer
//or hook up to api where you select food and it inputs carbs

//Storage Controller

const StorageCtrl = (function() {
    //returning makes method public with this logData function...rest is completely private
    return {
        storeItem: function(item) {
            let items;
            //check if any items in localstorage
            if(localStorage.getItem('items') === null) {
                items = [];
                //push the new item
                items.push(item);
                //set local storage
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                //get what is already in local storage
                items = JSON.parse(localStorage.getItem('items'));

                //push the new item
                items.push(item)

                //reset local storage
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(updateListItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index) {
                if(id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})();

//Item Controller
//iife - immediately invoked function expression
const ItemCtrl = (function() {
    //item constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    //data structure, similar to REACT State
    const data = {
        // items: [
            // {id: 0, name: 'Steak Dinner', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 500},
            // {id: 2, name: 'Eggs', calories: 300}
        // ],
        items: StorageCtrl.getItemsFromStorage(),
        //currentItem is the item to be updated
        currentItem: null,
        totalCalories: 0
    }

    //returning makes method public with this logData function...rest is completely private
    return {    
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;
            //need to generate an id
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            //parse calories from string to number
            calories = parseInt(calories);

            //create a new instance of Item
            newItem = new Item(ID, name, calories);

            //add to items array
            data.items.push(newItem)

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            // Loop through items
            data.items.forEach(function(item){
              if(item.id === id){
                found = item;
              }
            });
            return found;
        },
        updateItem: function(name, calories) {
            //parse calories to a number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id) {
            //get ids
            const ids = data.items.map(function(item) {
                return item.id
            });

            //get index
            const index = ids.indexOf(id);

            //remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item){
        data.currentItem = item;
        },
        getCurrentItem: function(){
        return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;

            //loop through items and add calories
            data.items.forEach(function(item) {
                total += item.calories;
            });

            //set total calories in data structure
            data.totalCalories = total;

            //return total calories
            return data.totalCalories;
        },
        logData: function() {
            return data;
        }
    }
})();

//UI Controller
const UICtrl = (function(){
    const UISelectors = {
      itemList: '#item-list',
      listItems: '#item-list li',
      addBtn: '.add-btn',
      updateBtn: '.update-btn',
      deleteBtn: '.delete-btn',
      backBtn: '.back-btn',
      clearBtn: '.clear-btn',
      itemNameInput: '#item-name',
      itemCaloriesInput: '#item-calories',
      totalCalories: '.total-calories'
    }

    //returning makes method public...rest is completely private
    return {
        populateItemList: function(items) {
            let html = '';
            items.forEach((item) => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
                </li>`
            });

            //insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            //show the list, set display
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //create li element
            const li = document.createElement('li');
            //add class
            li.className = 'collection-item';
            //add #id
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            //insert new li into html
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //turn nodelist into an array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem) {
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            });
        },
        deleteListItem: function(id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
          document.querySelector(UISelectors.itemNameInput).value = '';
          document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function(){
          document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
          document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
          UICtrl.showEditState();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item) {
                item.remove();
            })
        },
        hideList: function(){
          document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories){
          document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
          UICtrl.clearInput();
          document.querySelector(UISelectors.updateBtn).style.display = 'none';
          document.querySelector(UISelectors.deleteBtn).style.display = 'none';
          document.querySelector(UISelectors.backBtn).style.display = 'none';
          document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
          document.querySelector(UISelectors.updateBtn).style.display = 'inline';
          document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
          document.querySelector(UISelectors.backBtn).style.display = 'inline';
          document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
          return UISelectors;
        }
      }
    })();



//App Controller - returns one function, the INIT, the initializer for the app 
//- anything we need to run right away when the app first loads
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl) {
    //function loading event listeners...when we call an event, need UISelectors, which are private, 
    //so grabbing the return getSelectors() function
    const loadEventListener = function() {
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //disable submit on enter key
        document.addEventListener('keypress', function(event) {
            if(event.keycode === 13 || event.which === 13) {
                event.preventDefault();
                return false;
            }
        })

        //edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //update the item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //delete the item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    //add item submit
    const itemAddSubmit = function(event) {
        //get form input from UI Controller
        const input = UICtrl.getItemInput();
    
        //check for name and calorie input
        if(input.name !== '' && input.calories !== '') {
            //add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //add item to the html...user interface list
            UICtrl.addListItem(newItem);
            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to html/UI
            UICtrl.showTotalCalories(totalCalories);

            //store item in local storage
            StorageCtrl.storeItem(newItem);

            //clear fields
            UICtrl.clearInput();
        }

        event.preventDefault();
    }

    //click edit
    const itemEditClick = function(event) {
        if(event.target.classList.contains('edit-item')) {
            //get the list item ID (item-0, item-1)
            const listId = event.target.parentNode.parentNode.id;
            
            //break into an array
            const listIdArray = listId.split('-');
            
            //get the actual id
            const id = parseInt(listIdArray[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);

            //set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            //add item to form
            UICtrl.addItemToForm();
        }

        event.preventDefault();
    }

    //update item
    const itemUpdateSubmit = function(event) {
        //get item input
        const input = UICtrl.getItemInput();

        //update item 
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)

        //Update UI
        UICtrl.updateListItem(updatedItem);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to html/UI
        UICtrl.showTotalCalories(totalCalories);

        //update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        event.preventDefault();
    }

    //delete submit event
    const itemDeleteSubmit = function(event) {
        //get id from current item
        const currentItem = ItemCtrl.getCurrentItem();

        //delete from data structure
        ItemCtrl.deleteItem(currentItem.id);

        //delete from html/UI
        UICtrl.deleteListItem(currentItem.id);

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to html/UI
        UICtrl.showTotalCalories(totalCalories);

        //delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        event.preventDefault();
    }

    //clear all items event
    const clearAllItemsClick = function(event) {
        //delete all items from data structure
        ItemCtrl.clearAllItems();

        //get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //add total calories to html/UI
        UICtrl.showTotalCalories(totalCalories);

        //remove from UI/html
        UICtrl.removeItems();

        //remove from local storage
        StorageCtrl.clearItemsFromStorage();

        //hide the ul
        UICtrl.hideList();

        event.preventDefault();
    }

    //returning makes method public...rest is completely private
    return {
        init: function() {
            //clear and hide buttons, set first State
            UICtrl.clearEditState();

            //fetch items from data structure/State in Item Controller
            const items = ItemCtrl.getItems();

            //check if any items in list
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                //populate list with items...put items into the HTML
                UICtrl.populateItemList(items);
            }

            //get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //add total calories to html/UI
            UICtrl.showTotalCalories(totalCalories);

            //load event listeners
            loadEventListener(); 
        }
    }
    
})(ItemCtrl, StorageCtrl, UICtrl);

AppCtrl.init();