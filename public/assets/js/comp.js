$(() => {
  // library for rendering html elements
  function h(o) {
    const e = $(`<${o.e}>`);
    if (o.c) {
      e.attr("class", o.c);
    }
    if (o.i) {
      e.attr("id", o.i);
    }
    if (o.ty) {
      e.attr("type", o.ty);
    }
    if (o.tx) {
      e.text(o.tx);
    }
    if (o.v) {
      e.val(o.v);
    }
    if (o.di) {
      e.attr("data-id", o.di);
    }
    if (o.dt) {
      e.attr("data-type", o.dt);
    }
    return e;
  }
  // renders page
  function renderCompPage() {
    getCompData();
  }
  // retrieves competitor data and renders page components
  function getCompData() {
    $.get("/api/comp/year/" + parseInt($("#year-select").val()), (data) => {
      renderCompSelectionMenu(data);
      renderCompInfo();
      renderCompAddInfo();
    });
  }
  // renders competitor selection menu component
  function renderCompSelectionMenu(data) {
    $("#view-dynamic-comp-select").empty();
    const menuTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Select a Competitor",
    });
    $("#view-dynamic-comp-select").append(menuTitleEl);
    const menuEl = h({ e: "select", i: "comp-select" });
    for (let i = 0; i < data.length; i++) {
      const optionEl = h({
        e: "option",
        v: data[i].id,
        dt: data[i].team,
        tx: data[i].text,
      });
      menuEl.append(optionEl);
    }
    $("#view-dynamic-comp-select").append(menuEl);
  }
  // retrieves selected competitor information and renders page components
  function renderCompInfo() {
    $.get(
      `/api/comp/competitor/${parseInt($("#comp-select").val())}`,
      (data) => {
        return data.team === 0 ? renderIndividual(data) : renderTeam(data);
      }
    );
  }
  // renders competitor information section if tier is individual
  function renderIndividual(data) {
    $("#view-dynamic-comp-info").empty();
    const compNumTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Competitor Number",
    });
    const compNumEl = h({ e: "input", i: "comp-number", v: data.comp_number });
    const firstTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "First Name",
    });
    const firstEl = h({ e: "input", i: "first-name", v: data.first_name });
    const lastTitleEl = h({ e: "p", c: "item-title mx-auto", tx: "Last Name" });
    const lastEl = h({ e: "input", i: "last-name", v: data.last_name });
    const saveEl = h({
      e: "button",
      i: "comp-save-button",
      di: data.id,
      c: "button",
      tx: "Save Changes",
    });
    const delEl = h({
      e: "button",
      i: "comp-delete-button",
      c: "button  del-btn",
      di: data.id,
      tx: "Delete Competitor",
    });
    const orgSelectTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Organization",
    });
    const orgSelectEl = h({ e: "select", i: "edit-org-select" });
    for (let i = 0; i < data.organizations.length; i++) {
      const optionEl = h({
        e: "option",
        v: data.organizations[i].id,
        tx: data.organizations[i].name,
      });
      if (data.organizations[i].active) {
        optionEl.attr("selected", "selected");
      }
      orgSelectEl.append(optionEl);
    }
    $("#view-dynamic-comp-info").append(compNumTitleEl);
    $("#view-dynamic-comp-info").append(compNumEl);
    $("#view-dynamic-comp-info").append(firstTitleEl);
    $("#view-dynamic-comp-info").append(firstEl);
    $("#view-dynamic-comp-info").append(lastTitleEl);
    $("#view-dynamic-comp-info").append(lastEl);
    $("#view-dynamic-comp-info").append(orgSelectTitleEl);
    $("#view-dynamic-comp-info").append(orgSelectEl);
    $("#view-dynamic-comp-info").append(saveEl);
    $("#view-dynamic-comp-info").append(delEl);
  }
  // renders competitor information section if tier is team
  function renderTeam(data) {
    $("#view-dynamic-comp-info").empty();
    const compNumTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Competitor Number",
    });
    const compNumEl = h({ e: "input", i: "comp-number", v: data.comp_number });
    const teamTitleEl = h({ e: "p", c: "item-title mx-auto", tx: "Team Name" });
    const teamEl = h({ e: "input", i: "team-name", v: data.team_name });
    const groupTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Group Names",
    });
    const groupEl = h({ e: "input", i: "group-names", v: data.group_names });
    const saveEl = h({
      e: "button",
      i: "comp-save-button",
      di: data.id,
      c: "button",
      tx: "Save Changes",
    });
    const delEl = h({
      e: "button",
      i: "comp-delete-button",
      c: "button del-btn",
      di: data.id,
      tx: "Delete Competitor",
    });
    const orgSelectTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Organization",
    });
    const orgSelectEl = h({ e: "select", i: "edit-org-select" });
    if (data.organizations !== undefined) {
      for (let i = 0; i < data.organizations.length; i++) {
        const optionEl = h({
          e: "option",
          v: data.organizations[i].id,
          tx: data.organizations[i].name,
        });
        if (data.organizations[i].active) {
          optionEl.attr("selected", "selected");
        }
        orgSelectEl.append(optionEl);
      }
    }
    $("#view-dynamic-comp-info").append(compNumTitleEl);
    $("#view-dynamic-comp-info").append(compNumEl);
    $("#view-dynamic-comp-info").append(teamTitleEl);
    $("#view-dynamic-comp-info").append(teamEl);
    $("#view-dynamic-comp-info").append(groupTitleEl);
    $("#view-dynamic-comp-info").append(groupEl);
    $("#view-dynamic-comp-info").append(orgSelectTitleEl);
    $("#view-dynamic-comp-info").append(orgSelectEl);
    $("#view-dynamic-comp-info").append(saveEl);
    $("#view-dynamic-comp-info").append(delEl);
  }
  // renders add competitor section
  function renderCompAddInfo() {
    $("#add-dynamic-comp-info").empty();
    const addCompNumTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Enter Competitor Number",
    });
    const addCompNumEl = h({ e: "input", i: "add-comp-number", ty: "text" });
    const addFirstTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Enter Competitor's First Name",
    });
    const addFirstEl = h({ e: "input", i: "add-first-name", ty: "text" });
    const addLastTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Enter Competitor's Last Name",
    });
    const addLastEl = h({ e: "input", i: "add-last-name", ty: "text" });
    const addTeamTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Enter Competitor Team Name",
    });
    const addTeamEl = h({ e: "input", i: "add-team-name", ty: "text" });
    const addGroupTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Enter the Group's Names",
    });
    const addGroupEl = h({ e: "input", i: "add-group-names", ty: "text" });
    const addOrgMenuTitleEl = h({
      e: "p",
      c: "item-title mx-auto",
      tx: "Select the Competitor's Organization",
    });
    const addSaveEl = h({
      e: "button",
      i: "add-comp-save-button",
      c: "button mx-auto",
      tx: "Add Competitor",
    });
    $.get(`/api/comp/tier/${parseInt($("#tier-select").val())}`, (res) => {
      if (res[0].team === 0) {
        $.get("/api/comp/org/", (data) => {
          const addOrgMenuEl = h({ e: "select", i: "org-select" });
          for (let i = 0; i < data.length; i++) {
            const addOptionEl = h({
              e: "option",
              v: data[i].id,
              tx: data[i].name,
            });
            addOrgMenuEl.append(addOptionEl);
          }
          $("#add-dynamic-comp-info").append(addCompNumTitleEl);
          $("#add-dynamic-comp-info").append(addCompNumEl);
          $("#add-dynamic-comp-info").append(addFirstTitleEl);
          $("#add-dynamic-comp-info").append(addFirstEl);
          $("#add-dynamic-comp-info").append(addLastTitleEl);
          $("#add-dynamic-comp-info").append(addLastEl);
          $("#add-dynamic-comp-info").append(addOrgMenuTitleEl);
          $("#add-dynamic-comp-info").append(addOrgMenuEl);
          $("#add-dynamic-comp-info").append(addSaveEl);
        });
      } else {
        $.get("/api/comp/org/", (data) => {
          const addOrgMenuEl = h({ e: "select", i: "org-select" });
          for (let i = 0; i < data.length; i++) {
            const addOptionEl = h({
              e: "option",
              v: data[i].id,
              tx: data[i].name,
            });
            addOrgMenuEl.append(addOptionEl);
          }
          $("#add-dynamic-comp-info").append(addCompNumTitleEl);
          $("#add-dynamic-comp-info").append(addCompNumEl);
          $("#add-dynamic-comp-info").append(addTeamTitleEl);
          $("#add-dynamic-comp-info").append(addTeamEl);
          $("#add-dynamic-comp-info").append(addGroupTitleEl);
          $("#add-dynamic-comp-info").append(addGroupEl);
          $("#add-dynamic-comp-info").append(addOrgMenuTitleEl);
          $("#add-dynamic-comp-info").append(addOrgMenuEl);
          $("#add-dynamic-comp-info").append(addSaveEl);
        });
      }
    });
  }
  // renders add message after a competitor is added
  function renderAddMessage() {
    const inputObj = {
      type: "POST",
      data: {
        tier_id: parseInt($("#tier-select").val()),
        comp_number:
          $("#add-comp-number").val() === undefined
            ? null
            : $("#add-comp-number").val().trim(),
        first_name:
          $("#add-first-name").val() === undefined
            ? null
            : $("#add-first-name").val().trim(),
        last_name:
          $("#add-last-name").val() === undefined
            ? null
            : $("#add-last-name").val().trim(),
        team_name:
          $("#add-team-name").val() === undefined
            ? null
            : $("#add-team-name").val().trim(),
        group_names:
          $("#add-group-names").val() === undefined
            ? null
            : $("#add-group-names").val().trim(),
        org_id: parseInt($("#org-select").val()),
        year_id: parseInt($("#year-select").val()),
      },
    };
    $.ajax("/api/comp/", inputObj).then(() => {
      const pEl = h({
        e: "p",
        c: "item-title mx-auto",
        tx: "Success! Competitor Added!",
      });
      $("#add-dynamic-comp-info").append(pEl);
      $("#add-comp-number").val("");
      $("#add-first-name").val("");
      $("#add-last-name").val("");
      $("#add-team-name").val("");
      $("#add-group-names").val("");
    });
  }
  // starting script
  renderCompPage();
  // event listener for save and delete buttons
  $(document).on("click", ".button", (event) => {
    const inputObj = {
      type: "PUT",
      data: {
        id: parseInt($(event.target).attr("data-id")),
        comp_number: $("#comp-number").val().trim(),
        first_name:
          $("#first-name").val() === undefined
            ? null
            : $("#first-name").val().trim(),
        last_name:
          $("#last-name").val() === undefined
            ? null
            : $("#last-name").val().trim(),
        team_name:
          $("#team-name").val() === undefined
            ? null
            : $("#team-name").val().trim(),
        group_names:
          $("#group-names").val() === undefined
            ? null
            : $("#group-names").val().trim(),
        org_id: parseInt($("#edit-org-select").val()),
      },
    };
    if ($(event.target).attr("id") === "comp-save-button") {
      $.ajax("/api/comp/update/", inputObj).then(() => {
        const pEl = h({
          e: "p",
          c: "item-title mx-auto",
          tx: "Success! Changes Saved!",
        });
        $("#view-dynamic-comp-info").append(pEl);
      });
    } else if ($(event.target).attr("id") === "comp-delete-button") {
      $.ajax("/api/comp/", {
        type: "DELETE",
        data: { id: parseInt($(event.target).attr("data-id")) },
      }).then(() => renderCompPage());
    } else if ($(event.target).attr("id") === "add-comp-save-button") {
      renderAddMessage();
    }
  });
  // event listener for year selection menu
  $(document).on("change", "#year-select", () => renderCompPage());
  // event listener for competitor selection menu
  $(document).on("change", "#comp-select", () => renderCompInfo());
  // event listener for tier selection menu
  $(document).on("change", "#tier-select", () => renderCompAddInfo());
});
