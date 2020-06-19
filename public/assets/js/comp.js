$(() => {
  const h = (o) => {
    const e = $(`<${o.e}>`);
    if (o.c) { e.attr("class", o.c); }
    if (o.i) { e.attr("id", o.i); }
    if (o.ty) { e.attr("type", o.ty); }
    if (o.tx) { e.text(o.tx); }
    if (o.di) { e.attr("data-id", o.di); }
    if (o.dt) { e.attr("data-tier_id", o.dt); }
    if (o.de) { e.attr("data-event_id", o.de); }
    if (o.v) { e.val(o.v); }
    if (o.s) { e.attr("style", o.s); }
    if (o.dty) { e.attr("data-type", o.dty) }
    return e;
  };
  const renderCompPage = () => getCompData();
  const getCompData = () => {
    $.get("/api/comp/year/" + parseInt($("#year-select").val()), data => {
      renderCompSelectionMenu(data);
      renderCompInfo();
      renderCompAddInfo();
    });
  }
  const renderAddMessage = () => {
    var inputObj = {
      tier_id: parseInt($("#tier-select").val()),
      comp_number: $("#add-comp-number").val() === undefined ? null : $("#add-comp-number").val().trim(),
      first_name: $("#add-first-name").val() === undefined ? null : $("#add-first-name").val().trim(),
      last_name: $("#add-last-name").val() === undefined ? null : $("#add-last-name").val().trim(),
      team_name: $("#add-team-name").val() === undefined ? null : $("#add-team-name").val().trim(),
      group_names: $("#add-group-names").val() === undefined ? null : $("#add-group-names").val().trim(),
      org_id: parseInt($("#org-select").val()),
      year_id: parseInt($("#year-select").val())
    };
    $.ajax("/api/comp/", { type: "POST", data: inputObj }).then(() => {
      var textEl = h({e: "p", c: "item-title mx-auto", tx: `Success! Competitor Added!`});
      $("#add-dynamic-comp-info").append(textEl);
      $("#add-comp-number").val("");
      $("#add-first-name").val("");
      $("#add-last-name").val("");
      $("#add-team-name").val("");
      $("#add-group-names").val("");
    });
  }
  const renderCompSelectionMenu = data => {
    $("#view-dynamic-comp-select").empty();
    var menuTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Select a Competitor"});
    $("#view-dynamic-comp-select").append(menuTitleEl);
    var menuEl = h({e: "select", i: "comp-select"});
    for (let i = 0; i < data.length; i++) {
      var optionEl = h({e: "option", v: data[i].id, dty: data[i].team, tx: data[i].text});
      menuEl.append(optionEl);
    }
    $("#view-dynamic-comp-select").append(menuEl);
  }
  const renderCompInfo = () => $.get("/api/comp/competitor/" + parseInt($("#comp-select").val()), data => data.team === 0 ? renderIndividual(data) : renderTeam(data));
  const renderCompAddInfo = () => {
    $("#add-dynamic-comp-info").empty();
    var compNumberTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Enter Competitor Number"});
    var compNumberEl = h({e: "input", i: "add-comp-number", ty: "text"});
    var firstNameTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Enter Competitor's First Name"});
    var firstNameEl = h({e: "input", i: "add-first-name", ty: "text"});
    var lastNameTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Enter Competitor's Last Name"});
    var lastNameEl = h({e: "input", i: "add-last-name", ty: "text"});
    var teamNameTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Enter Competitor Team Name"});
    var teamNameEl = h({e: "input", i: "add-team-name", ty: "text"});
    var groupNamesTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Enter the Group's Names"});
    var groupNamesEl = h({e: "input", i: "add-group-names", ty: "text"});
    var orgMenuTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Select the Competitor's Organization"});
    var saveButtonEl = h({e: "button", i: "add-comp-save-button", c: "button mx-auto", tx: "Add Competitor"});
    $.get("/api/comp/tier/" + parseInt($("#tier-select").val()), res => {
      if (res[0].team === 0) {
        $.get("/api/comp/org/", data => {
          var orgMenuEl = h({e: "select", i: "org-select"});
          for (let i = 0; i < data.length; i++) {
            var optionEl = h({e: "option", v: data[i].id, tx: data[i].name});
            orgMenuEl.append(optionEl);
          }
          $("#add-dynamic-comp-info").append(compNumberTitleEl);
          $("#add-dynamic-comp-info").append(compNumberEl);
          $("#add-dynamic-comp-info").append(firstNameTitleEl);
          $("#add-dynamic-comp-info").append(firstNameEl);
          $("#add-dynamic-comp-info").append(lastNameTitleEl);
          $("#add-dynamic-comp-info").append(lastNameEl);
          $("#add-dynamic-comp-info").append(orgMenuTitleEl);
          $("#add-dynamic-comp-info").append(orgMenuEl);
          $("#add-dynamic-comp-info").append(saveButtonEl);
        });
      } else {
        $.get("/api/comp/org/", data => {
          var orgMenuEl = h({e: "select", i: "org-select"});
          for (let i = 0; i < data.length; i++) {
            var optionEl = h({e: "option", v: data[i].id, tx: data[i].name});
            orgMenuEl.append(optionEl);
          }
          $("#add-dynamic-comp-info").append(compNumberTitleEl);
          $("#add-dynamic-comp-info").append(compNumberEl);
          $("#add-dynamic-comp-info").append(teamNameTitleEl);
          $("#add-dynamic-comp-info").append(teamNameEl);
          $("#add-dynamic-comp-info").append(groupNamesTitleEl);
          $("#add-dynamic-comp-info").append(groupNamesEl);
          $("#add-dynamic-comp-info").append(orgMenuTitleEl);
          $("#add-dynamic-comp-info").append(orgMenuEl);
          $("#add-dynamic-comp-info").append(saveButtonEl);
        });
      }
    });
  }
  const renderTeam = data => {
    $("#view-dynamic-comp-info").empty();
    var compNumberTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Competitor Number"});
    var compNumberEl = h({e: "input", i: "comp-number", v: data.comp_number});
    var teamNameTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Team Name"});
    var teamNameEl = h({e: "input", i: "team-name", v: data.team_name});
    var groupNamesTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Group Names"});
    var groupNamesEl = h({e: "input", i: "group-names", v: data.group_names});
    var saveButtonEl = h({e: "button", i: "comp-save-button", di: data.id, c: "button", tx: "Save Changes"});
    var delButtonEl = h({e: "button", i: "comp-delete-button", c: "button", di: data.id, s: "background-color: red; border: solid 2px red;", tx: "Delete Competitor"});
    $("#view-dynamic-comp-info").append(compNumberTitleEl);
    $("#view-dynamic-comp-info").append(compNumberEl);
    $("#view-dynamic-comp-info").append(teamNameTitleEl);
    $("#view-dynamic-comp-info").append(teamNameEl);
    $("#view-dynamic-comp-info").append(groupNamesTitleEl);
    $("#view-dynamic-comp-info").append(groupNamesEl);
    $("#view-dynamic-comp-info").append(saveButtonEl);
    $("#view-dynamic-comp-info").append(delButtonEl);
  }
  const renderIndividual = data => {
    $("#view-dynamic-comp-info").empty();
    var compNumberTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Competitor Number"});
    var compNumberEl = h({e: "input", i: "comp-number", v: data.comp_number});
    var firstNameTitleEl = h({e: "p", c: "item-title mx-auto", tx: "First Name"});
    var firstNameEl = h({e: "input", i: "first-name", v: data.first_name});
    var lastNameTitleEl = h({e: "p", c: "item-title mx-auto", tx: "Last Name"});
    var lastNameEl = h({e: "input", i: "last-name", v: data.last_name});
    var saveButtonEl = h({e: "button", i: "comp-save-button", di: data.id, c: "button", tx: "Save Changes"});
    var delButtonEl = h({e: "button", i: "comp-delete-button", c: "button", di: data.id, s: "background-color: red; border: solid 2px red;", tx: "Delete Competitor"});
    $("#view-dynamic-comp-info").append(compNumberTitleEl);
    $("#view-dynamic-comp-info").append(compNumberEl);
    $("#view-dynamic-comp-info").append(firstNameTitleEl);
    $("#view-dynamic-comp-info").append(firstNameEl);
    $("#view-dynamic-comp-info").append(lastNameTitleEl);
    $("#view-dynamic-comp-info").append(lastNameEl);
    $("#view-dynamic-comp-info").append(saveButtonEl);
    $("#view-dynamic-comp-info").append(delButtonEl);
  }
  renderCompPage();
  $(document).on("click", ".button", event => {
    if ($(event.target).attr("id") === "comp-save-button") {
      $.ajax("/api/comp/update/", {
        type: "PUT",
        data: {
          id: parseInt($(event.target).attr("data-id")),
          comp_number: $("#comp-number").val().trim(),
          first_name: $("#first-name").val() === undefined ? null : $("#first-name").val().trim(),
          last_name: $("#last-name").val() === undefined ? null : $("#last-name").val().trim(),
          team_name: $("#team-name").val() === undefined ? null : $("#team-name").val().trim(),
          group_names: $("#group-names").val() === undefined ? null : $("#group-names").val().trim(),
        }
      }).then(() => {
        var textEl = h({e: "p", c: "item-title mx-auto", tx: `Success! Changes Saved!`});
        $("#view-dynamic-comp-info").append(textEl);
      });
    } else if ($(event.target).attr("id") === "comp-delete-button") {
      $.ajax("/api/comp/", { type: "DELETE", data: { id: parseInt($(event.target).attr("data-id")) } }).then(() => renderCompPage());
    } else if ($(event.target).attr("id") === "add-comp-save-button") {
      renderAddMessage();
    }
  });
  $(document).on("change", "#year-select", () => renderCompPage());
  $(document).on("change", "#comp-select", () => renderCompInfo());
  $(document).on("change", "#tier-select", () => renderCompAddInfo());
});
