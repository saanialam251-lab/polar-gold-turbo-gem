import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as BookOpen, o as FlaskConical, p as ArrowRight, r as Sigma } from "../_libs/lucide-react.mjs";
import { c as overallStats, d as QUESTIONS, o as useAppStore } from "./router-BdPRgI8Z.mjs";
import { a as Shell, i as SYLLABUS, n as CLASS_META, r as SUBJECTS, t as CLASSES } from "./shell-nrkNwCG5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DnDOUNub.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	Physics: BookOpen,
	Chemistry: FlaskConical,
	Mathematics: Sigma
};
function Home() {
	const profile = useAppStore((s) => s.profile);
	const states = useAppStore((s) => s.states);
	const tests = useAppStore((s) => s.tests);
	const stats = overallStats(states, tests);
	const seeded = QUESTIONS.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-8 lg:grid-cols-[1.4fr_0.8fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.18em] text-copper",
					children: "CBSE practice · Classes 9–12"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl",
					children: "Master every orbit of the syllabus."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-xl text-base leading-relaxed text-muted",
					children: "Questions never randomly recycle. New ones come first, wrong ones wait in a dedicated pool, and mastered items stay out of ordinary tests until you call them back."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/class/$classId",
						params: { classId: String(profile.classId) },
						className: "inline-flex h-11 min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-medium text-paper no-underline",
						children: [
							"Continue Class ",
							profile.classId,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/class/$classId/$subject/$chapter",
						params: {
							classId: "11",
							subject: "Physics",
							chapter: "chapter-07-gravitation"
						},
						className: "inline-flex h-11 min-h-11 items-center gap-2 rounded-md border border-line bg-paper px-4 text-sm font-medium text-ink no-underline",
						children: "Open Gravitation (full bank)"
					})]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "rounded-lg border border-line bg-ink p-5 text-paper",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.16em] text-copper-2",
						children: "Your desk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-2xl",
						children: profile.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid grid-cols-2 gap-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								k: "Questions in bank",
								v: String(seeded)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								k: "Attempted",
								v: String(stats.solved)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								k: "Accuracy",
								v: `${stats.accuracy}%`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								k: "Tests logged",
								v: String(stats.tests)
							})
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Choose a class"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: CLASSES.map((c) => {
					const meta = CLASS_META[c];
					const nCh = SUBJECTS.reduce((n, s) => n + SYLLABUS[c][s].length, 0);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/class/$classId",
						params: { classId: String(c) },
						className: "group rounded-lg border border-line bg-paper p-5 no-underline text-ink transition-colors hover:border-copper",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-2xl",
									children: meta.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: meta.year
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: meta.note
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs text-copper",
								children: [nCh, " chapters · Physics, Chemistry, Mathematics"]
							})
						]
					}, c);
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "How tests are built"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: [
					["New first", "Untouched questions are always the highest priority."],
					["Wrong pool", "Misses wait in a chapter tab until you retry them."],
					["Mastery", "Two consecutive correct answers retire a question from ordinary tests."]
				].map(([t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-line bg-paper-2/50 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: t
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: d
					})]
				}, t))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "Subjects"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-3",
				children: SUBJECTS.map((s) => {
					const Icon = ICONS[s];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-copper" }), s]
					}, s);
				})
			})]
		})
	] });
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs text-copper-2",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "font-display text-xl tabular-nums",
		children: v
	})] });
}
//#endregion
export { Home as component };
