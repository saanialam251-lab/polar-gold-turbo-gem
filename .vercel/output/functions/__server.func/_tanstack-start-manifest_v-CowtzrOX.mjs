//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-CowtzrOX.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/practice",
			"/progress",
			"/class/$classId",
			"/result/$testId"
		],
		preloads: [
			"/assets/index-349g-L89.js",
			"/assets/useStore-CP8wJgJA.js",
			"/assets/store-DYiYV0SC.js",
			"/assets/matchContext-D_yddPR9.js",
			"/assets/preload-helper-BJpxWLSK.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-349g-L89.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-BcZTO6ec.js",
			"/assets/sigma-BIgOZloq.js",
			"/assets/shell-Yqt4_A2w.js"
		]
	},
	"/practice": {
		filePath: "/workspace/src/routes/practice.tsx",
		children: void 0,
		preloads: [
			"/assets/practice-C4AlnXOz.js",
			"/assets/useNavigate-B0tGo7qX.js",
			"/assets/shell-Yqt4_A2w.js",
			"/assets/button-CIXoS91F.js"
		]
	},
	"/progress": {
		filePath: "/workspace/src/routes/progress.tsx",
		children: void 0,
		preloads: [
			"/assets/progress-dt17n02q.js",
			"/assets/shell-Yqt4_A2w.js",
			"/assets/button-CIXoS91F.js"
		]
	},
	"/class/$classId": {
		filePath: "/workspace/src/routes/class.$classId.tsx",
		children: ["/class/$classId/$subject", "/class/$classId/"],
		preloads: ["/assets/class._classId-CEsf09mx.js"]
	},
	"/result/$testId": {
		filePath: "/workspace/src/routes/result.$testId.tsx",
		children: void 0,
		preloads: ["/assets/result._testId-DS4Jzrqu.js", "/assets/shell-Yqt4_A2w.js"]
	},
	"/class/$classId/$subject": {
		filePath: "/workspace/src/routes/class.$classId.$subject.tsx",
		children: ["/class/$classId/$subject/$chapter", "/class/$classId/$subject/"],
		preloads: ["/assets/class._classId._subject-CEsf09mx.js"]
	},
	"/class/$classId/": {
		filePath: "/workspace/src/routes/class.$classId.index.tsx",
		children: void 0,
		preloads: [
			"/assets/class._classId.index-D2TFSq_I.js",
			"/assets/sigma-BIgOZloq.js",
			"/assets/shell-Yqt4_A2w.js"
		]
	},
	"/class/$classId/$subject/$chapter": {
		filePath: "/workspace/src/routes/class.$classId.$subject.$chapter.tsx",
		children: void 0,
		preloads: [
			"/assets/class._classId._subject._chapter-B0UQPRql.js",
			"/assets/useNavigate-B0tGo7qX.js",
			"/assets/shell-Yqt4_A2w.js",
			"/assets/button-CIXoS91F.js"
		]
	},
	"/class/$classId/$subject/": {
		filePath: "/workspace/src/routes/class.$classId.$subject.index.tsx",
		children: void 0,
		preloads: ["/assets/class._classId._subject.index-DF3yQ2Cv.js", "/assets/shell-Yqt4_A2w.js"]
	}
} });
//#endregion
export { tsrStartManifest };
