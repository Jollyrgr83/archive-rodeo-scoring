class Nav {
    rts;
    els;
    constructor() {
        this.setRoutes();
        this.getEls();
        this.events();
    }
    setRoutes() {
        this.rts = {
            home: "/",
            view: "/view",
            year: "/year",
            comp: "/competitors",
            score: "/score",
            reports: "/reports"
        };
    }
    getEls() {
        this.els = document.getElementsByClassName("nav-icon mx-auto");
    }
    events() {
        for (let i = 0; i < this.els.length; i++) {
            this.els[i].addEventListener("click", this.click.bind(this));
        }
    }
    click(e) {
        window.location.href=this.rts[e.target.id];
    }
}
const N = new Nav();