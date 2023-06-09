let sfPopup;
let firstTime = true;
let imageUrl;
let isMinimized = false;
let isDisabled = false;
const CURRENT_DOMAIN = window.location.hostname;
const showModal = async () => {
  if (isDisabled) return;
  if (!sfPopup) {
    sfPopup = document.querySelector("sf-popup").shadowRoot;
    imageUrl = chrome.runtime.getURL("assets/icon48.png");
  }
  await populateTodoList();
  const popup = sfPopup.querySelector(".popup");
  popup.style.display = "block";
  isMinimized && popup.classList.add("disabled");
  attachEventListeners();
};

const attachEventListeners = () => {
  const hideTodoBtn = sfPopup.querySelector(
    ".popup .todo-list-header #hideTodo"
  );
  const todoListContainer = sfPopup.querySelector(
    ".popup .todo-list-container"
  );
  const sfLogo = sfPopup.querySelector(".popup .todo-list-header #sfShowLogo");
  sfLogo.querySelector("img").src = imageUrl;
  hideTodoBtn.addEventListener("click", () => {
    sfPopup.querySelector(".popup").classList.add("disabled");
    updateDomainConfig(CURRENT_DOMAIN, { minimized: true })
      .then((res) => console.log("Config updated successfully"))
      .catch((e) => console.log("error in updating domain config"));
  });

  sfLogo.addEventListener("click", () => {
    sfPopup.querySelector(".popup").classList.remove("disabled");
    updateDomainConfig(CURRENT_DOMAIN, { minimized: false })
      .then((res) => console.log("Config updated successfully"))
      .catch((e) => console.log("error in updating domain config"));
  });
};

const appendSFPopup = () => {
  if (!document?.querySelector("sf-popup")) {
    const myComponent = document.createElement("sf-popup");
    document.body.appendChild(myComponent);
  }
  // setTimeout(attachEventListeners, 1000);
  //Show the modal after 3 seconds
  getDomainConfig(CURRENT_DOMAIN).then((res) => {
    setTimeout(() => {
      console.log(res);
      isMinimized = res?.minimized;
      isDisabled = res?.disabled;
      showModal();
    }, 2000);
  });
  //Send todo data to the popup script
};

const populateTodoList = async () => {
  const todoList = JSON.parse(await getTodoData(firstTime));
  firstTime = false;
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
    if (window.top !== window.self) return;
    if (!document.querySelector("sf-popup")) {
      const script = document.createElement("script");
      script.src = chrome.runtime.getURL("scripts/sf-popup.js");
      document.head.appendChild(script);
      appendSFPopup();
    }
  } else if (message.message === "refreshSFPopup") {
    appendSFPopup();
  } else if (message.message === "addTodo") {
    const todoData = message.data.map((d, i) => ({
      id: i,
      text: d,
      completed: false,
    }));
    console.log(todoData);
    addTodoData(todoData)
      .then((res) => showModal())
      .catch((e) => console.log("something went wrong"));
  } else if (message.message === "getTodoData") {
    getTodoData()
      .then((res) => {
        res = JSON.parse(res);
        sendResponse(res.map((r) => r.text));
      })
      .catch((e) => {
        console.log("Something went wrong in getTodoData, -> ", e);
        sendResponse([]);
      });
    return true;
  } else if (message.message === "isDisabledForThisDomain") {
    getDomainConfig(CURRENT_DOMAIN)
      .then((res) => {
        console.log(res, 123);
        sendResponse(res?.disabled);
      })
      .catch((e) => {
        sendResponse(false);
      });
    return true;
  } else if (message.message === "updateDisabledDomainList") {
    updateDomainConfig(CURRENT_DOMAIN, { disabled: message.data }).then((r) =>
      appendSFPopup()
    );
  }
});
