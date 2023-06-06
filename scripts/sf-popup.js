// data: [{"id":1,"text":"Dry clothes","completed":false},{"id":2,"text":"Task 2","completed":false},{"id":3,"text":"Task 3","completed":false}]
class SFPopup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    console.log("component connected");
    this.render();
    this.addFeature();
  }

  render() {
    const template = `
    <style>
    .popup {
      position: fixed;
      display: none;
      top: 10px;
      left: 10px;
      max-width: 20vw;
      background-color: #fff;
      padding: 10px;
      border: 1px solid #ccc;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 9999;
    }

    .popup .draggable-div{
      cursor: move;
    }

    .popup .todo-list-header{
      display: flex;
      justify-content: end;
    }

    .popup .todo-list-header #sfShowLogo{
      display: none;
    }

    .popup .todo-list-header #hideTodo{
      border: 1px solid black;
      padding: 1px 5px;
      font-size: 14px;
      border-radius: 8px;
      background: indianred;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .popup .todo-list-header #hideTodo:hover{
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
    }
    
    .popup .todo-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .popup .todo-item input[type="checkbox"] {
      margin-right: 4px;
      cursor: pointer;
    }

    .popup .todo-item label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: capitalize;
    }

    .popup .todo-item label:hover{
      overflow: visible;
    }
    
    </style>
      <div class="popup">
        <div class="draggable-div">
          <div class="todo-list-header">
            <span id="sfShowLogo">
              <img src="" />
            </span>
            <span id="hideTodo">Hide</span>
          </div>
          <div class="todo-list-container">
          <ul style="padding:0; margin: 0" id="todo-ul">
          </ul>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.innerHTML = template;
  }

  addFeature() {
    const popup = this.shadowRoot.querySelector(".popup");
    const draggableDiv = popup.querySelector(".draggable-div");
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    draggableDiv.onmousedown = dragMouseDown;
    popup.onmousedown = resizeMouseDown;

    function resizeMouseDown(e) {
      if (e.target.className != "popup") return;
      e = e || window.event;
      e.preventDefault();
      console.log("time to resize");
    }

    function dragMouseDown(e) {
      e = e || window.event;
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      e.stopPropagation();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      popup.style.top = popup.offsetTop - pos2 + "px";
      popup.style.left = popup.offsetLeft - pos1 + "px";
    }

    function closeDragElement(e) {
      e.stopPropagation();
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

if (!customElements.get(SFPopup)) {
  customElements.define("sf-popup", SFPopup);
}
