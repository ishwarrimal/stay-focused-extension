// script.js
document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todo-list");
  let currentTab;
  let currentDomain;

  // Initialize the todo items array
  let todos = [];
  let disabledDomainList = [];

  function renderTodo() {
    renderDisableCB();
    renderTodoItems();
  }

  function renderDisableCB() {
    var url = new URL(currentTab.url);
    currentDomain = url.hostname;
    const isDisabled = disabledDomainList.find((d) => d === currentDomain);
    const disableContainer = document.querySelector(
      ".disabled-checkbox-container"
    );
    const checkbox = disableContainer.querySelector("input[type='checkbox']");
    disableContainer.style.display = "block";
    if (isDisabled) {
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        disabledDomainList.push(currentDomain);
      } else {
        const idx = disabledDomainList.indexOf(currentDomain);
        if (idx !== -1) {
          disabledDomainList.splice(idx, 1);
        }
      }
      updateDisabledDomainList();
    });
  }

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

  function updateDisabledDomainList() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        message: "updateDisabledDomainList",
        data: disabledDomainList,
      });
    });
  }

  // Add event listener to the input field
  const inputField = document.createElement("input");
  inputField.type = "text";
  inputField.id = "input-todo";
  inputField.placeholder = "Add your task";
  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && inputField.value.trim() !== "") {
      addTodoItem(inputField.value.trim());
      inputField.value = "";
    }
  });

  //Listen for the message from the content script
  function getDataFromContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      currentTab = tabs[0];
      chrome.tabs.sendMessage(tabs[0].id, { message }, function (response) {
        if (message == "getTodoData") {
          todos = [...response];
          renderTodo();
        } else if (message == "getDisabledDomainList") {
          console.log("90", response);
          disabledDomainList = [...response];
          renderDisableCB();
        }
      });
    });
  }
  getDataFromContentScript("getDisabledDomainList");
  getDataFromContentScript("getTodoData");

  // Add the input field to the page
  document.body.insertBefore(inputField, todoList);
});
