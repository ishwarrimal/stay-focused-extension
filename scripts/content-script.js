let sfPopup;
const showModal = () => {
  sfPopup = document.querySelector("sf-popup").shadowRoot;
  populateTodoList();
  const popup = sfPopup.querySelector(".popup");
  popup.style.display = "block";
};

const appendSFPopup = () => {
  const myComponent = document.createElement("sf-popup");
  document.body.appendChild(myComponent);
  // setTimeout(attachEventListeners, 1000);
  //Show the modal after 3 seconds
  setTimeout(showModal, 3000);
};

const handleBookmarkClicked = () => {
  console.log("Word to bookmark is -> ", selection);
};

const populateTodoList = () => {
  const todoList = JSON.parse(localStorage.getItem("todoData")) || [];
  const content = `${todoList
    .map(
      (item) => `
    <li class="todo-item">
      <input type="checkbox" id="item-${item.id}" ${
        item.completed ? "checked" : ""
      }>
      <label for="item-${item.id}">${item.text}</label>
    </li>
  `
    )
    .join("")}`;
  sfPopup.querySelector("#todo-ul").innerHTML = content;
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.message === "createSFPopup") {
    // Do something in response to the "extensionInstalled" message
    console.log("Create SF popup");
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("scripts/sf-popup.js");

    document.head.appendChild(script);
    if (!document.querySelector("sf-popup")) {
      appendSFPopup();
    }
  }
});
