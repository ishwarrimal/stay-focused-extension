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

/**
 *
 * @param {string} url -> URL of the domain for which we want config
 * @returns {promise} -> which in turn returns the config.{url : {disabled: true, minimized: true, position: {x: 100px, y: 200px}}}
 */
async function getDomainConfig(url) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("domainConfig", function (res) {
      console.log(res, url);
      const domainConfig = res?.domainConfig;
      const returnData = domainConfig ? JSON.parse(domainConfig) : {};
      if (url) {
        resolve(returnData[url] || {});
      }
      resolve(returnData);
    });
  });
}

/**
 *
 * @param {strin} url - The url of domain
 * @param {Object} config - The config object
 * @param {boolean} [config.disabled] -> Whether the popup is disabled on this site
 * @param {boolean} [config.minimized] -> whehter the pupup is minimized on this site
 * @param {Object} [config.position] -> {x,y} cordinates of the popup
 * @returns {promise} -> which just updates whether the config was udpated or not
 */
async function updateDomainConfig(url, config) {
  const oldConfig = await getDomainConfig();
  let domainConfig = oldConfig[url] || {};
  domainConfig = { ...domainConfig, ...config };
  oldConfig[url] = domainConfig;
  const serializedData = JSON.stringify(oldConfig);
  return new Promise((resolve, reject) => {
    console.log(serializedData);
    chrome.storage.local.set({ domainConfig: serializedData }, function () {
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
