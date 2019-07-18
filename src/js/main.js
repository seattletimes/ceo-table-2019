// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");

var $ = require("./lib/qsa");

var table = $.one(".pay-table");
var tbody = $.one(".pay-table tbody");

var format = d => d == "n/a" || d == "Not disclosed" ? d : commafy(d);

var commafy = n => n.toLocaleString().replace(/\.0+$/, "");

var isNumeric = n => n.toString().match(/[0-9,.]+/);

var render = function() {
  tbody.innerHTML = window.payData.map(r => `
<tr>
  <td class="portrait">
    <img src="${r.image ? "./assets/" + r.image : ""}">
  <td class="name">${r.exec}
  <td class="company">${r.company}
  <td class="ceo-pay">${format(r.exec_pay)}
  <td class="employee-pay ${isNumeric(r.employee_pay) ? "" : "non-numeric"}">${format(r.employee_pay)}${r.asterisk}
  <td class="ratio">${r.ratio}
  `).join("");
};

render();

var lastSort = "exec_pay";
var descending = true;

var defaultSorts = {
  sortRatio: true,
  sortExec: false,
  sortCompany: false,
  exec_pay: true,
  employee_pay: true
};

window.payData.forEach(function(row) {
  row.sortExec = row.exec.toLowerCase().split(" ").pop();
  row.sortCompany = row.company.toLowerCase();
  row.sortRatio = row.ratio == "n/a" ? 0 : row.ratio.replace(" to 1", "") * 1;
  row.asterisk = row.asterisk || "";
})

var onSort = function() {
  var sort = this.getAttribute("data-sort");
  if (sort == lastSort) {
    descending = !descending;
  } else {
    lastSort = sort;
    descending = defaultSorts[sort];
  }
  $(".sorted").forEach(el => el.classList.remove("sorted"));
  this.classList.add("sorted");
  this.setAttribute("data-direction", descending ? "down" : "up");
  window.payData.sort(function(a, b) {
    var aVal = a[sort];
    var bVal = b[sort];
    if (typeof aVal != typeof bVal) {
      aVal = aVal * 1 || 0;
      bVal = bVal * 1 || 0;
    }
    if (aVal == bVal) return 0;
    var result = aVal < bVal ? -1 : 1;
    if (descending) result *= -1;
    return result;
  });
  render();
}

$("[data-sort]").forEach(el => el.addEventListener("click", onSort));

$.one(".expand").addEventListener("click", () => table.classList.remove("collapsed"));