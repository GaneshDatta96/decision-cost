/*! decision-cost · MIT · Ganesh Datta · https://ganeshdatta.me/decision-cost-framework/ */
(function (root) {
  var QUESTIONS = [
    "The same type of approval or choice repeats daily or weekly with little new information.",
    "Work frequently waits on a person even when the right answer is usually obvious.",
    "People search across multiple tools before they can act.",
    "Follow-ups depend on someone remembering rather than a system rule.",
    "Priorities are re-decided from scratch instead of using a standing rubric.",
    "Status is assembled manually, spreadsheet or Slack archaeology, to decide if things are okay.",
    "Different people make inconsistent calls on similar cases.",
    "Exceptions are handled by pinging the same human router.",
    "AI or chat tools are already used ad hoc, but outputs still need the same human cleanup every time.",
    "At least one recurring decision is annoying, frequent, low-stakes, and probably rule-based."
  ];
  var LABELS = ["0 rarely", "1 sometimes", "2 often"];

  function score(answers) {
    if (answers.length !== QUESTIONS.length) throw new Error("need " + QUESTIONS.length + " answers");
    return answers.reduce(function (sum, a) {
      if (a !== 0 && a !== 1 && a !== 2) throw new Error("answers are 0, 1 or 2");
      return sum + a;
    }, 0);
  }

  function band(total) {
    if (total <= 6) return { range: "0–6", advice: "Decision Cost may be modest in this lane. Watch a week. Try another lane." };
    if (total <= 12) return { range: "7–12", advice: "The judgment load in this lane is material. List your top 8 recurring decisions. Mark each Automate, Assist, or Keep Human." };
    return { range: "13–20", advice: "This lane is spending a lot of judgment. The next step is a Decision Cost Audit and one measured change." };
  }

  var api = { QUESTIONS: QUESTIONS, score: score, band: band };
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DecisionCost = api;
  if (typeof HTMLElement === "undefined" || !root.customElements || customElements.get("decision-cost-score")) return;

  var CSS = ":host{--dc-bg:#10120e;--dc-text:#efe8dc;--dc-muted:#a39c90;--dc-line:rgba(239,232,220,.14);--dc-accent:#d6ff4a;" +
    "display:block;font-family:Outfit,'Segoe UI',system-ui,sans-serif;color:var(--dc-text);background:var(--dc-bg);border:1px solid var(--dc-line);border-radius:14px;padding:20px;max-width:720px}" +
    "h3{margin:0 0 4px;font-size:1.25rem}p{margin:0;color:var(--dc-muted);font-size:.9rem;line-height:1.5}" +
    "fieldset{border:0;border-top:1px solid var(--dc-line);margin:14px 0 0;padding:12px 0 0}legend{float:left;width:100%;padding:0;margin-bottom:8px;font-size:.95rem;color:var(--dc-text)}" +
    ".choices{clear:both;display:flex;flex-wrap:wrap;gap:8px}" +
    "label{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 12px;border:1px solid var(--dc-line);border-radius:999px;cursor:pointer;font-size:.9rem}" +
    "label:has(input:checked){border-color:var(--dc-accent);color:var(--dc-accent)}input:focus-visible{outline:2px solid var(--dc-accent)}" +
    "output{display:block;margin-top:16px;padding:14px;border:1px solid var(--dc-line);border-radius:10px}" +
    "strong{color:var(--dc-accent)}a{color:var(--dc-muted);font-size:.8rem}.credit{margin-top:10px}";

  class DecisionCostScore extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      var shadow = this.attachShadow({ mode: "open" });
      var self = this;
      var rows = QUESTIONS.map(function (q, i) {
        var choices = LABELS.map(function (label, v) {
          return "<label><input type=\"radio\" name=\"q" + i + "\" value=\"" + v + "\"> " + label + "</label>";
        }).join("");
        return "<fieldset><legend>" + (i + 1) + ". " + q + "</legend><div class=\"choices\">" + choices + "</div></fieldset>";
      }).join("");
      var credit = this.hasAttribute("no-credit") ? "" :
        "<p class=\"credit\"><a href=\"https://ganeshdatta.me/decision-cost-framework/\" target=\"_blank\" rel=\"noopener\">The Decision Cost Framework, by Ganesh Datta</a></p>";
      shadow.innerHTML = "<style>" + CSS + "</style><h3>Decision Cost score</h3>" +
        "<p>Pick one workflow lane and answer for that lane only. 0 = rarely or no, 1 = sometimes, 2 = often or yes. Total out of 20.</p>" +
        "<form>" + rows + "</form><output aria-live=\"polite\">Answer all ten. The score lands here.</output>" + credit;
      var form = shadow.querySelector("form");
      var out = shadow.querySelector("output");
      form.addEventListener("change", function () {
        var picks = Array.prototype.map.call(form.querySelectorAll("input:checked"), function (i) { return Number(i.value); });
        if (picks.length < QUESTIONS.length) {
          out.textContent = picks.length + " of " + QUESTIONS.length + " answered.";
          return;
        }
        var total = score(picks);
        var b = band(total);
        out.innerHTML = "<strong>" + total + " / 20.</strong> " + b.range + ". " + b.advice;
        self.dispatchEvent(new CustomEvent("decision-cost", { detail: { total: total, range: b.range }, bubbles: true }));
      });
    }
  }
  customElements.define("decision-cost-score", DecisionCostScore);
})(typeof window !== "undefined" ? window : globalThis);
