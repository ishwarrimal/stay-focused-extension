// script.js
document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todo-list");

  // Initialize the todo items array
  let todos = [];

  function renderTodoItems() {
    // Clear the todo list
    todoList.innerHTML = "";

    // Render each todo item
    todos.forEach(function (todo, index) {
      const todoItem = document.createElement("div");
      todoItem.className = "todo-item";

      const todoInput = document.createElement("input");
      todoInput.type = "text";
      todoInput.value = todo;
      todoInput.addEventListener("change", function (event) {
        todos[index] = event.target.value;
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        todos.splice(index, 1);
        renderTodoItems();
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              message: "addTodo",
              data: todos,
            });
          }
        );
      });

      todoItem.appendChild(todoInput);
      todoItem.appendChild(deleteButton);

      todoList.appendChild(todoItem);
    });
  }

  // Add todo item to the list
  function addTodoItem(todo) {
    todos.push(todo);
    renderTodoItems();
    // Send the message to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: "addTodo", data: todos });
    });
  }

  // Add event listener to the input field
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && inputField.value.trim() !== "") {
      addTodoItem(inputField.value.trim());
      inputField.value = "";
    }
  });

  //Listen for the message from the content script
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { message: "getTodoData" },
      function (response) {
        todos = [...response];
        console.log(todos);
        renderTodoItems();
      }
    );
  });

  // Add the input field to the page
  document.body.insertBefore(inputField, todoList);
});
