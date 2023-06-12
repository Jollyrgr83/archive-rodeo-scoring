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
class Report {
  data;
  constructor(H) {
    this.H = H;
    this.data = {};
    this.getEls();
    this.events();
    this.getAll();
  }
  getEls() {
    this.selectYear = document.getElementById("year-select");
    this.selectReport = document.getElementById("report-select");
    this.selectOrg = document.getElementById("org-select");
    this.selectTier = document.getElementById("tier-select");
    this.selectEvent = document.getElementById("event-select");
    this.dynamic = document.getElementById("dynamic");
    this.print = document.getElementById("print");
  }
  events() {
    this.selectYear.addEventListener("change", this.getAll.bind(this));
    this.selectReport.addEventListener("change", this.renderTierMenu.bind(this));
    this.selectOrg.addEventListener("change", this.renderTierMenu.bind(this));
    this.selectTier.addEventListener("change", this.renderEventMenu.bind(this));
    this.selectEvent.addEventListener("change", this.renderScores.bind(this));
    this.print.addEventListener("change", this.printReport.bind(this));
    document.addEventListener("change", this.dynamicSelectHandler.bind(this));
  }
  printReport(e) {
    if (e.target.getAttribute("class") !== null && e.target.getAttribute("class").includes("button")) {
      this.H.get("/api/retrieve-report/");
    }
  }
  dynamicSelectHandler(e) {
    if (e.target.getAttribute("id") === "dynamic-select-org") {
      this.renderScores().bind(this);
    }
  }
  getAll() {
    this.H.get("/api/report/all/" + this.selectYear.value).then(r => {
      this.data = JSON.parse(r);
      this.renderOrgMenu();
      this.renderTierMenu();
    });
  }
  renderOrgMenu() {
    this.selectOrg.innerHTML = "";
    const optionEl = this.r({ e: "option", v: "all", tx: "All Organizations" });
    this.selectOrg.appendChild(optionEl);
    const keys = Object.keys(this.data.org_ref);
    for (let i = 0; i < keys.length; i++) {
      const optionEl = this.r({ e: "option", v: keys[i], tx: this.data.org_ref[keys[i]].name });
      this.selectOrg.appendChild(optionEl);
    }
  }
  renderTierMenu() {
    this.selectTier.innerHTML = "";
    this.selectEvent.innerHTML = "";
    // document.getElementById("dynamic-menu").innerHTML = "";
    // render tier-select menu
    const menuArray = [];
    const tier_id_array = Object.keys(this.data.tiers);
    for (let i = 0; i < tier_id_array.length; i++) {
      const tier_id = parseInt(tier_id_array[i]);
      menuArray.push({ id: tier_id, text: `${this.data.tier_ref[tier_id].name}` });
    }
    for (let i = 0; i < menuArray.length; i++) {
      const optionEl = this.r({ e: "option", tx: menuArray[i].text, v: menuArray[i].id });
      this.selectTier.appendChild(optionEl);
    }
    // initialize event-select menu
    const optionArray = [];
    const tier_id = menuArray[0].id;
    const event_id_array = Object.keys(this.data.tiers[tier_id]);
    for (let i = 0; i < event_id_array.length; i++) {
      const event_id = isNaN(parseInt(event_id_array[i])) ? event_id_array[i] : parseInt(event_id_array[i]);
      optionArray.push({id: `${tier_id}-${event_id}`, text: `${this.data.tier_ref[tier_id].name} - ${this.data.event_ref[event_id]}`});
    }
    for (let i = 0; i < optionArray.length; i++) {
      const optionEl = this.r({ e: "option", tx: optionArray[i].text, v: optionArray[i].id });
      this.selectEvent.appendChild(optionEl);
    }
    this.renderScores();
  }
  renderEventMenu() {
    this.selectEvent.innerHTML = "";
    const optionArray = [];
    const tier_id = parseInt(this.selectTier.value);
    const event_id_array = Object.keys(this.data.tiers[tier_id]);
    for (let i = 0; i < event_id_array.length; i++) {
      const event_id = isNaN(parseInt(event_id_array[i])) ? event_id_array[i] : parseInt(event_id_array[i]);
      optionArray.push({id: `${tier_id}-${event_id}`, text: `${this.data.tier_ref[tier_id].name} - ${this.data.event_ref[event_id]}`});
    }
    for (let i = 0; i < optionArray.length; i++) {
      const optionEl = this.r({ e: "option", tx: optionArray[i].text, v: optionArray[i].id });
      this.selectEvent.appendChild(optionEl);
    }
    this.renderScores();
  }
  renderScores() {
    const content = [
      { text: "", fontSize: 22 },
      { table: { headerRows: 1, widths: [ "15%", "40%", "15%", "15%", "15%" ], body: [ [ "Competitor Number", "Organization", "Place", "Score", "Time" ] ] } }
    ];
    this.dynamic.innerHTML = "";
    const tier_id = parseInt(this.selectEvent.value.split("-")[0]);
    const event_id = isNaN(parseInt(this.selectEvent.value.split("-")[1])) ? this.selectEvent.value.split("-")[1] : parseInt(this.selectEvent.value.split("-")[1]);
    const org_id = isNaN(parseInt(this.selectOrg.value)) ? "all" : parseInt(this.selectOrg.value);
    content[0].text = this.data.event_ref[event_id];
    for (let i = 0; i < this.data.tiers[tier_id][event_id].length; i++) {
      const comp_id = this.data.tiers[tier_id][event_id][i].competitor_id;
      const compNum = this.data.comp_ref[comp_id].comp_number;
      const orgName = this.data.comp_ref[comp_id].org_name;
      const sc = this.data.tiers[tier_id][event_id][i].score;
      const tt = parseFloat(this.data.tiers[tier_id][event_id][i].total_seconds);
      const tmin = (Math.floor(tt / 60)).toFixed(0);
      const tsec = (Math.floor(tt % 60)).toFixed(0);
      const trem = ((tt % 60) - tsec).toFixed(2);
      const tminDisp = tmin.length === 2 ? tmin : `0${tmin}`;
      const tsecDisp = tsec.length === 2 ? tsec : `0${tsec}`;
      const tremDisp = `${trem[2]}${trem[3]}`
      const ttime = `${tminDisp}:${tsecDisp}.${tremDisp}`;
      const tplace = i + 1;
      const tArr = [compNum, orgName, tplace, sc, ttime];
      content[1].table.body.push(tArr);
    }
    // render event title
    const pTitleEl = this.r({ e: "p", c: "subtitle mx-auto", tx: this.data.event_ref[event_id] });
    this.dynamic.appendChild(pTitleEl);
    const lineEl = this.r({ e: "hr", c: "line full mx-auto"});
    this.dynamic.appendChild(lineEl);
    let x = this.data.tiers[tier_id][event_id].length;
    if (this.selectReport.value === "0") {
      x = this.data.tiers[tier_id][event_id].length < 3 ? this.data.tiers[tier_id][event_id].length : 3;
    }
    for (let i = 0; i < x; i++) {
      // retrieve competitor information
      let competitor_id = this.data.tiers[tier_id][event_id][i].competitor_id;
      if (org_id === "all" || org_id === this.data.comp_ref[competitor_id].org_id) {
        // render html elements
        const divEl = this.r({ e: "div", c: "result-container mx-auto" });
        const pRankEl = this.r({ e: "p", c: "subtitle mx-auto", tx: `Place: ${i + 1}` });
        const divLineEl = this.r({ e: "hr", c: "line large mx-auto"});
        const pCompNumberEl = this.r({ e: "p", c: "text mx-auto", tx: this.data.comp_ref[competitor_id].comp_number });
        const pNameEl = this.r({ e: "p", c: "text mx-auto", tx: this.data.tier_ref[tier_id].team === 0 ? `${this.data.comp_ref[competitor_id].first_name} ${this.data.comp_ref[competitor_id].last_name}` : `${this.data.comp_ref[competitor_id].team_name}: ${this.data.comp_ref[competitor_id].group_names}` });
        const pOrgEl = this.r({ e: "p", c: "text mx-auto", tx: this.data.comp_ref[competitor_id].org_name });
        const pScoreEl = this.r({ e: "p", c: "text mx-auto", tx: this.data.tiers[tier_id][event_id][i].score });
        const pTimeEl = this.r({ e: "p", c: "text mx-auto", tx: `${Math.floor(this.data.tiers[tier_id][event_id][i].total_seconds / 60)}:${(this.data.tiers[tier_id][event_id][i].total_seconds % 60).toFixed(2)}` });
        divEl.appendChild(pRankEl);
        divEl.appendChild(divLineEl);
        divEl.appendChild(pCompNumberEl);
        divEl.appendChild(pNameEl);
        divEl.appendChild(pOrgEl);
        divEl.appendChild(pScoreEl);
        divEl.appendChild(pTimeEl);
        this.dynamic.appendChild(divEl);
      }
    }
    this.generateReport({ data: content });
  }
  generateReport(c) {
    this.H.post("/api/generate-report/", c);
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
const R = new Report(new H());