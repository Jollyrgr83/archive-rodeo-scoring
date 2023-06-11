class H {
  serialize(o) {
    let par = "?";
    let k = Object.keys(o);
    k.forEach(key => {
      par += key + "=" + o[key] + "&";
    });
    par = par.substring(0, par.length - 1);
    return par;
  }
  async get(u) {
    let options = {"method": "GET"};
    let r = await fetch(u);
    return await r.text();
  }
  async getParams(p, u) {
    let options = {"method": "GET"};
    let url = u + this.serialize(p);
    let response = await fetch(url, options);
    return await response.text();
  }
  async put(u, data) {
    let options = {"method": "PUT", "headers": {"Content-Type": "application/json"}, "body": JSON.stringify(data)};
    let r = await fetch(u, options);
    return await r.text();
  }
  async post(u, data) {
    let options = {"method": "POST", "headers": {"Content-Type": "application/json"}, "body": JSON.stringify(data)};
    let r = await fetch(u, options);
    return await r.text();
  }
  async delete(u, data) {
    let options = {"method": "DELETE", "headers": {"Content-Type": "application/json"}, "body": JSON.stringify(data)};
    let r = await fetch(u, options);
    return await r.text();
  }
}
class View {
  constructor(H) {
    this.H = H;
    this.events();
    this.renderAddMenu();
  }
  events() {
    document.addEventListener("click", this.buttonEvents.bind(this));
    document.addEventListener("click", this.squareEvents.bind(this));
    document.getElementById("add-menu").addEventListener("change", this.renderAddMenu.bind(this));
  }
  buttonEvents(e) {
    if (e.target.getAttribute("class") !== null && e.target.getAttribute("class").includes("button")) {
      const btnID = e.target.getAttribute("id");
      const btnObj = {titleName: null, itemName: null, teamStatus: null, coopStatus: null};
      if (btnID === "view-menu-button") {
        this.getView(document.getElementById("view-menu").value);
      } else if (btnID === "add-container-button") {
        btnObj.titleName = document.getElementById("add-menu").value;
        btnObj.itemName = document.getElementById("add-container-input").value.trim();
        if (btnObj.itemName === "" || (isNaN(parseInt(btnObj.itemName)) && btnObj.titleName === "Years")) {
          this.renderAddMessage("error", btnObj.titleName);
        } else {
          if (btnObj.titleName === "Tiers") {
            btnObj.teamStatus = document.getElementById("tiers-add-select").value;
          } else if (btnObj.titleName === "Organizations") {
            btnObj.coopStatus = document.getElementById("organizations-add-select").value;
          }
          this.renderAddMessage("success", btnObj);
        }
      }
    }
  }
  squareEvents(e) {
    if (e.target.getAttribute("class") !== null && e.target.getAttribute("class").includes("square-button")) {
      let id = e.target.getAttribute("id");
      let cls = e.target.getAttribute("class");
      const o = {
        id: parseInt(id),
        class: cls,
        itemValue: document.getElementById("input-" + id).value.trim(),
        titleName: document.getElementById("view-menu").value
      };
      if (o.class.indexOf("del-btn") !== -1) {
        this.H.delete("/api/view/", o).then(r => this.getView(document.getElementById("view-menu").value));
      } else if (o.itemValue !== "") {
        this.H.put("/api/view/", o).then(r => this.getView(document.getElementById("view-menu").value, "update"));
      }
    }
  }
  renderAddMenu() {
    const titleName = document.getElementById("add-menu").value;
    let el = document.getElementById("add-container");
    el.innerHTML = "";
    const pTitleEl = this.r({ e: "p", c: "subtitle full mx-auto", tx: titleName === "Years" ? "Enter Year" : "Enter Name" });
    el.appendChild(pTitleEl);
    const inputEl = this.r({ e: "input", i: "add-container-input", ty: "text", c: "full mx-auto" });
    el.appendChild(inputEl);
    if (titleName === "Tiers") {
      const tiersTextEl = this.r({ e: "p", c: "subtitle full mx-auto", tx: "Are the competitors in this tier individuals or teams?" });
      el.appendChild(tiersTextEl);
      const tiersSelectEl = this.r({ e: "select", i: "tiers-add-select", c: "full mx-auto" });
      const optionYesEl = this.r({ e: "option", tx: "Individuals", v: "false" });
      tiersSelectEl.appendChild(optionYesEl);
      const optionNoEl = this.r({ e: "option", tx: "Teams", v: "true" });
      tiersSelectEl.appendChild(optionNoEl);
      el.appendChild(tiersSelectEl);
    } else if (titleName === "Organizations") {
      const organizationsTextEl = this.r({ e: "p", c: "subtitle full mx-auto", tx: "Is this organization a coop?" });
      el.appendChild(organizationsTextEl);
      const organizationsSelectEl = this.r({ e: "select", i: "organizations-add-select", c: "full mx-auto" });
      const optionYesEl = this.r({ e: "option", tx: "Yes", v: "true" });
      organizationsSelectEl.appendChild(optionYesEl);
      const optionNoEl = this.r({ e: "option", tx: "No", v: "false" });
      organizationsSelectEl.appendChild(optionNoEl);
      el.appendChild(organizationsSelectEl);
    }
    const buttonEl = this.r({ e: "button", c: "button blue mx-auto", i: "add-container-button", tx: "Add" });
    el.appendChild(buttonEl);
    const messageEl = this.r({ e: "div", i: "add-message-container" });
    el.appendChild(messageEl);
  }
  getView(titleName, status) {
    const o = {titleName: titleName, tableName: titleName.toLowerCase(), status: status};
    this.H.get("/api/view/menu/" + o.tableName).then(r => {
      try {
        let p = JSON.parse(r);
        o.data = [...p.data];
        this.renderViewMenu(o);
      } catch (er) {
        console.log("er", er);
      }
    });
  }
  renderViewMenu(o) {
    let el = document.getElementById("view-container");
    el.innerHTML = "";
    const warningDivEl = this.r({e: "p", c: "warning mx-auto text-center"});
    const warningTitleEl = this.r({e: "p", tx: "WARNING!"});
    const warningTextEl = this.r({
      e: "p",
      tx: "Deleting an item will also remove all records associated with that item."
    });
    const pTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: o.titleName});
    const titleLineEl = this.r({e: "hr", c: "line large mx-auto"});
    warningDivEl.appendChild(warningTitleEl);
    warningDivEl.appendChild(warningTextEl);
    el.appendChild(warningDivEl);
    el.appendChild(pTitleEl);
    el.appendChild(titleLineEl);
    for (let i = 0; i < o.data.length; i++) {
      const itemInputEl = this.r({
        e: "input",
        c: "half mx-auto",
        i: `input-${o.data[i].id}`,
        ty: "text",
        v: o.data[i].name
      });
      // TODO - add svg to replace i elements
      const updateButtonEl = this.r({e: "div", c: "square-button blue mx-auto", i: `${o.data[i].id}`, type: "update"});
      const deleteButtonEl = this.r({e: "div", c: "square-button red del-btn mx-auto", i: `${o.data[i].id}`, type: "delete"});
      const rowEl = this.r({e: "div", c: "row mx-auto text-center row-container"});
      rowEl.appendChild(itemInputEl);
      rowEl.appendChild(updateButtonEl);
      rowEl.appendChild(deleteButtonEl);
      el.appendChild(rowEl);
    }
    if (o.status === "update") {
      const textEl = this.r({e: "p", c: "text", tx: "Success! Item Updated!"});
      el.appendChild(textEl);
    }
  }
  renderAddMessage(status, o) {
    let el = document.getElementById("add-container");
    el.innerHTML = "";
    if (status === "error") {
      const textEl = this.r({
        e: "p",
        c: "subtitle mx-auto",
        tx: "Please ensure that your entry is a valid number for a year entry and is not blank."
      });
      this.renderAddMenu();
      el.appendChild(textEl);
    } else {
      this.H.post("/api/view/", o).then(r => {
        this.getView(document.getElementById("view-menu").value);
        this.renderAddMenu();
        const textEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Success! Item Added!"});
        el.appendChild(textEl);
      });
    }
  }
  r(o) {
      let el = document.createElement(o.e);
      if (o.i) {
        el.setAttribute("id", o.i);
      }
      if (o.c) {
        el.setAttribute("class", o.c);
      }
      if (o.ty) {
        el.setAttribute("type", o.ty);
      }
      if (o.tx) {
        el.innerText = (o.tx);
      }
      if (o.v) {
        el.value = (o.v);
      }
      if (o.di) {
        el.setAttribute("data-id", o.di);
      }
      if (o.type) {
        const s = this.rs(o);
        el.appendChild(s);
      }
    return el;
  }
  rs(o) {
    const n = "http://www.w3.org/2000/svg";
    const e = document.createElementNS(n, "svg");
    e.setAttribute("xmlns", n);
    e.setAttribute("viewBox", "0 0 16 16");
    e.setAttribute("height", "24");
    e.setAttribute("width", "24");
    e.setAttribute("fill", "currentColor");
    const p1 = document.createElementNS(n, "path");
    if (o.type === "update") {
      p1.setAttribute("fill-rule", "evenodd");
      p1.setAttribute("d", "M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z");
      const p2 = document.createElementNS(n, "path");
      p2.setAttribute("d", "M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z");
      e.appendChild(p1);
      e.appendChild(p2);
    } else if (o.type === "delete") {
      p1.setAttribute("d", "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z");
      e.appendChild(p1);
    }
    return e;
  }
}
const V = new View(new H());