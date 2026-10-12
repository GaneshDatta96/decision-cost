const assert = require("node:assert");
const { QUESTIONS, score, band } = require("./decision-cost.js");

assert.strictEqual(QUESTIONS.length, 10);
assert.strictEqual(score(Array(10).fill(2)), 20);
assert.strictEqual(score([0, 1, 2, 0, 1, 2, 0, 1, 2, 0]), 9);
assert.throws(() => score([1, 1]));
assert.throws(() => score(Array(10).fill(3)));
for (const [n, range] of [[0, "0–6"], [6, "0–6"], [7, "7–12"], [12, "7–12"], [13, "13–20"], [20, "13–20"]]) {
  assert.strictEqual(band(n).range, range, `band(${n})`);
}
console.log("ok");
