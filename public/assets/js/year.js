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
class Year {
  constructor(H) {
    this.H = H;
    this.getEls();
    this.events();
    this.getYearSetup();
  }
  getEls() {
    this.dynamic = document.getElementById("dynamic");
    this.yearSelectEl = document.getElementById("year-select");
    this.addTierButtonEl = document.getElementById("year-add-tier-button");
  }
  events() {
    this.yearSelectEl.addEventListener("change", this.getYearSetup.bind(this));
    document.addEventListener("click", this.buttonEvents.bind(this));
    document.addEventListener("click", this.squareEvents.bind(this));
    document.addEventListener("click", this.addEvent.bind(this));
  }
  buttonEvents(e) {
    let cls = e.target.getAttribute("class");
    if (cls !== null && cls.includes("button") && cls.indexOf("del-btn") !== -1 && cls.indexOf("square-button") === -1) {
        const o = {
          class: cls,
          year_id: this.yearSelectEl.value,
          tier_id: e.target.getAttribute("data-tier_id")
        };
        this.H.delete("/api/year/tier/", o).then(r => this.getYearSetup());
    }
  }
  squareEvents(e) {
    let cls = e.target.getAttribute("class");
    if (cls !== null && cls.includes("square-button")) {
      const o = {
        id: e.target.getAttribute("id"),
        class: cls,
        year_id: this.yearSelectEl.value,
        tier_id: e.target.getAttribute("data-tier_id"),
        event_id: e.target.getAttribute("data-event_id")
      };
      if (o.class.indexOf("del-btn") !== -1) {
        this.H.delete("/api/year/", o).then(r => this.getYearSetup());
      } else if (o.id === "year-add-tier-button") {
        o.tier_id = document.getElementById("tier-select").value;
        this.H.post("/api/year/tier/", o).then(r => this.getYearSetup());
      }
    }
  }
  addEvent(e) {
    let cls = e.target.getAttribute("class");
    if (cls !== null && cls.includes("year-add-event-button")) {
      const o = {
        year_id: this.yearSelectEl.value,
        tier_id: e.target.getAttribute("data-id"),
        event_id: document.getElementById("year-add-event-select-" + e.target.getAttribute("data-id")).value,
      };
      this.H.post("/api/year/", o).then(r => this.getYearSetup());
    }
  }
  getYearSetup() {
    this.H.get("/api/year/" + this.yearSelectEl.value).then(r => {
      try {
        let p = JSON.parse(r);
        this.renderYearSetup(p);
      } catch (er) {
        console.log("er", er);
      }
    })
  }
  renderYearSetup(d) {
    let el = document.getElementById("dynamic");
    el.innerHTML = "";
    for (let i = 0; i < d.tiers.length; i++) {
      const containerEl = this.r({e: "section", c: "container mx-auto text-center"});
      const pTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: `${d.tiers[i].name} Tier`});
      containerEl.appendChild(pTitleEl);
      const titleLineEl = this.r({e: "hr", c: "line large mx-auto"});
      containerEl.appendChild(titleLineEl);
      for (let j = 0; j < d[d.tiers[i].name].length; j++) {
        const itemInputEl = this.r({
          e: "input",
          c: "large mx-auto",
          di: d[d.tiers[i].name][j].event_id,
          ty: "text",
          v: d[d.tiers[i].name][j].name
        });
        const deleteButtonEl = this.r({
          e: "div",
          c: "square-button del-btn red mx-auto",
          dei: d[d.tiers[i].name][j].event_id,
          dti: d.tiers[i].tier_id,
          type: "delete"
        });
        const rowEl = this.r({e: "div", c: "row mx-auto text-center row-container"});
        rowEl.appendChild(itemInputEl);
        rowEl.appendChild(deleteButtonEl);
        containerEl.appendChild(rowEl);
      }
      const pAddEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Add New Event"});
      containerEl.appendChild(pAddEl);
      const rowContainerEl = this.r({e: "div", c: "row mx-auto text-center row-container"});
      const selectEventEl = this.r({
        e: "select",
        c: "large mx-auto",
        i: `year-add-event-select-${d.tiers[i].tier_id}`,
        di: d.tiers[i].tier_id
      });
      for (let k = 0; k < d.allEvents.length; k++) {
        const optionEl = this.r({e: "option", v: d.allEvents[k].id, tx: d.allEvents[k].name});
        selectEventEl.appendChild(optionEl);
      }
      rowContainerEl.appendChild(selectEventEl);
      const addEventButtonEl = this.r({
        e: "div",
        c: "square-button blue year-add-event-button mx-auto",
        di: d.tiers[i].tier_id,
        type: "add"
      });
      rowContainerEl.appendChild(addEventButtonEl);
      containerEl.appendChild(rowContainerEl);
      const pDelEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Delete This Tier?"});
      containerEl.appendChild(pDelEl);
      const delTierButtonEl = this.r({
        e: "button",
        c: "button mx-auto red del-btn",
        dti: d.tiers[i].tier_id,
        tx: "Delete"
      });
      containerEl.appendChild(delTierButtonEl);
      el.appendChild(containerEl);
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
    if (o.dti) {
      el.setAttribute("data-tier_id", o.dti);
    }
    if (o.dei) {
      el.setAttribute("data-event_id", o.dei);
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
    } else if (o.type === "add") {
      p1.setAttribute("fill-rule", "evenodd");
      p1.setAttribute("d", "M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z");
      e.appendChild(p1);
    }
    return e;
  }
}
const Y = new Year(new H());