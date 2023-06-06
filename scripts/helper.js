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

//store config for each domains:
// domainConfig : {url : {disabled: true, minimized: true, position: {x: 100px, y: 200px}}}
async function getDomainConfig(url) {
  return new Promise((resole, reject) => {
    chrome.storage.local.get("[domainConfig]", function (res) {
      const domainConfig = res.domainConfig;
      if (!domainConfig) {
        reject("no config found");
      }
      const returnData = JSON.parse(domainConfig);
      resole(returnData[url] || {});
    });
  });
}

//config is {minimized: true}
async function updateDomainConfig(url, config) {
  const oldConfig = await getDomainConfig(url);
  const newConfig = { oldConfig, ...config };
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(
      { disabledDomainList: serializedData },
      function () {
        if (chrome.runtime.lastError) {
          // Error handling
          reject(chrome.runtime.lastError);
        } else {
          console.log("Data saved to local storage.");
          resolve(serializedData);
        }
      }
    );
  });
}

async function getDisabledDomainList() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["disabledDomainList"], function (res) {
      resolve(res?.disabledDomainList || "[]");
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

async function updateDisabledDomainList(data = []) {
  const serializedData = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(
      { disabledDomainList: serializedData },
      function () {
        if (chrome.runtime.lastError) {
          // Error handling
          reject(chrome.runtime.lastError);
        } else {
          console.log("Data saved to local storage.");
          resolve(serializedData);
        }
      }
    );
  });
}
