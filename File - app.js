const container = document.querySelector('.container');
var inputValue = document.querySelector('.input');
const add = document.querySelector('.add');
const clearAll = document.createElement('button');

// Initialize local storage if not set
if(window.localStorage.getItem("todos") == undefined){
    var todos = [];
    window.localStorage.setItem("todos", JSON.stringify(todos));
}

var todosEX = window.localStorage.getItem("todos");
var todos = JSON.parse(todosEX);

class Item {
    constructor(name){
        this.createItem(name);
    }

    createItem(name){
        // Create the main item container
        var itemBox = document.createElement('div');
        itemBox.classList.add('item', 'bounce-in');  // Bounce animation on creation

        // Input field for the item
        var input = document.createElement('input');
        input.type = "text";
        input.disabled = true;
        input.value = name;
        input.classList.add('item_input');

        // Edit button
        var edit = document.createElement('button');
        edit.classList.add('edit');
        edit.innerHTML = "EDIT";
        edit.addEventListener('click', () => this.edit(input, name));

        // Remove button
        var remove = document.createElement('button');
        remove.classList.add('remove');
        remove.innerHTML = "REMOVE";
        remove.addEventListener('click', () => this.remove(itemBox, name));

        // Append elements to the container
        itemBox.appendChild(input);
        itemBox.appendChild(edit);
        itemBox.appendChild(remove);
        container.appendChild(itemBox);

        // Drag-and-drop functionality
        itemBox.addEventListener('dragstart', this.dragStart);
        itemBox.addEventListener('dragover', this.dragOver);
        itemBox.addEventListener('drop', this.drop);
        itemBox.addEventListener('dragend', this.dragEnd);
    }

    edit(input, name){
        if(input.disabled){
            input.disabled = false;
            input.focus();
            input.classList.add('shake');  // Add shake animation on edit
        } else {
            input.disabled = true;
            input.classList.remove('shake');
            let index = todos.indexOf(name);
            todos[index] = input.value;
            window.localStorage.setItem("todos", JSON.stringify(todos));
        }
    }

    remove(itemBox, name){
        itemBox.classList.add('flash-out');  // Flash animation on remove
        itemBox.addEventListener('animationend', () => itemBox.remove());
        let index = todos.indexOf(name);
        todos.splice(index, 1);
        window.localStorage.setItem("todos", JSON.stringify(todos));
    }

    dragStart(e){
        e.dataTransfer.setData('text/plain', e.target.querySelector('.item_input').value);
        e.target.classList.add('dragging');
    }

    dragOver(e){
        e.preventDefault();
    }

    drop(e){
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const draggedItemValue = e.dataTransfer.getData('text/plain');
        const dropTarget = e.target.closest('.item');
        const dropIndex = todos.indexOf(dropTarget.querySelector('.item_input').value);
        todos.splice(dropIndex, 0, ...todos.splice(todos.indexOf(draggedItemValue), 1));
        window.localStorage.setItem("todos", JSON.stringify(todos));
        container.insertBefore(draggingItem, dropTarget.nextSibling);
        draggingItem.classList.remove('dragging');
    }

    dragEnd(){
        this.classList.remove('dragging');
    }
}

// Check for valid input and duplicate entries
function check(){
    const value = inputValue.value.trim();
    if (value && !todos.includes(value)) {
        new Item(value);
        todos.push(value);
        window.localStorage.setItem("todos", JSON.stringify(todos));
        inputValue.value = "";
    } else {
        alert("Please enter a unique and valid task.");
    }
}

// Event listener for add button and enter key
add.addEventListener('click', check);
window.addEventListener('keydown', (e) => {
    if(e.key === 'Enter') check();
});

// Load items from local storage
for (let v = 0; v < todos.length; v++){
    new Item(todos[v]);
}

// Clear All functionality
clearAll.innerHTML = "Clear All";
clearAll.classList.add('clearAll');
clearAll.addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
        todos = [];
        window.localStorage.setItem("todos", JSON.stringify(todos));
        container.innerHTML = "";
    }
});
document.body.appendChild(clearAll);  // Add clearAll button to the body

// CSS for animations and styling
const style = document.createElement('style');
style.innerHTML = `
    .bounce-in {
        animation: bounceIn 0.6s ease;
    }
    .flash-out {
        animation: flashOut 0.5s forwards;
    }
    .shake {
        animation: shake 0.3s ease;
    }
    .dragging {
        opacity: 0.5;
    }
    .clearAll {
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 1rem;
        color: #fff;
        background-color: red;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    .clearAll:hover {
        transform: scale(1.1);
        background-color: darkred;
    }

    /* Animations */
    @keyframes bounceIn {
        0% { transform: scale(0.5); opacity: 0; }
        70% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); }
    }
    @keyframes flashOut {
        0% { background-color: red; opacity: 1; }
        50% { background-color: transparent; opacity: 0.5; }
        100% { opacity: 0; }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px); }
        50% { transform: translateX(3px); }
        75% { transform: translateX(-3px); }
    }
`;
document.head.appendChild(style);