class SFPopup extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    console.log("component connected");
    this.render();
    this.addDraggable();
  }

  render() {
    const template = `
    <style>
    .popup {
      position: absolute;
      display: none;
      top: 10%;
      left: 90%;
      background-color: #fff;
      padding: 20px;
      border: 1px solid #ccc;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      cursor: move;
    }
    
    .popup .todo-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .popup .todo-item input[type="checkbox"] {
      margin-right: 10px;
    }
    
    </style>
      <div class="popup">
        <h3>Todo List</h3>
        <ul style="padding:0" id="todo-ul">
          
        </ul>
      </div>
    `;

    this.shadowRoot.innerHTML = template;
  }

  addDraggable() {
    const popup = this.shadowRoot.querySelector(".popup");
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    popup.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      popup.style.top = popup.offsetTop - pos2 + "px";
      popup.style.left = popup.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

customElements.define("sf-popup", SFPopup);
