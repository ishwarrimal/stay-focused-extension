const defaultData = [
  { id: 1, text: "Click on extension", completed: false },
  { id: 2, text: "Delete All Task", completed: false },
  { id: 3, text: "Add New Task", completed: false },
];

async function getTodoData(firstTime = false) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["todoData"], function (res) {
      console.log(res);
      if (!res.todoData || (firstTime && res.todoData == "[]")) {
        return addTodoData()
          .then((res) => {
            resolve(res || []);
          })
          .catch((e) => reject(e));
      }
      resolve(res.todoData);
    });
  });
}

async function addTodoData(data = defaultData) {
  const serializedData = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ todoData: serializedData }, function () {
      if (chrome.runtime.lastError) {
        // Error handling
        reject(chrome.runtime.lastError);
      } else {
        console.log("Data saved to local storage.");
        resolve(serializedData);
      }
    });
  });
}
