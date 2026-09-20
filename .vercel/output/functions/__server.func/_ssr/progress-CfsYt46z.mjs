import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as overallStats, d as QUESTIONS, o as useAppStore, s as chapterStats } from "./router-BdPRgI8Z.mjs";
import { a as Shell, i as SYLLABUS, n as CLASS_META, r as SUBJECTS, t as CLASSES } from "./shell-nrkNwCG5.mjs";
import { t as Button } from "./button-Crn9Pt0d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-CfsYt46z.js
var import_jsx_runtime = require_jsx_runtime();
function ProgressPage() {
	const profile = useAppStore((s) => s.profile);
	const setProfile = useAppStore((s) => s.setProfile);
	const states = useAppStore((s) => s.states);
	const tests = useAppStore((s) => s.tests);
	const reset = useAppStore((s) => s.resetProgress);
	const stats = overallStats(states, tests);
	const bySubject = SUBJECTS.map((subject) => {
		const qs = QUESTIONS.filter((q) => q.subject === subject);
		let ok = 0;
		let w = 0;
		for (const q of qs) {
			const last = states[q.id]?.attempts.at(-1);
			if (!last) continue;
			if (last.correct) ok += 1;
			else w += 1;
		}
		const den = ok + w;
		return {
			subject,
			pct: den ? Math.round(ok / den * 100) : 0,
			ok,
			w
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		eyebrow: "Analytics",
		title: "Progress",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: "ml-2 h-11 rounded-md border border-line bg-paper px-3 text-ink",
						value: profile.name,
						onChange: (e) => setProfile({ name: e.target.value })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: ["Default class", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "ml-2 h-11 rounded-md border border-line bg-paper px-3",
						value: profile.classId,
						onChange: (e) => setProfile({ classId: Number(e.target.value) }),
						children: CLASSES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: CLASS_META[c].label
						}, c))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						k: "Attempted",
						v: String(stats.solved)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						k: "Last-answer correct",
						v: String(stats.correct)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						k: "Last-answer wrong",
						v: String(stats.wrong)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tile, {
						k: "Accuracy",
						v: `${stats.accuracy}%`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-xl",
				children: "By subject"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-3",
				children: bySubject.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.subject }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums text-muted",
						children: [
							s.pct,
							"% · ",
							s.ok,
							" / ",
							s.ok + s.w
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 h-1.5 rounded-full bg-paper-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-sage",
						style: { width: `${s.pct}%` }
					})
				})] }, s.subject))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-xl",
				children: "Recent tests"
			}),
			tests.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "No tests yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-line rounded-lg border border-line",
				children: tests.slice(0, 12).map((t) => {
					const ch = SYLLABUS[t.class][t.subject].find((c) => c.id === t.chapterId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/result/$testId",
						params: { testId: t.id },
						className: "flex items-center justify-between px-4 py-3 text-ink no-underline hover:bg-paper-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm",
							children: [
								"Class ",
								t.class,
								" · ",
								t.subject,
								" · ",
								ch?.name ?? t.chapterId
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm tabular-nums text-muted",
							children: [
								t.correct,
								"/",
								t.questionIds.length
							]
						})]
					}) }, t.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-10 font-display text-xl",
				children: "Seeded chapters"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-1 text-sm",
				children: CLASSES.flatMap((c) => SUBJECTS.flatMap((s) => SYLLABUS[c][s].map((ch) => ({
					c,
					s,
					ch,
					n: chapterStats(c, s, ch.id, states)
				})).filter((x) => x.n.total > 0))).map(({ c, s, ch, n }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/class/$classId/$subject/$chapter",
					params: {
						classId: String(c),
						subject: s,
						chapter: ch.id
					},
					className: "text-ink no-underline hover:text-copper",
					children: [
						"Class ",
						c,
						" ",
						s,
						" — ",
						ch.name,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								"(",
								n.total,
								" q · ",
								n.wrong,
								" wrong · ",
								n.mastered,
								" mastered)"
							]
						})
					]
				}) }, `${c}-${s}-${ch.id}`))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				className: "mt-10",
				onClick: reset,
				children: "Reset local progress"
			})
		]
	});
}
function Tile({ k, v }) {
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
export { ProgressPage as component };
