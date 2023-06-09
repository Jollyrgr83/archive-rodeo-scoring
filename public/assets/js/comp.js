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
class C {
    H;
    constructor(H) {
        this.H = H;
        this.renderCompPage();
        this.events();
    }
    renderCompPage() {
        this.getCompData();
    }
    events() {
        document.addEventListener("click", this.buttonEvents.bind(this));
        document.addEventListener("change", this.selectEvents.bind(this));
    }
    buttonEvents(e) {
        if (e.target.getAttribute("class") !== null && e.target.getAttribute("class").includes("button")) {
            if (e.target.getAttribute("id") === "comp-save-button") {
                const data = {
                    id: parseInt(e.target.getAttribute("data-id")),
                    comp_number: document.getElementById("comp-number").value.trim(),
                    first_name: document.getElementById("first-name").value.trim(),
                    last_name: document.getElementById("last-name").value.trim(),
                    org_id: parseInt(document.getElementById("edit-org-select").value),
                };
                if (document.getElementById("team-name") !== null) {
                    data.team_name = document.getElementById("team-name").value.trim();
                }
                if (document.getElementById("group-names") !== null) {
                    data.group_names = document.getElementById("group-names").value.trim();
                }
                this.H.put("/api/comp/update/", data).then(r => {
                    const pEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Success! Changes Saved!"});
                    document.getElementById("view-dynamic-comp-info").appendChild(pEl);
                });
            } else if (e.target.getAttribute("id") === "comp-delete-button") {
                this.H.delete("/api/comp/", {id: parseInt(e.target.getAttribute("data-id"))}).then(r => this.renderCompPage());
            } else if (e.target.getAttribute("id") === "add-comp-save-button") {
                this.renderAddMessage();
            }
        }
    }
    selectEvents(e) {
        if (e.target.getAttribute("id") === "year-select") {
            this.renderCompPage();
        } else if (e.target.getAttribute("id") === "comp-select") {
            this.renderCompInfo();
        } else if (e.target.getAttribute("id") === "tier-select") {
            this.renderCompAddInfo();
        }
    }
    getCompData() {
        let u = "/api/comp/year/" + document.getElementById("year-select").value;
        this.H.get(u).then(r => {
            try {
                let p = JSON.parse(r);
                this.renderCompSelectionMenu(p);
                this.renderCompInfo();
                this.renderCompAddInfo();
            } catch (er) {
                console.log("er", er);
            }
        });
    }
    renderCompSelectionMenu(d) {
        let el = document.getElementById("view-dynamic-comp-select");
        el.innerHTML = "";
        const menuTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Select a competitor"});
        el.appendChild(menuTitleEl);
        const menuEl = this.r({e: "select", i: "comp-select", c: "full mx-auto"});
        d.forEach(i => {
            const optionEl = this.r({e: "option", v: i.id, dt: i.team, tx: i.text});
            menuEl.appendChild(optionEl);
        });
        el.appendChild(menuEl);
    }
    renderCompInfo() {
        let u = "api/comp/competitor/" + document.getElementById("comp-select").value;
        this.H.get(u).then(r => {
            try {
                let p = JSON.parse(r);
                if (p.team === 0) {
                    this.renderIndividual(p);
                } else {
                    this.renderTeam(p);
                }
            } catch (er) {
                console.log("er", er);
            }
        });
    }
    renderCompAddInfo() {
        let el = document.getElementById("add-dynamic-comp-info");
        el.innerHTML = "";
        const addCompNumTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Competitor Number"});
        const addCompNumEl = this.r({ e: "input", i: "add-comp-number", ty: "text", c: "full mx-auto" });
        const addFirstTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "First Name"});
        const addFirstEl = this.r({ e: "input", i: "add-first-name", ty: "text", c: "full mx-auto" });
        const addLastTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Last Name"});
        const addLastEl = this.r({ e: "input", i: "add-last-name", ty: "text", c: "full mx-auto" });
        const addTeamTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Team Name"});
        const addTeamEl = this.r({ e: "input", i: "add-team-name", ty: "text", c: "full mx-auto" });
        const addGroupTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Competitor Names"});
        const addGroupEl = this.r({ e: "input", i: "add-group-names", ty: "text", c: "full mx-auto" });
        const addOrgMenuTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Organization"});
        const addSaveEl = this.r({e: "button", i: "add-comp-save-button", c: "button blue mx-auto", tx: "Add"});
        let u = "/api/comp/tier/" + document.getElementById("tier-select").value;
        this.H.get(u).then(r => {
            try {
                let p = JSON.parse(r);
                if (p[0].team === 0) {
                    this.H.get("/api/comp/org").then(rr => {
                        try {
                            let pp = JSON.parse(rr);
                            const addOrgMenuEl = this.r({ e: "select", i: "org-select", c: "full mx-auto" });
                            pp.forEach(i => {
                                const addOptionEl = this.r({e: "option", v: i.id, tx: i.name});
                                addOrgMenuEl.appendChild(addOptionEl);
                            });
                            el.appendChild(addCompNumTitleEl);
                            el.appendChild(addCompNumEl);
                            el.appendChild(addFirstTitleEl);
                            el.appendChild(addFirstEl);
                            el.appendChild(addLastTitleEl);
                            el.appendChild(addLastEl);
                            el.appendChild(addOrgMenuTitleEl);
                            el.appendChild(addOrgMenuEl);
                            el.appendChild(addSaveEl);
                        } catch (er) {
                            console.log("er", er);
                        }
                    });
                } else {
                    this.H.get("/api/comp/org/").then(rr => {
                        try {
                            let pp = JSON.parse(rr);
                            const addOrgMenuEl = this.r({ e: "select", i: "org-select", c: "full mx-auto" });
                            pp.forEach(i => {
                                const addOptionEl = this.r({e: "option", v: i.id, tx: i.name});
                                addOrgMenuEl.appendChild(addOptionEl);
                            });
                            el.appendChild(addCompNumTitleEl);
                            el.appendChild(addCompNumEl);
                            el.appendChild(addTeamTitleEl);
                            el.appendChild(addTeamEl);
                            el.appendChild(addGroupTitleEl);
                            el.appendChild(addGroupEl);
                            el.appendChild(addOrgMenuTitleEl);
                            el.appendChild(addOrgMenuEl);
                            el.appendChild(addSaveEl);
                        } catch (er) {
                            console.log("er", er);
                        }
                    });
                }
            } catch (er) {
                console.log("er", er);
            }
        });
    }
    renderIndividual(d) {
        let el = document.getElementById("view-dynamic-comp-info");
        el.innerHTML = "";
        const compNumTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Competitor Number"});
        const compNumEl = this.r({ e: "input", i: "comp-number", v: d.comp_number, c: "full mx-auto" });
        const firstTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "First Name"});
        const firstEl = this.r({ e: "input", i: "first-name", v: d.first_name, c: "full mx-auto" });
        const lastTitleEl = this.r({ e: "p", c: "subtitle mx-auto", tx: "Last Name" });
        const lastEl = this.r({ e: "input", i: "last-name", v: d.last_name, c: "full mx-auto" });
        const saveEl = this.r({e: "button", i: "comp-save-button", di: d.id, c: "button blue mx-auto", tx: "Update"});
        const delEl = this.r({e: "button", i: "comp-delete-button", c: "button red del-btn mx-auto", di: d.id, tx: "Delete"});
        const orgSelectTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Organization"});
        const orgSelectEl = this.r({ e: "select", i: "edit-org-select", c: "full mx-auto" });
        d.organizations.forEach(i => {
            const optionEl = this.r({e: "option", v: i.id, tx: i.name});
            if (i.active) {
                optionEl.setAttribute("selected", "selected");
            }
            orgSelectEl.appendChild(optionEl);
        });
        const rowContainerEl = this.r({e: "div", c: "row text-center mx-auto"});
        el.appendChild(compNumTitleEl);
        el.appendChild(compNumEl);
        el.appendChild(firstTitleEl);
        el.appendChild(firstEl);
        el.appendChild(lastTitleEl);
        el.appendChild(lastEl);
        el.appendChild(orgSelectTitleEl);
        el.appendChild(orgSelectEl);
        rowContainerEl.appendChild(saveEl);
        rowContainerEl.appendChild(delEl);
        el.appendChild(rowContainerEl);
    }
    renderTeam(d) {
        let el = document.getElementById("view-dynamic-comp-info");
        el.innerHTML = "";
        const compNumTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Competitor Number"});
        const compNumEl = this.r({ e: "input", i: "comp-number", v: d.comp_number, c: "full mx-auto" });
        const teamTitleEl = this.r({ e: "p", c: "subtitle mx-auto", tx: "Team Name" });
        const teamEl = this.r({ e: "input", i: "team-name", v: d.team_name, c: "full mx-auto" });
        const groupTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Group Names"});
        const groupEl = this.r({ e: "input", i: "group-names", v: d.group_names, c: "full mx-auto" });
        const saveEl = this.r({e: "button", i: "comp-save-button", di: d.id, c: "button blue mx-auto", tx: "Save"});
        const delEl = this.r({e: "button", i: "comp-delete-button", c: "button red del-btn mx-auto", di: d.id, tx: "Delete"});
        const orgSelectTitleEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Organization"});
        const rowContainerEl = this.r({e: "div", c: "row mx-auto"});
        const orgSelectEl = this.r({ e: "select", i: "edit-org-select", c: "full mx-auto" });
        if (d.organizations !== undefined) {
            d.organizations.forEach(i => {
                const optionEl = this.r({e: "option", v: i.id, tx: i.name});
                if (i.active) {
                    optionEl.setAttribute("selected", "selected");
                }
                orgSelectEl.appendChild(optionEl);
            });
        }
        el.appendChild(compNumTitleEl);
        el.appendChild(compNumEl);
        el.appendChild(teamTitleEl);
        el.appendChild(teamEl);
        el.appendChild(groupTitleEl);
        el.appendChild(groupEl);
        el.appendChild(orgSelectTitleEl);
        el.appendChild(orgSelectEl);
        rowContainerEl.appendChild(saveEl);
        rowContainerEl.appendChild(delEl);
        el.appendChild(rowContainerEl);
    }
    renderAddMessage() {
        const data = {
            tier_id: parseInt(document.getElementById("tier-select").value),
            comp_number: document.getElementById("add-comp-number") === null ? null : document.getElementById("add-comp-number").value.trim(),
            first_name: document.getElementById("add-first-name") === null ? null : document.getElementById("add-first-name").value.trim(),
            last_name: document.getElementById("add-last-name") === null ? null : document.getElementById("add-last-name").value.trim(),
            team_name: document.getElementById("add-team-name") === null ? null : document.getElementById("add-team-name").value.trim(),
            group_names: document.getElementById("add-group-names") === null ? null : document.getElementById("add-group-names").value.trim(),
            org_id: parseInt(document.getElementById("org-select").value),
            year_id: parseInt(document.getElementById("year-select").value)
        };
        this.H.post("/api/comp/", data).then(r => {
            const pEl = this.r({e: "p", c: "subtitle mx-auto", tx: "Success! Competitor Added!"});
            document.getElementById("add-dynamic-comp-info").appendChild(pEl);
            document.getElementById("add-comp-number").value = "";
            document.getElementById("add-first-name").value = "";
            document.getElementById("add-last-name").value = "";
            if (document.getElementById("add-team-name") !== null) {
                document.getElementById("add-team-name").value = "";
            }
            if (document.getElementById("add-group-names") !== null) {
                document.getElementById("add-group-names").value = "";
            }
        });
    }
    r(o) {
        const e = document.createElement(o.e);
        if (o.c) {
            e.setAttribute("class", o.c);
        }
        if (o.i) {
            e.setAttribute("id", o.i);
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
        if (o.dt) {
            e.setAttribute("data-type", o.dt);
        }
        return e;
    }
}
const Comp = new C(new H());