import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as poolFor, m as questionsFor, n as Route, o as useAppStore, s as chapterStats, u as selectQuestions } from "./router-BdPRgI8Z.mjs";
import { a as Shell, o as getChapter } from "./shell-nrkNwCG5.mjs";
import { t as Button } from "./button-Crn9Pt0d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/class._classId._subject._chapter-oQEvWlP1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChapterPage() {
	const { classId: raw, subject: subRaw, chapter } = Route.useParams();
	const classId = Number(raw);
	const subject = decodeURIComponent(subRaw);
	const ch = getChapter(classId, subject, chapter);
	const states = useAppStore((s) => s.states);
	const tests = useAppStore((s) => s.tests);
	const startTest = useAppStore((s) => s.startTest);
	const navigate = useNavigate();
	const qs = questionsFor(classId, subject, chapter);
	const st = chapterStats(classId, subject, chapter, states);
	const last5 = tests.filter((t) => t.chapterId === chapter).slice(0, 5);
	const [mode, setMode] = (0, import_react.useState)("practice");
	const [difficulty, setDifficulty] = (0, import_react.useState)("mixed");
	const [count, setCount] = (0, import_react.useState)(10);
	const [topicId, setTopicId] = (0, import_react.useState)("");
	const [msg, setMsg] = (0, import_react.useState)(null);
	const wrongByTopic = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const q of qs) if ((states[q.id]?.status ?? "NEW") === "WRONG") map.set(q.topicId, (map.get(q.topicId) ?? 0) + 1);
		return [...map.entries()].sort((a, b) => b[1] - a[1]);
	}, [qs, states]);
	if (!ch) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Chapter missing",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This chapter is not in the syllabus." })
	});
	function launch() {
		setMsg(null);
		const pool = poolFor({
			classId,
			subject,
			chapterId: chapter,
			topicId: topicId || void 0,
			mode: topicId ? "topic" : mode,
			difficulty,
			states
		});
		const { selected, exhausted, remaining } = selectQuestions(pool, states, count, mode);
		if (exhausted || selected.length === 0) {
			setMsg(remaining === 0 ? "No eligible questions left in this pool. Add more, practise wrongs, or review mastered items." : "Could not build a test from the current filters.");
			return;
		}
		startTest({
			id: `TEST-${Date.now()}`,
			class: classId,
			subject,
			chapterId: chapter,
			topicId: topicId || void 0,
			mode: topicId ? "topic" : mode,
			difficulty,
			questionIds: selected.map((q) => q.id),
			answers: {},
			locked: {},
			startedAt: Date.now(),
			timePerQuestion: {}
		});
		navigate({ to: "/practice" });
	}
	const emptyBank = qs.length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		eyebrow: `Class ${classId} · ${subject}`,
		title: ch.name,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1.15fr_0.85fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "In bank",
								value: st.total
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Remaining",
								value: st.remaining
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Wrong",
								value: st.wrong,
								accent: "danger"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								label: "Mastered",
								value: st.mastered,
								accent: "sage"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-8 font-display text-xl",
						children: "Topics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-line rounded-lg border border-line",
						children: ch.topics.map((t) => {
							const n = qs.filter((q) => q.topicId === t.id).length;
							const w = states ? qs.filter((q) => q.topicId === t.id && states[q.id]?.status === "WRONG").length : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setTopicId(topicId === t.id ? "" : t.id),
								className: `flex w-full items-center justify-between px-3 py-3 text-left text-sm ${topicId === t.id ? "bg-paper-2" : "bg-paper"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mr-2 text-muted",
									children: String(t.order).padStart(2, "0")
								}), t.name] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted tabular-nums",
									children: [
										n,
										" q",
										w ? ` · ${w} wrong` : ""
									]
								})]
							}) }, t.id);
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "rounded-lg border border-line bg-ink p-5 text-paper",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.16em] text-copper-2",
						children: "Start a test"
					}), emptyBank ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm leading-relaxed text-paper/80",
						children: [
							"This chapter is mapped, but the question bank is still being filled. Open",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Class 11 · Physics · Gravitation" }),
							" for the full seeded orbit."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-4 block text-xs text-copper-2",
							children: "Mode"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: [
								["practice", "Practice"],
								["chapter-mixed", "Mixed"],
								["wrong", "Wrong"],
								["pyq", "PYQ"],
								["mastered", "Mastered"]
							].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMode(id),
								className: `h-9 rounded-full px-3 text-xs ${mode === id ? "bg-copper text-ink" : "bg-ink-soft text-paper"}`,
								children: label
							}, id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-4 block text-xs text-copper-2",
							children: "Difficulty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-2",
							children: [
								"mixed",
								"medium",
								"hard"
							].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setDifficulty(d),
								className: `h-9 rounded-full px-3 text-xs capitalize ${difficulty === d ? "bg-paper text-ink" : "bg-ink-soft text-paper"}`,
								children: d
							}, d))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-4 block text-xs text-copper-2",
							children: "Questions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-2",
							children: [
								5,
								10,
								15,
								20
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCount(n),
								className: `h-9 min-w-11 rounded-full px-3 text-xs tabular-nums ${count === n ? "bg-copper text-ink" : "bg-ink-soft text-paper"}`,
								children: n
							}, n))
						}),
						topicId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-copper-2",
							children: "Topic filter on. Tap the topic again to clear."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "copper",
							className: "mt-5 w-full",
							onClick: launch,
							children: "Begin"
						}),
						msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-copper-2",
							children: msg
						}) : null
					] })]
				})]
			}),
			wrongByTopic.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Wrong answers by topic"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: wrongByTopic.map(([tid, n]) => {
						const name = ch.topics.find((t) => t.id === tid)?.name ?? tid;
						const max = wrongByTopic[0][1];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: n
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-1.5 overflow-hidden rounded-full bg-paper-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-danger",
								style: { width: `${Math.round(n / max * 100)}%` }
							})
						})] }, tid);
					})
				})]
			}) : null,
			last5.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Last tests"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex items-end gap-2",
					children: last5.slice().reverse().map((t) => {
						const pct = t.maxScore ? Math.round(t.score / t.maxScore * 100) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 flex-col items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full rounded-sm bg-sage",
								style: { height: `${Math.max(8, Math.min(96, pct))}px` }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] tabular-nums text-muted",
								children: [
									t.correct,
									"/",
									t.questionIds.length
								]
							})]
						}, t.id);
					})
				})]
			}) : null
		]
	});
}
function Metric({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-line bg-paper p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-1 font-display text-2xl tabular-nums ${accent === "danger" ? "text-danger" : accent === "sage" ? "text-sage" : ""}`,
			children: value
		})]
	});
}
//#endregion
export { ChapterPage as component };
