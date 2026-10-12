# Decision Cost score

Ten questions that show how much human judgment one workflow spends on decisions software could handle. It's the scoring half of the [Decision Cost Framework](https://ganeshdatta.me/decision-cost-framework/): find the recurring decisions, then sort each one into **Automate**, **Assist** or **Keep Human**.

**Try it:** [ganeshdatta96.github.io/decision-cost](https://ganeshdatta96.github.io/decision-cost/)

Built by [Ganesh Datta](https://ganeshdatta.me). It's the same score as the one in the free tools on ganeshdatta.me.

## How it works

Pick one workflow lane, such as patient intake, refunds or lead follow-up, and answer for that lane only. Each question scores 0 (rarely), 1 (sometimes) or 2 (often), for a total out of 20.

| Score | What it means |
| --- | --- |
| 0–6 | Decision Cost may be modest in this lane. Watch a week, then try another lane. |
| 7–12 | The judgment load is material. List your top 8 recurring decisions and mark each Automate, Assist or Keep Human. |
| 13–20 | This lane is spending a lot of judgment. Next step: a Decision Cost Audit and one measured change. |

The score teaches the lens. It isn't the audit, and it doesn't forecast revenue.

## Embed it

```html
<script src="https://ganeshdatta96.github.io/decision-cost/decision-cost.js" defer></script>
<decision-cost-score></decision-cost-score>
```

Theme it with `--dc-bg`, `--dc-text`, `--dc-muted`, `--dc-line` and `--dc-accent`. Add `no-credit` to hide the framework link. When all ten questions are answered, the element fires a `decision-cost` event with `{ total, range }`.

## Use it in code

```js
const { QUESTIONS, score, band } = require("./decision-cost.js");
const total = score([2, 1, 2, 0, 1, 2, 2, 1, 0, 2]); // 13
band(total); // { range: "13–20", advice: "..." }
```

## Check

```bash
node test.js
```

## License

MIT
