import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as ChevronLeft, d as Bookmark, l as Check, s as ChevronRight, t as X } from "../_libs/lucide-react.mjs";
import { o as useAppStore, p as questionById } from "./router-BdPRgI8Z.mjs";
import { a as Shell, o as getChapter } from "./shell-nrkNwCG5.mjs";
import { n as cn, t as Button } from "./button-Crn9Pt0d.mjs";
import { t as katex } from "../_libs/katex.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/practice-CfGbRkQk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MathTex({ tex, display = false, className }) {
	let html = "";
	try {
		html = katex.renderToString(tex, {
			displayMode: display,
			throwOnError: false,
			output: "html"
		});
	} catch {
		html = tex;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-block max-w-full overflow-x-auto", className),
		dangerouslySetInnerHTML: { __html: html }
	});
}
function PracticePage() {
	const active = useAppStore((s) => s.active);
	const lockAnswer = useAppStore((s) => s.lockAnswer);
	const finishTest = useAppStore((s) => s.finishTest);
	const bookmarks = useAppStore((s) => s.bookmarks);
	const toggleBookmark = useAppStore((s) => s.toggleBookmark);
	const navigate = useNavigate();
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [started, setStarted] = (0, import_react.useState)(Date.now());
	(0, import_react.useEffect)(() => {
		setPicked(null);
		setStarted(Date.now());
	}, [idx]);
	const q = (0, import_react.useMemo)(() => active ? questionById(active.questionIds[idx]) : void 0, [active, idx]);
	if (!active) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "No active test",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Start a test from any chapter dashboard."
		})
	});
	const chapter = getChapter(active.class, active.subject, active.chapterId);
	const locked = q ? Boolean(active.locked[q.id]) : false;
	const saved = q ? active.answers[q.id] : null;
	const total = active.questionIds.length;
	const done = Object.keys(active.locked).length;
	function onLock() {
		if (!q || locked) return;
		lockAnswer(q.id, picked, Math.round((Date.now() - started) / 1e3));
	}
	function onFinish() {
		const completed = finishTest();
		if (completed) navigate({
			to: "/result/$testId",
			params: { testId: completed.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		eyebrow: `${active.subject} · Class ${active.class}`,
		title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: chapter?.name ?? "Practice" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-1 font-sans text-sm font-medium text-muted",
				children: [
					"Question ",
					idx + 1,
					" of ",
					total,
					" · ",
					done,
					" locked"
				]
			})]
		}),
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			size: "sm",
			onClick: onFinish,
			children: "Submit test"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 h-1.5 overflow-hidden rounded-full bg-paper-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-copper transition-[width] duration-300",
					style: { width: `${done / total * 100}%` }
				})
			}),
			q ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-lg border border-line bg-paper p-5 sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2 text-[11px] uppercase tracking-wider text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-line px-2 py-0.5",
									children: q.difficulty
								}),
								q.isPyq ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full border border-copper px-2 py-0.5 text-copper",
									children: ["PYQ ", q.pyqYear]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-line px-2 py-0.5",
									children: "+4 / −1"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-10 place-items-center rounded-md hover:bg-paper-2",
							onClick: () => toggleBookmark(q.id),
							"aria-label": "Bookmark",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: `size-4 ${bookmarks.includes(q.id) ? "fill-copper text-copper" : "text-muted"}` })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-2xl leading-snug tracking-tight",
						children: q.questionText
					}),
					q.latex ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MathTex, {
							tex: q.latex,
							display: true
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-2",
						children: q.options.map((opt) => {
							const selected = (locked ? saved : picked) === opt.id;
							const isCorrect = locked && opt.id === q.correct;
							const isWrong = locked && selected && opt.id !== q.correct;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: locked,
								onClick: () => setPicked(opt.id),
								className: `flex min-h-12 items-start gap-3 rounded-md border px-3 py-3 text-left ${isCorrect ? "border-sage bg-sage/10" : isWrong ? "border-danger bg-danger/10" : selected ? "border-ink bg-paper-2" : "border-line bg-paper hover:border-copper"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-7 shrink-0 place-items-center rounded-full border border-line text-xs font-medium",
									children: opt.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "pt-0.5 text-sm leading-relaxed",
									children: opt.text
								})]
							}, opt.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 flex flex-wrap items-center gap-2",
						children: !locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: onLock,
							disabled: !picked,
							children: "Lock answer"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center gap-1.5 text-sm",
							children: saved === q.correct ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-sage" }), " Correct"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-danger" }),
								" Incorrect · answer ",
								q.correct
							] })
						})
					}),
					locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 border-t border-line pt-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-[0.16em] text-copper",
								children: "Explanation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-3 space-y-3",
								children: q.explanation.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm font-medium",
										children: [
											i + 1,
											". ",
											step.title
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm leading-relaxed text-muted",
										children: step.content
									}),
									step.latex ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MathTex, {
											tex: step.latex,
											display: true
										})
									}) : null
								] }, i))
							}),
							q.commonMistakes?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 rounded-md bg-paper-2 p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: "Common mistakes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-1 list-disc pl-4 text-muted",
									children: q.commonMistakes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: m }, m))
								})]
							}) : null
						]
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => setIdx((i) => Math.max(0, i - 1)),
					disabled: idx === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " Previous"]
				}), idx < total - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => setIdx((i) => i + 1),
					children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "copper",
					onClick: onFinish,
					children: "Submit test"
				})]
			})
		]
	});
}
//#endregion
export { PracticePage as component };
