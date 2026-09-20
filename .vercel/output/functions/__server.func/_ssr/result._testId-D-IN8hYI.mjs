import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route$4, o as useAppStore, p as questionById } from "./router-BdPRgI8Z.mjs";
import { a as Shell, o as getChapter } from "./shell-nrkNwCG5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/result._testId-D-IN8hYI.js
var import_jsx_runtime = require_jsx_runtime();
function ResultPage() {
	const { testId } = Route$4.useParams();
	const test = useAppStore((s) => s.tests.find((t) => t.id === testId));
	if (!test) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Result not found",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "That test is not in this device’s history."
		})
	});
	const chapter = getChapter(test.class, test.subject, test.chapterId);
	const pct = test.maxScore ? Math.round(Math.max(0, test.score) / test.maxScore * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		eyebrow: "Result",
		title: chapter?.name ?? "Test",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						k: "Score",
						v: `${test.score} / ${test.maxScore}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						k: "Correct",
						v: String(test.correct)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						k: "Wrong",
						v: String(test.wrong)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						k: "Skipped",
						v: String(test.skipped)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					pct,
					"% of maximum marks · ",
					test.questionIds.length,
					" questions · ",
					test.difficulty,
					" · ",
					test.mode
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 divide-y divide-line rounded-lg border border-line",
				children: test.questionIds.map((id, i) => {
					const q = questionById(id);
					if (!q) return null;
					const last = useAppStore.getState().states[id]?.attempts.at(-1);
					const ok = last?.correct;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted tabular-nums",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm",
								children: q.questionText
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: ok ? "Correct" : last?.selected ? `Chose ${last.selected} · key ${q.correct}` : "Skipped"
							})]
						})]
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/class/$classId/$subject/$chapter",
					params: {
						classId: String(test.class),
						subject: test.subject,
						chapter: test.chapterId
					},
					className: "inline-flex h-11 items-center rounded-md bg-ink px-4 text-sm font-medium text-paper no-underline",
					children: "Back to chapter"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/progress",
					className: "inline-flex h-11 items-center rounded-md border border-line px-4 text-sm font-medium text-ink no-underline",
					children: "Progress"
				})]
			})
		]
	});
}
function Card({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-line bg-paper p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-2xl tabular-nums",
			children: v
		})]
	});
}
//#endregion
export { ResultPage as component };
