import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as BookOpen, o as FlaskConical, r as Sigma } from "../_libs/lucide-react.mjs";
import { d as QUESTIONS, i as Route$3, o as useAppStore } from "./router-BdPRgI8Z.mjs";
import { a as Shell, i as SYLLABUS, n as CLASS_META, r as SUBJECTS } from "./shell-nrkNwCG5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/class._classId.index-DXwecFk9.js
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	Physics: BookOpen,
	Chemistry: FlaskConical,
	Mathematics: Sigma
};
function ClassPage() {
	const { classId: raw } = Route$3.useParams();
	const classId = Number(raw);
	const meta = CLASS_META[classId];
	const setProfile = useAppStore((s) => s.setProfile);
	if (!meta) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, {
		title: "Unknown class",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "That class is not in the syllabus map." })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		eyebrow: "Syllabus",
		title: meta.label,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-6 max-w-xl text-muted",
			children: meta.note
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-3",
			children: SUBJECTS.map((subject) => {
				const Icon = ICONS[subject];
				const chapters = SYLLABUS[classId][subject];
				const nQ = QUESTIONS.filter((q) => q.class === classId && q.subject === subject).length;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/class/$classId/$subject",
					params: {
						classId: String(classId),
						subject
					},
					onClick: () => setProfile({ classId }),
					className: "rounded-lg border border-line bg-paper p-5 text-ink no-underline hover:border-copper",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-copper" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-2xl",
							children: subject
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [chapters.length, " chapters"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-copper",
							children: nQ > 0 ? `${nQ} questions seeded` : "Syllabus mapped · bank expanding"
						})
					]
				}, subject);
			})
		})]
	});
}
//#endregion
export { ClassPage as component };
