import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as countForChapter, o as useAppStore, r as Route$1, s as chapterStats } from "./router-BdPRgI8Z.mjs";
import { a as Shell, i as SYLLABUS } from "./shell-nrkNwCG5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/class._classId._subject.index-YB9YiByJ.js
var import_jsx_runtime = require_jsx_runtime();
function SubjectPage() {
	const { classId: raw, subject: subRaw } = Route$1.useParams();
	const classId = Number(raw);
	const subject = decodeURIComponent(subRaw);
	const chapters = SYLLABUS[classId]?.[subject];
	const states = useAppStore((s) => s.states);
	if (!chapters) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Not found",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Unknown subject." })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		eyebrow: `Class ${classId}`,
		title: subject,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-6 text-sm text-muted",
			children: "Every chapter lists its topics. Open one to practise, retry wrongs, or sit mixed tests."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: chapters.map((ch) => {
				const n = countForChapter(classId, subject, ch.id);
				const st = n ? chapterStats(classId, subject, ch.id, states) : null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/class/$classId/$subject/$chapter",
					params: {
						classId: String(classId),
						subject,
						chapter: ch.id
					},
					className: "flex flex-col gap-2 rounded-lg border border-line bg-paper px-4 py-4 text-ink no-underline hover:border-copper sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: ["Chapter ", String(ch.order).padStart(2, "0")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl tracking-tight",
							children: ch.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								ch.topics.length,
								" topics",
								n ? ` · ${n} questions` : " · syllabus ready"
							]
						})
					] }), st ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 text-xs tabular-nums text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [st.attempted, " done"] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-danger",
								children: [st.wrong, " wrong"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sage",
								children: [st.mastered, " mastered"]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Coming next"
					})]
				}, ch.id);
			})
		})]
	});
}
//#endregion
export { SubjectPage as component };
