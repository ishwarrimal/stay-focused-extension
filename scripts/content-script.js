let sfPopup;
let firstTime = true;
const showModal = async () => {
  if (!sfPopup) {
    sfPopup = document.querySelector("sf-popup").shadowRoot;
  }
  await populateTodoList();
  const popup = sfPopup.querySelector(".popup");
  popup.style.display = "block";
};

const appendSFPopup = () => {
  if (!document?.querySelector("sf-popup")) {
    const myComponent = document.createElement("sf-popup");
    document.body.appendChild(myComponent);
  }
  // setTimeout(attachEventListeners, 1000);
  //Show the modal after 3 seconds
  getDisabledDomainList().then((res) => {
    setTimeout(() => {
      const curUrl = window.location.hostname;
      res = JSON.parse(res);
      if (res.length > 0 && res.includes(curUrl)) {
        document
          .querySelector("sf-popup")
          .shadowRoot.querySelector(".popup").style.display = "none";
        return;
      }
      showModal();
    }, 2000);
  });
  //Send todo data to the popup script
};

const handleBookmarkClicked = () => {
  console.log("Word to bookmark is -> ", selection);
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
  } else if (message.message === "getDisabledDomainList") {
    getDisabledDomainList()
      .then((res) => {
        sendResponse(res ? JSON.parse(res) : []);
      })
      .catch((e) => {
        sendResponse([]);
      });
    return true;
  } else if (message.message === "updateDisabledDomainList") {
    updateDisabledDomainList(message.data).then((r) => appendSFPopup());
  }
});
