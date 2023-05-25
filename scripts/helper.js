const defaultData = [
  { id: 1, text: "Dry clothes", completed: false },
  { id: 2, text: "Task 2", completed: false },
  { id: 3, text: "Task 3", completed: false },
];

async function getTodoData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["todoData"], function (res) {
      if (!res.todoData) {
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
