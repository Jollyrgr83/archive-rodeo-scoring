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
class Score {
  constructor(H) {
    this.H = H;
    this.events();
    this.renderCompSelectionMenu();
  }
  events() {
    document.getElementById("year-select").addEventListener("change", this.renderCompSelectionMenu.bind(this));
    document.addEventListener("change", this.compSelect.bind(this));
    document.addEventListener("click", this.saveButton.bind(this));
  }
  saveButton(e) {
    if (e.target.getAttribute("id") === "save-button") {
      const totalEvents = e.target.getAttribute("data-total-events");
      const scoreObj = {data: []};
      for (let i = 0; i < totalEvents; i++) {
        scoreObj.data.push({
          title: "score",
          value: document.getElementById("score-input-" + i).value,
          id: document.getElementById("score-input-" + i).getAttribute("data-record-id")
        });
        scoreObj.data.push({
          title: "time_minutes",
          value: document.getElementById("minutes-input-" + i).value,
          id: document.getElementById("minutes-input-" + i).getAttribute("data-record-id")
        });
        scoreObj.data.push({
          title: "time_seconds",
          value: document.getElementById("seconds-input-" + i).value,
          id: document.getElementById("seconds-input-" + i).getAttribute("data-record-id")
        });
      }
      this.H.put("/api/score/", scoreObj).then(r => {
        const messageEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Success! Scores have been updated!"});
        document.getElementById("score-container").appendChild(messageEl);
      });
    }
  }
  compSelect(e) {
    if (e.target.getAttribute("id") === "comp-select") {
      this.renderScore();
    }
  }
  renderCompSelectionMenu() {
    this.H.get("/api/comp/year/" + document.getElementById("year-select").value).then(r => {
      try {
        let p = JSON.parse(r);
        let el = document.getElementById("comp-menu-container");
        el.innerHTML = "";
        const menuTitleEl = this.r({ e: "p", c: "subtitle mx-auto", tx: "Select a Competitor" });
        el.appendChild(menuTitleEl);
        const menuTitleLineEl = this.r({ e: "hr", c: "line large mx-auto" });
        el.appendChild(menuTitleLineEl);
        const menuEl = this.r({ e: "select", i: "comp-select", c: "full mx-auto" });
        for (let i = 0; i < p.length; i++) {
          const optionEl = this.r({ e: "option", v: p[i].id, tx: p[i].text });
          menuEl.appendChild(optionEl);
        }
        el.appendChild(menuEl);
        this.reconcileScores();
      } catch (er) {
        console.log("er", er);
      }
    });
  }
  renderScore() {
    let el = document.getElementById("score-container");
    el.innerHTML = "";
    const input = document.getElementById("comp-select").value + "&" + document.getElementById("year-select").value;
    this.H.get("/api/score/competitor/" + input).then(r => {
      try {
        let p = JSON.parse(r);
        for (let i = 0; i < p.length; i++) {
          const sectionEl = this.r({ e: "div", c: "container mx-auto text-center" });
          const pTitleEl = this.r({ e: "p", c: "subtitle mx-auto", tx: p[i].name });
          sectionEl.appendChild(pTitleEl);
          const lineEl = this.r({ e: "hr", c: "line large mx-auto"});
          sectionEl.appendChild(lineEl);
          const div1El = this.r({ e: "div", c: "row mx-auto" });
          const pScoreEl = this.r({ e: "p", c: "text small mx-auto", tx: "Score" });
          div1El.appendChild(pScoreEl);
          const pMinEl = this.r({ e: "p", c: "text small mx-auto", tx: "Minutes" });
          div1El.appendChild(pMinEl);
          const pSecEl = this.r({ e: "p", c: "text small mx-auto", tx: "Seconds" });
          div1El.appendChild(pSecEl);
          sectionEl.appendChild(div1El);
          const div2El = this.r({ e: "div", c: "row mx-auto" });
          const inputScoreEl = this.r({ e: "input", i: `score-input-${i}`, c: "small mx-auto text-center", ty: "number", ri: p[i].id, v: p[i].score });
          div2El.appendChild(inputScoreEl);
          const inputMinEl = this.r({ e: "input", i: `minutes-input-${i}`, c: "small mx-auto text-center", ty: "number", ri: p[i].id, v: p[i].time_minutes });
          div2El.appendChild(inputMinEl);
          const inputSecEl = this.r({ e: "input", i: `seconds-input-${i}`, c: "small mx-auto text-center", ty: "number", ri: p[i].id, v: p[i].time_seconds });
          div2El.appendChild(inputSecEl);
          sectionEl.appendChild(div2El);
          el.appendChild(sectionEl);
        }
        const sectionEl = this.r({ e: "div", c: "mx-auto text-center" });
        const saveButtonEl = this.r({ e: "button", i: "save-button", c: "button blue mx-auto", dte: p.length, tx: "Update" });
        sectionEl.appendChild(saveButtonEl);
        el.appendChild(sectionEl);
      } catch (er) {
        console.log("er", er);
      }
    });
  }
  reconcileScores() {
    this.H.get("/api/score/reconcile/" + document.getElementById("year-select").value).then(r => {
      this.renderScore();
    });
  }
  r(o) {
    const e = document.createElement(o.e);
    if (o.i) {
      e.setAttribute("id", o.i);
    }
    if (o.c) {
      e.setAttribute("class", o.c);
    }
    if (o.ty) {
      e.setAttribute("type", o.ty);
    }
    if (o.tx) {
      e.innerText = o.tx;
    }
    if (o.v) {
      e.value = o.v;
    }
    if (o.di) {
      e.setAttribute("data-id", o.di);
    }
    if (o.dti) {
      e.setAttribute("data-tier_id", o.dti);
    }
    if (o.dei) {
      e.setAttribute("data-event_id", o.dei);
    }
    if (o.ri) {
      e.setAttribute("data-record-id", o.ri);
    }
    if (o.dte) {
      e.setAttribute("data-total-events", o.dte);
    }
    return e;
  }
}
const S = new Score(new H());