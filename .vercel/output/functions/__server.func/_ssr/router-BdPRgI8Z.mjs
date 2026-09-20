import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BdPRgI8Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var QUESTIONS = [
	{
		id: "PHY11-GRAV-KEP-M-0001",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-01-kepler-s-laws",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Kepler's second law (the law of areas) is a consequence of conservation of:`,
		formulaUsed: `\\frac{dA}{dt}=\\frac{L}{2m}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `Energy`
			},
			{
				id: "B",
				text: `Linear momentum`
			},
			{
				id: "C",
				text: `Angular momentum`
			},
			{
				id: "D",
				text: `Mass`
			}
		],
		correct: "C",
		explanation: [
			{
				title: `Recall the statement`,
				content: `Equal areas are swept in equal times by the radius vector from the Sun to the planet.`
			},
			{
				title: `Torque of gravity`,
				content: `The gravitational force is central, so torque about the Sun is zero.`
			},
			{
				title: `Implication`,
				content: `Zero torque implies angular momentum of the planet is conserved, which is equivalent to the areal law.`
			}
		],
		concepts: ["Kepler's laws", "angular momentum"]
	},
	{
		id: "PHY11-GRAV-KEP-M-0002",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-01-kepler-s-laws",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `According to Kepler's third law, the square of the orbital period of a planet is proportional to:`,
		latex: `T^2 \\propto a^3`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `the semi-major axis`
			},
			{
				id: "B",
				text: `the square of the semi-major axis`
			},
			{
				id: "C",
				text: `the cube of the semi-major axis`
			},
			{
				id: "D",
				text: `the square root of the semi-major axis`
			}
		],
		correct: "C",
		explanation: [
			{
				title: `Statement`,
				content: `T² ∝ a³, where a is the semi-major axis of the elliptical orbit.`
			},
			{
				title: `Sun-centred`,
				content: `The constant of proportionality is the same for all planets orbiting the Sun.`
			},
			{
				title: `Newton's derivation`,
				content: `From centripetal force = gravity, T² = 4π² a³ / GM.`
			}
		],
		concepts: ["Kepler's third law"]
	},
	{
		id: "PHY11-GRAV-KEP-H-0003",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-01-kepler-s-laws",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A satellite orbits Earth in an ellipse. At perigee the speed is 8.0 km/s and the distance from Earth's centre is r. At apogee the distance is 2r. The speed at apogee is:`,
		isPyq: false,
		commonMistakes: [`Using energy instead of L conservation and dropping a factor of 2`],
		options: [
			{
				id: "A",
				text: `2.0 km/s`
			},
			{
				id: "B",
				text: `4.0 km/s`
			},
			{
				id: "C",
				text: `8.0 km/s`
			},
			{
				id: "D",
				text: `16.0 km/s`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Angular momentum conservation`,
				content: `m v_p r = m v_a (2r) because velocity is perpendicular to the radius at both apsides.`
			},
			{
				title: `Solve`,
				content: `v_a = v_p / 2 = 4.0 km/s.`
			},
			{
				title: `Check`,
				content: `Perigee is faster; apogee is slower — consistent with Kepler II.`
			}
		],
		concepts: ["Kepler's second law", "apsides"]
	},
	{
		id: "PHY11-GRAV-KEP-M-0004",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-01-kepler-s-laws",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The orbit of a planet is an ellipse with the Sun at:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `the centre`
			},
			{
				id: "B",
				text: `either focus`
			},
			{
				id: "C",
				text: `one focus`
			},
			{
				id: "D",
				text: `the perihelion point`
			}
		],
		correct: "C",
		explanation: [
			{
				title: `Kepler I`,
				content: `Planets move in ellipses with the Sun at one focus.`
			},
			{
				title: `Empty focus`,
				content: `The other focus is empty — there is no mass there.`
			},
			{
				title: `Special case`,
				content: `A circle is an ellipse with coincident foci.`
			}
		],
		concepts: ["Kepler's first law"]
	},
	{
		id: "PHY11-GRAV-KEP-H-0005",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-01-kepler-s-laws",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Two planets A and B have periods 1 yr and 8 yr. The ratio of their semi-major axes a_A : a_B is:`,
		latex: `a \\propto T^{2/3}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `1 : 2`
			},
			{
				id: "B",
				text: `1 : 4`
			},
			{
				id: "C",
				text: `1 : 8`
			},
			{
				id: "D",
				text: `1 : 16`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Kepler III`,
				content: `T² ∝ a³ ⇒ a ∝ T^{2/3}.`
			},
			{
				title: `Ratio`,
				content: `a_A/a_B = (1/8)^{2/3} = 1/4.`
			},
			{
				title: `Meaning`,
				content: `Planet B is four times farther from the Sun on average.`
			}
		],
		concepts: ["Kepler's third law"]
	},
	{
		id: "PHY11-GRAV-UNI-M-0001",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-02-universal-law-of-gravitation",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The gravitational force between two point masses is:`,
		latex: `F=G\\frac{m_1 m_2}{r^2}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `always repulsive`
			},
			{
				id: "B",
				text: `inversely proportional to distance`
			},
			{
				id: "C",
				text: `inversely proportional to the square of the distance`
			},
			{
				id: "D",
				text: `independent of mass`
			}
		],
		correct: "C",
		explanation: [
			{
				title: `Newton's law`,
				content: `F = G m1 m2 / r² along the line joining the masses.`
			},
			{
				title: `Always attractive`,
				content: `Gravity is always attractive for ordinary masses.`
			},
			{
				title: `Inverse square`,
				content: `Doubling r reduces F to one-fourth.`
			}
		],
		concepts: ["Newton's law of gravitation"]
	},
	{
		id: "PHY11-GRAV-UNI-M-0002",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-02-universal-law-of-gravitation",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `If the distance between two masses is halved, the gravitational force becomes:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `half`
			},
			{
				id: "B",
				text: `double`
			},
			{
				id: "C",
				text: `four times`
			},
			{
				id: "D",
				text: `one-fourth`
			}
		],
		correct: "C",
		explanation: [
			{
				title: `Inverse square`,
				content: `F ∝ 1/r².`
			},
			{
				title: `New distance`,
				content: `r' = r/2 ⇒ F' / F = (r/r')² = 4.`
			},
			{
				title: `Result`,
				content: `Force becomes four times.`
			}
		],
		concepts: ["inverse square law"]
	},
	{
		id: "PHY11-GRAV-UNI-H-0003",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-02-universal-law-of-gravitation",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Three equal masses m are placed at the vertices of an equilateral triangle of side a. The magnitude of the net force on any one mass is:`,
		latex: `R=\\sqrt{3}\\,G m^2/a^2`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `G m² / a²`
			},
			{
				id: "B",
				text: `√3 G m² / a²`
			},
			{
				id: "C",
				text: `2 G m² / a²`
			},
			{
				id: "D",
				text: `√2 G m² / a²`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Two forces`,
				content: `Each mass feels two equal forces of magnitude G m²/a² at 60°.`
			},
			{
				title: `Resultant`,
				content: `R = 2 F cos(30°) = 2 (Gm²/a²)(√3/2) = √3 G m²/a².`
			},
			{
				title: `Direction`,
				content: `Along the angle bisector, towards the centroid.`
			}
		],
		concepts: ["vector addition", "gravitation"]
	},
	{
		id: "PHY11-GRAV-UNI-M-0004",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-02-universal-law-of-gravitation",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Gravitational force is a:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `contact force`
			},
			{
				id: "B",
				text: `conservative and central force`
			},
			{
				id: "C",
				text: `non-conservative force`
			},
			{
				id: "D",
				text: `nuclear force`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Central`,
				content: `It acts along the line joining the two masses.`
			},
			{
				title: `Conservative`,
				content: `Work around a closed path is zero; a potential exists.`
			},
			{
				title: `Long range`,
				content: `It is the weakest of the four fundamental forces but infinite in range.`
			}
		],
		concepts: ["conservative force", "central force"]
	},
	{
		id: "PHY11-GRAV-UNI-H-0005",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-02-universal-law-of-gravitation",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A mass m is placed at a distance 2R from the centre of a uniform sphere of mass M and radius R. The gravitational force on m is:`,
		latex: `F=\\frac{GMm}{(2R)^2}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `zero`
			},
			{
				id: "B",
				text: `GMm / R²`
			},
			{
				id: "C",
				text: `GMm / 4R²`
			},
			{
				id: "D",
				text: `GMm / 8R²`
			}
		],
		correct: "C",
		explanation: [
			{
				title: `External point`,
				content: `For r ≥ R a uniform sphere behaves as a point mass at its centre.`
			},
			{
				title: `Distance`,
				content: `r = 2R ⇒ F = GMm / (2R)² = GMm / 4R².`
			},
			{
				title: `Gauss/Newton shell`,
				content: `The shell theorem justifies replacing the sphere by M at the centre.`
			}
		],
		concepts: ["shell theorem"]
	},
	{
		id: "PHY11-GRAV-CON-M-0001",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-03-gravitational-constant",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The SI unit of the gravitational constant G is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `N m² kg⁻²`
			},
			{
				id: "B",
				text: `N m² kg⁻¹`
			},
			{
				id: "C",
				text: `N kg⁻²`
			},
			{
				id: "D",
				text: `m³ s⁻²`
			}
		],
		correct: "A",
		explanation: [
			{
				title: `From F = G m1 m2 / r²`,
				content: `G = F r² / (m1 m2).`
			},
			{
				title: `Units`,
				content: `N · m² / kg².`
			},
			{
				title: `Equivalent`,
				content: `Also m³ kg⁻¹ s⁻².`
			}
		],
		concepts: ["dimensional formula of G"]
	},
	{
		id: "PHY11-GRAV-CON-M-0002",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-03-gravitational-constant",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The numerical value of G is approximately:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `6.67 × 10⁻¹¹ N m² kg⁻²`
			},
			{
				id: "B",
				text: `6.67 × 10⁻⁸ N m² kg⁻²`
			},
			{
				id: "C",
				text: `9.8 N m² kg⁻²`
			},
			{
				id: "D",
				text: `6.67 × 10¹¹ N m² kg⁻²`
			}
		],
		correct: "A",
		explanation: [
			{
				title: `Cavendish`,
				content: `First measured in the laboratory by Cavendish (1798).`
			},
			{
				title: `Value`,
				content: `G ≈ 6.67 × 10⁻¹¹ N m² kg⁻².`
			},
			{
				title: `Smallness`,
				content: `The tiny value explains why gravity is weak between everyday masses.`
			}
		],
		concepts: ["Cavendish experiment"]
	},
	{
		id: "PHY11-GRAV-CON-H-0003",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-03-gravitational-constant",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The dimensional formula of G is:`,
		latex: `[G]=[M^{-1}L^3 T^{-2}]`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `[M⁻¹ L³ T⁻²]`
			},
			{
				id: "B",
				text: `[M L³ T⁻²]`
			},
			{
				id: "C",
				text: `[M⁻¹ L² T⁻²]`
			},
			{
				id: "D",
				text: `[M⁻² L³ T⁻²]`
			}
		],
		correct: "A",
		explanation: [
			{
				title: `Start from F = G m1 m2 / r²`,
				content: `G = F r² / m².`
			},
			{
				title: `Dimensions`,
				content: `[F] = MLT⁻², [r²] = L², [m²] = M².`
			},
			{
				title: `Result`,
				content: `[G] = MLT⁻² · L² · M⁻² = [M⁻¹ L³ T⁻²].`
			}
		],
		concepts: ["dimensions"]
	},
	{
		id: "PHY11-GRAV-CON-M-0004",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-03-gravitational-constant",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Which of the following is independent of the masses of the attracting bodies?`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `Gravitational force`
			},
			{
				id: "B",
				text: `Gravitational field`
			},
			{
				id: "C",
				text: `Gravitational constant G`
			},
			{
				id: "D",
				text: `Weight`
			}
		],
		correct: "C",
		explanation: [{
			title: `Universal`,
			content: `G is a universal constant — same everywhere, independent of the masses involved.`
		}, {
			title: `Contrast`,
			content: `Force, field and weight all depend on mass.`
		}],
		concepts: ["universal constant"]
	},
	{
		id: "PHY11-GRAV-ACC-M-0001",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-04-acceleration-due-to-gravity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Acceleration due to gravity at the surface of Earth is g = GM/R². At height h (h ≪ R) it is approximately:`,
		latex: `g(h)\\approx g\\left(1-\\frac{2h}{R}\\right)`,
		formulaUsed: `g(h)=\\frac{GM}{(R+h)^2}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `g (1 − h/R)`
			},
			{
				id: "B",
				text: `g (1 − 2h/R)`
			},
			{
				id: "C",
				text: `g (1 + 2h/R)`
			},
			{
				id: "D",
				text: `g (1 − h/2R)`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Exact`,
				content: `g(h) = GM/(R+h)² = g / (1 + h/R)².`
			},
			{
				title: `Binomial`,
				content: `For h ≪ R, (1 + x)⁻² ≈ 1 − 2x with x = h/R.`
			},
			{
				title: `Result`,
				content: `g(h) ≈ g (1 − 2h/R).`
			}
		],
		concepts: ["variation of g with height"]
	},
	{
		id: "PHY11-GRAV-ACC-M-0002",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-04-acceleration-due-to-gravity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `At a depth d below Earth's surface (uniform density), g is:`,
		latex: `g(d)=g\\left(1-\\frac{d}{R}\\right)`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `g (1 − d/R)`
			},
			{
				id: "B",
				text: `g (1 − 2d/R)`
			},
			{
				id: "C",
				text: `g (1 + d/R)`
			},
			{
				id: "D",
				text: `zero for any d`
			}
		],
		correct: "A",
		explanation: [
			{
				title: `Shell theorem`,
				content: `The outer shell contributes zero field inside.`
			},
			{
				title: `Inner sphere`,
				content: `Mass enclosed ∝ r³, field ∝ M/r² ∝ r.`
			},
			{
				title: `Linear drop`,
				content: `g(d) = g (1 − d/R).`
			}
		],
		concepts: ["variation of g with depth"]
	},
	{
		id: "PHY11-GRAV-ACC-H-0003",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-04-acceleration-due-to-gravity",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The height at which g becomes g/4 (above Earth's surface) is:`,
		latex: `\\frac{GM}{(R+h)^2}=\\frac{g}{4}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `R`
			},
			{
				id: "B",
				text: `R/2`
			},
			{
				id: "C",
				text: `2R`
			},
			{
				id: "D",
				text: `3R`
			}
		],
		correct: "A",
		explanation: [
			{
				title: `Set equal`,
				content: `GM/(R+h)² = (1/4) GM/R².`
			},
			{
				title: `Algebra`,
				content: `(R+h)² = 4 R² ⇒ R+h = 2R ⇒ h = R.`
			},
			{
				title: `Check`,
				content: `At r = 2R from centre, g' = g/4.`
			}
		],
		concepts: ["variation of g"]
	},
	{
		id: "PHY11-GRAV-ACC-H-0004",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-04-acceleration-due-to-gravity",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `If Earth were to shrink to half its radius without change of mass, g at the new surface would become:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `g/2`
			},
			{
				id: "B",
				text: `2g`
			},
			{
				id: "C",
				text: `4g`
			},
			{
				id: "D",
				text: `g/4`
			}
		],
		correct: "C",
		explanation: [
			{
				title: `g = GM/R²`,
				content: `Mass unchanged, R' = R/2.`
			},
			{
				title: `New g`,
				content: `g' = GM/(R/2)² = 4 GM/R² = 4g.`
			},
			{
				title: `Weight`,
				content: `You would weigh four times as much on the new surface.`
			}
		],
		concepts: ["g and radius"]
	},
	{
		id: "PHY11-GRAV-ACC-M-0005",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-04-acceleration-due-to-gravity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The value of g is maximum at:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `the equator`
			},
			{
				id: "B",
				text: `the poles`
			},
			{
				id: "C",
				text: `the centre of Earth`
			},
			{
				id: "D",
				text: `a height R above the surface`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Rotation`,
				content: `Centrifugal reduction of g is maximum at the equator, zero at the poles.`
			},
			{
				title: `Oblateness`,
				content: `Earth is slightly flattened, so poles are closer to the centre.`
			},
			{
				title: `Both effects`,
				content: `g is largest at the poles.`
			}
		],
		concepts: ["variation of g with latitude"]
	},
	{
		id: "PHY11-GRAV-POT-M-0001",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-05-gravitational-potential-energy",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Gravitational potential energy of a mass m at distance r from Earth's centre (r ≥ R) taking U(∞)=0 is:`,
		latex: `U(r)=-\\frac{GMm}{r}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `+GMm/r`
			},
			{
				id: "B",
				text: `−GMm/r`
			},
			{
				id: "C",
				text: `−GMm/r²`
			},
			{
				id: "D",
				text: `mgh`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Definition`,
				content: `U(r) − U(∞) = −∫_∞^r F · dr with F attractive.`
			},
			{
				title: `Result`,
				content: `U(r) = −GMm/r.`
			},
			{
				title: `Sign`,
				content: `Negative because gravity is attractive and U(∞)=0.`
			}
		],
		concepts: ["gravitational potential energy"]
	},
	{
		id: "PHY11-GRAV-POT-M-0002",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-05-gravitational-potential-energy",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Gravitational potential at a point is defined as:`,
		latex: `V=-\\frac{GM}{r}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `force per unit mass`
			},
			{
				id: "B",
				text: `work done per unit mass in bringing a test mass from infinity`
			},
			{
				id: "C",
				text: `energy per unit volume`
			},
			{
				id: "D",
				text: `mass per unit volume`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Potential V`,
				content: `V = U/m = −GM/r (for a point or spherical mass).`
			},
			{
				title: `Work`,
				content: `Work by an external agent, slowly, from infinity, without KE change.`
			},
			{
				title: `Field`,
				content: `g = −∇V.`
			}
		],
		concepts: ["gravitational potential"]
	},
	{
		id: "PHY11-GRAV-POT-H-0003",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-05-gravitational-potential-energy",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Work done in moving a 2 kg mass from r = 2R to r = 3R from Earth's centre is (M, R for Earth):`,
		latex: `W=U_f-U_i=\\frac{GMm}{6R}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `GMm/3R`
			},
			{
				id: "B",
				text: `GMm/6R`
			},
			{
				id: "C",
				text: `−GMm/6R`
			},
			{
				id: "D",
				text: `2GMm/3R`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `ΔU`,
				content: `W_ext = ΔU = U(3R) − U(2R) = −GMm/(3R) − (−GMm/(2R)).`
			},
			{
				title: `Compute`,
				content: `= GMm (1/2R − 1/3R) = GMm/(6R).`
			},
			{
				title: `m = 2 kg is already in GMm — wait`,
				content: `Here m is the 2 kg mass; the option is written in terms of m so the answer is GMm/6R.`
			}
		],
		concepts: ["work and potential"]
	},
	{
		id: "PHY11-GRAV-POT-H-0004",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-05-gravitational-potential-energy",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Inside a uniform solid sphere of mass M and radius R, gravitational potential at distance r from the centre (U(∞)=0) is:`,
		latex: `V(r)=-\\frac{GM(3R^2-r^2)}{2R^3}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `−GM/R`
			},
			{
				id: "B",
				text: `−GM (3R² − r²)/(2R³)`
			},
			{
				id: "C",
				text: `−GM/r`
			},
			{
				id: "D",
				text: `−GMr/R³`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Match at surface`,
				content: `At r = R, V = −GM/R, which option B also gives: −GM(3R²−R²)/2R³ = −GM/R.`
			},
			{
				title: `Field inside`,
				content: `g(r) = GMr/R³, and V(r) = V(R) − ∫_R^r g dr.`
			},
			{
				title: `Integrate`,
				content: `Yields V(r) = −GM(3R² − r²)/(2R³).`
			}
		],
		concepts: ["potential inside a sphere"]
	},
	{
		id: "PHY11-GRAV-POT-M-0005",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-05-gravitational-potential-energy",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The gravitational potential is the same everywhere on:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `a radial line`
			},
			{
				id: "B",
				text: `an equipotential surface`
			},
			{
				id: "C",
				text: `the Earth's axis`
			},
			{
				id: "D",
				text: `a magnetic meridian`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Definition`,
				content: `An equipotential surface is a surface of constant V.`
			},
			{
				title: `Work`,
				content: `No work is done in moving a mass on an equipotential.`
			},
			{
				title: `Earth`,
				content: `Approximately spherical equipotentials around Earth.`
			}
		],
		concepts: ["equipotential"]
	},
	{
		id: "PHY11-GRAV-ESC-M-0001",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-06-escape-velocity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The escape velocity from Earth's surface is approximately:`,
		latex: `v_e=\\sqrt{\\frac{2GM}{R}}`,
		formulaUsed: `v_e=\\sqrt{2gR}`,
		isPyq: false,
		commonMistakes: [`Confusing escape velocity with orbital velocity (7.9 km/s)`, `Forgetting the factor of 2 inside the square root`],
		options: [
			{
				id: "A",
				text: `7.9 km/s`
			},
			{
				id: "B",
				text: `11.2 km/s`
			},
			{
				id: "C",
				text: `15.0 km/s`
			},
			{
				id: "D",
				text: `3.0 km/s`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Definition`,
				content: `Minimum speed to reach r = ∞ with zero leftover KE.`
			},
			{
				title: `Energy`,
				content: `½ m v_e² − GMm/R = 0 ⇒ v_e = √(2GM/R) = √(2gR).`
			},
			{
				title: `Value`,
				content: `√(2 × 9.8 × 6.4×10⁶) ≈ 11.2 km/s.`
			}
		],
		concepts: ["escape velocity"]
	},
	{
		id: "PHY11-GRAV-ESC-M-0002",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-06-escape-velocity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Escape velocity from the surface of a planet is independent of:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `mass of the planet`
			},
			{
				id: "B",
				text: `radius of the planet`
			},
			{
				id: "C",
				text: `mass of the escaping body`
			},
			{
				id: "D",
				text: `density of the planet`
			}
		],
		correct: "C",
		explanation: [
			{
				title: `Formula`,
				content: `v_e = √(2GM/R) — no m of the projectile.`
			},
			{
				title: `Why`,
				content: `Both KE and PE are proportional to m, so m cancels.`
			},
			{
				title: `Density`,
				content: `v_e = R √(8πGρ/3) so it does depend on density and R.`
			}
		],
		concepts: ["escape velocity"]
	},
	{
		id: "PHY11-GRAV-ESC-H-0003",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-06-escape-velocity",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The ratio of escape velocity to orbital velocity (for a circular orbit just above the surface) is:`,
		latex: `v_e=\\sqrt{2}\\,v_o`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `√2`
			},
			{
				id: "B",
				text: `2`
			},
			{
				id: "C",
				text: `1/√2`
			},
			{
				id: "D",
				text: `4`
			}
		],
		correct: "A",
		explanation: [
			{
				title: `Orbital`,
				content: `v_o = √(GM/R).`
			},
			{
				title: `Escape`,
				content: `v_e = √(2GM/R) = √2 v_o.`
			},
			{
				title: `Numbers`,
				content: `7.9 km/s vs 11.2 km/s ≈ √2.`
			}
		],
		concepts: ["orbital vs escape"]
	},
	{
		id: "PHY11-GRAV-ESC-H-0004",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-06-escape-velocity",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A body is projected vertically from Earth's surface with speed √(gR). The maximum height reached above the surface is:`,
		latex: `\\tfrac12 mv^2-\\frac{GMm}{R}=-\\frac{GMm}{R+h}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `R/2`
			},
			{
				id: "B",
				text: `R`
			},
			{
				id: "C",
				text: `R/4`
			},
			{
				id: "D",
				text: `2R`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Energy`,
				content: `½ m (gR) − GMm/R = − GMm/(R+h). Use GM = gR².`
			},
			{
				title: `Simplify`,
				content: `½ gR − gR = − gR²/(R+h) ⇒ −½ gR = − gR²/(R+h).`
			},
			{
				title: `Solve`,
				content: `R+h = 2R ⇒ h = R.`
			}
		],
		concepts: ["energy conservation", "escape"]
	},
	{
		id: "PHY11-GRAV-ESC-M-0005",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-06-escape-velocity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `If the radius of a planet is doubled keeping density constant, escape velocity becomes:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `half`
			},
			{
				id: "B",
				text: `double`
			},
			{
				id: "C",
				text: `four times`
			},
			{
				id: "D",
				text: `unchanged`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `v_e = R √(8πGρ/3)`,
				content: `Proportional to R at constant density.`
			},
			{
				title: `R' = 2R`,
				content: `v_e' = 2 v_e.`
			},
			{
				title: `Mass also scales`,
				content: `M ∝ R³, v_e ∝ √(M/R) ∝ R.`
			}
		],
		concepts: ["escape velocity", "density"]
	},
	{
		id: "PHY11-GRAV-ESC-H-0006",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-06-escape-velocity",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Escape velocity from a height R above Earth's surface is:`,
		latex: `v_e(r)=\\sqrt{2GM/r}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `√(gR)`
			},
			{
				id: "B",
				text: `√(2gR)`
			},
			{
				id: "C",
				text: `√(gR/2)`
			},
			{
				id: "D",
				text: `√(gR)/2`
			}
		],
		correct: "A",
		explanation: [
			{
				title: `At r = 2R`,
				content: `v_e(r) = √(2GM/r) = √(2 g R² / 2R) = √(gR).`
			},
			{
				title: `Compare`,
				content: `Surface escape is √(2gR); from height R it is smaller by √2.`
			},
			{
				title: `Energy`,
				content: `Need ½mv² = GMm/(2R).`
			}
		],
		concepts: ["escape from a height"]
	},
	{
		id: "PHY11-GRAV-SAT-M-0001",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-07-earth-satellites",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The orbital speed of a satellite in a circular orbit of radius r is:`,
		latex: `v_o=\\sqrt{\\frac{GM}{r}}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `√(GM/r)`
			},
			{
				id: "B",
				text: `√(2GM/r)`
			},
			{
				id: "C",
				text: `GM/r`
			},
			{
				id: "D",
				text: `√(GM/r³)`
			}
		],
		correct: "A",
		explanation: [
			{
				title: `Centripetal = gravity`,
				content: `mv²/r = GMm/r².`
			},
			{
				title: `Solve`,
				content: `v = √(GM/r).`
			},
			{
				title: `Near Earth`,
				content: `r ≈ R ⇒ v ≈ 7.9 km/s.`
			}
		],
		concepts: ["orbital velocity"]
	},
	{
		id: "PHY11-GRAV-SAT-M-0002",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-07-earth-satellites",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A geostationary satellite has an orbital period of:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `12 hours`
			},
			{
				id: "B",
				text: `24 hours`
			},
			{
				id: "C",
				text: `27 days`
			},
			{
				id: "D",
				text: `365 days`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Definition`,
				content: `It stays fixed over one point on the equator.`
			},
			{
				title: `Period`,
				content: `Must equal Earth's sidereal rotation period ≈ 24 h.`
			},
			{
				title: `Orbit`,
				content: `Equatorial, r ≈ 42000 km from centre.`
			}
		],
		concepts: ["geostationary satellite"]
	},
	{
		id: "PHY11-GRAV-SAT-H-0003",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-07-earth-satellites",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The height of a geostationary satellite above Earth's surface is nearly:`,
		isPyq: false,
		commonMistakes: [`Quoting 42000 km as height above the surface`],
		options: [
			{
				id: "A",
				text: `3600 km`
			},
			{
				id: "B",
				text: `36000 km`
			},
			{
				id: "C",
				text: `6400 km`
			},
			{
				id: "D",
				text: `42000 km`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Kepler`,
				content: `T² = 4π² r³ / GM with T = 24 h.`
			},
			{
				title: `r ≈ 42000 km from centre`,
				content: `Height h = r − R ≈ 42000 − 6400 ≈ 36000 km.`
			},
			{
				title: `Trap`,
				content: `42000 km is from the centre, not the surface.`
			}
		],
		concepts: ["geostationary orbit"]
	},
	{
		id: "PHY11-GRAV-SAT-H-0004",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-07-earth-satellites",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `If the orbital radius of a satellite is increased to 4 times, its time period becomes:`,
		latex: `T\\propto r^{3/2}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `4 times`
			},
			{
				id: "B",
				text: `8 times`
			},
			{
				id: "C",
				text: `2 times`
			},
			{
				id: "D",
				text: `16 times`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `T² ∝ r³`,
				content: `T ∝ r^{3/2}.`
			},
			{
				title: `r' = 4r`,
				content: `T'/T = 4^{3/2} = 8.`
			},
			{
				title: `Kepler III`,
				content: `Same as planetary motion around the Sun.`
			}
		],
		concepts: ["Kepler III", "satellites"]
	},
	{
		id: "PHY11-GRAV-SAT-M-0005",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-07-earth-satellites",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Polar satellites are typically used for:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `telecommunication only`
			},
			{
				id: "B",
				text: `weather and remote sensing`
			},
			{
				id: "C",
				text: `GPS exclusively`
			},
			{
				id: "D",
				text: `studying the Sun`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Orbit`,
				content: `Low Earth, nearly polar, so they scan the whole globe as Earth rotates.`
			},
			{
				title: `Uses`,
				content: `Earth observation, weather, reconnaissance.`
			},
			{
				title: `Contrast`,
				content: `Geo sats sit over the equator and cannot see the poles well.`
			}
		],
		concepts: ["polar satellite"]
	},
	{
		id: "PHY11-GRAV-ENE-M-0001",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-08-energy-of-an-orbiting-satellite",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Total mechanical energy of a satellite of mass m in a circular orbit of radius r is:`,
		latex: `E=-\\frac{GMm}{2r}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `GMm/r`
			},
			{
				id: "B",
				text: `−GMm/r`
			},
			{
				id: "C",
				text: `−GMm/(2r)`
			},
			{
				id: "D",
				text: `GMm/(2r)`
			}
		],
		correct: "C",
		explanation: [
			{
				title: `KE`,
				content: `K = GMm/(2r) because ½mv² = GMm/(2r).`
			},
			{
				title: `PE`,
				content: `U = −GMm/r.`
			},
			{
				title: `Total`,
				content: `E = K + U = −GMm/(2r). Bound orbits have E < 0.`
			}
		],
		concepts: ["satellite energy"]
	},
	{
		id: "PHY11-GRAV-ENE-M-0002",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-08-energy-of-an-orbiting-satellite",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Kinetic energy of a satellite in circular orbit is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `equal to total energy`
			},
			{
				id: "B",
				text: `equal to |total energy|`
			},
			{
				id: "C",
				text: `twice |total energy|`
			},
			{
				id: "D",
				text: `half the potential energy in magnitude`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `K = GMm/2r`,
				content: `|E| = GMm/2r so K = |E|.`
			},
			{
				title: `U = −2K`,
				content: `|U| = 2K.`
			},
			{
				title: `Virial`,
				content: `For 1/r potentials, 2K = −U.`
			}
		],
		concepts: ["virial theorem", "satellite energy"]
	},
	{
		id: "PHY11-GRAV-ENE-H-0003",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-08-energy-of-an-orbiting-satellite",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `To move a satellite from an orbit of radius r to 2r, the extra energy that must be given (per unit mass) is:`,
		latex: `\\Delta E=\\frac{GM}{4r}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `GM/(2r)`
			},
			{
				id: "B",
				text: `GM/(4r)`
			},
			{
				id: "C",
				text: `GM/(8r)`
			},
			{
				id: "D",
				text: `GM/r`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `E(r) = −GM/(2r) per unit mass`,
				content: `E(2r) = −GM/(4r).`
			},
			{
				title: `ΔE`,
				content: `E(2r) − E(r) = −GM/4r + GM/2r = GM/(4r).`
			},
			{
				title: `Sign`,
				content: `Energy must be supplied — the higher orbit is less bound.`
			}
		],
		concepts: ["orbital transfer"]
	},
	{
		id: "PHY11-GRAV-ENE-H-0004",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-08-energy-of-an-orbiting-satellite",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Binding energy of a satellite of mass m in a circular orbit of radius r is:`,
		isPyq: false,
		commonMistakes: [`Taking binding energy as GMm/r instead of GMm/2r`],
		options: [
			{
				id: "A",
				text: `GMm/r`
			},
			{
				id: "B",
				text: `GMm/(2r)`
			},
			{
				id: "C",
				text: `GMm/(4r)`
			},
			{
				id: "D",
				text: `2GMm/r`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Definition`,
				content: `Energy required to send the satellite to infinity with zero KE.`
			},
			{
				title: `|E|`,
				content: `Binding energy = −E = GMm/(2r).`
			},
			{
				title: `Not PE`,
				content: `Do not confuse with |U| = GMm/r.`
			}
		],
		concepts: ["binding energy"]
	},
	{
		id: "PHY11-GRAV-ENE-M-0005",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-08-energy-of-an-orbiting-satellite",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `If the radius of a circular orbit is doubled, the kinetic energy of the satellite:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `doubles`
			},
			{
				id: "B",
				text: `becomes half`
			},
			{
				id: "C",
				text: `becomes one-fourth`
			},
			{
				id: "D",
				text: `remains same`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `K = GMm/2r`,
				content: `Inversely proportional to r.`
			},
			{
				title: `r → 2r`,
				content: `K → K/2.`
			},
			{
				title: `Slower, higher`,
				content: `The satellite is slower in the higher orbit.`
			}
		],
		concepts: ["kinetic energy of satellite"]
	},
	{
		id: "PHY11-GRAV-ESC-M-0101",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-06-escape-velocity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The escape velocity of a body from the Earth's surface is ve. The escape velocity from the surface of a planet whose mass and radius are twice those of Earth is:`,
		isPyq: true,
		pyqYear: 2023,
		pyqExam: "CBSE",
		options: [
			{
				id: "A",
				text: `ve`
			},
			{
				id: "B",
				text: `2 ve`
			},
			{
				id: "C",
				text: `√2 ve`
			},
			{
				id: "D",
				text: `ve/2`
			}
		],
		correct: "A",
		explanation: [{
			title: `v_e = √(2GM/R)`,
			content: `v' = √(2G(2M)/(2R)) = √(2GM/R) = ve.`
		}, {
			title: `Cancel`,
			content: `Mass and radius both doubled cancel in the ratio M/R.`
		}],
		concepts: ["escape velocity"]
	},
	{
		id: "PHY11-GRAV-KEP-M-0102",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-01-kepler-s-laws",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The period of a planet around the Sun is 8 times that of Earth. The ratio of the distance of the planet from the Sun to that of Earth is:`,
		isPyq: true,
		pyqYear: 2022,
		pyqExam: "CBSE",
		options: [
			{
				id: "A",
				text: `2`
			},
			{
				id: "B",
				text: `4`
			},
			{
				id: "C",
				text: `8`
			},
			{
				id: "D",
				text: `16`
			}
		],
		correct: "B",
		explanation: [{
			title: `T² ∝ r³`,
			content: `(8)² / 1 = r³ / R³ ⇒ 64 = (r/R)³ ⇒ r/R = 4.`
		}],
		concepts: ["Kepler's third law"]
	},
	{
		id: "PHY11-GRAV-ENE-H-0103",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-08-energy-of-an-orbiting-satellite",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A satellite is revolving in a circular orbit at a height h from the Earth's surface (radius R). If h ≪ R, the orbital speed is approximately:`,
		isPyq: true,
		pyqYear: 2024,
		pyqExam: "CBSE",
		options: [
			{
				id: "A",
				text: `√(gR)`
			},
			{
				id: "B",
				text: `√(g(R+h))`
			},
			{
				id: "C",
				text: `√(2gR)`
			},
			{
				id: "D",
				text: `√(gR/2)`
			}
		],
		correct: "A",
		explanation: [{
			title: `v = √(GM/r)`,
			content: `r = R+h ≈ R, GM = gR² ⇒ v ≈ √(gR).`
		}],
		concepts: ["orbital velocity"]
	},
	{
		id: "PHY11-GRAV-ACC-M-0104",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-04-acceleration-due-to-gravity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The weight of a body at the centre of the Earth is:`,
		isPyq: true,
		pyqYear: 2021,
		pyqExam: "CBSE",
		options: [
			{
				id: "A",
				text: `infinite`
			},
			{
				id: "B",
				text: `equal to its weight at the surface`
			},
			{
				id: "C",
				text: `zero`
			},
			{
				id: "D",
				text: `half of the surface weight`
			}
		],
		correct: "C",
		explanation: [{
			title: `g(0)=0`,
			content: `Field inside a uniform sphere is proportional to r, so g = 0 at the centre.`
		}, {
			title: `Weight`,
			content: `W = mg = 0.`
		}],
		concepts: ["g at centre"]
	},
	{
		id: "PHY11-GRAV-MIX-H-0001",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-06-escape-velocity",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A satellite is in a circular orbit close to Earth's surface. The minimum additional speed it needs to escape to infinity is:`,
		latex: `\\Delta v=\\sqrt{gR}(\\sqrt{2}-1)`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `√(gR) (√2 − 1)`
			},
			{
				id: "B",
				text: `√(gR)`
			},
			{
				id: "C",
				text: `√(2gR)`
			},
			{
				id: "D",
				text: `√(gR) (√2 + 1)`
			}
		],
		correct: "A",
		explanation: [
			{
				title: `Current`,
				content: `v_o = √(gR). Need v_e = √(2gR).`
			},
			{
				title: `Δv`,
				content: `√(2gR) − √(gR) = √(gR)(√2 − 1).`
			},
			{
				title: `Direction`,
				content: `Boost along the velocity vector.`
			}
		],
		concepts: ["escape", "orbital transfer"]
	},
	{
		id: "PHY11-GRAV-MIX-M-0002",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-07-earth-satellites",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Which of the following quantities is conserved for a planet in an elliptical orbit around the Sun?`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `Linear momentum`
			},
			{
				id: "B",
				text: `Angular momentum about the Sun`
			},
			{
				id: "C",
				text: `Kinetic energy`
			},
			{
				id: "D",
				text: `Potential energy`
			}
		],
		correct: "B",
		explanation: [
			{
				title: `Central force`,
				content: `Torque about the Sun is zero.`
			},
			{
				title: `L conserved`,
				content: `Angular momentum about the Sun is constant.`
			},
			{
				title: `KE and PE`,
				content: `Both vary; total energy is conserved but that is not listed as the distinguishing conserved vector.`
			}
		],
		concepts: ["angular momentum"]
	},
	{
		id: "PHY10-LIG-LAW-M-0001",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-01-light-reflection-refraction",
		topicId: "topic-01-laws-of-reflection",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The angle of incidence is equal to the angle of reflection. The two angles are measured from:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `the mirror surface`
			},
			{
				id: "B",
				text: `the normal to the mirror`
			},
			{
				id: "C",
				text: `the incident ray`
			},
			{
				id: "D",
				text: `the reflected ray`
			}
		],
		correct: "B",
		explanation: [{
			title: `Law`,
			content: `i = r, both measured from the normal.`
		}, {
			title: `Plane`,
			content: `Incident ray, reflected ray and normal lie in one plane.`
		}],
		concepts: ["laws of reflection"]
	},
	{
		id: "PHY10-LIG-MIR-M-0002",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-01-light-reflection-refraction",
		topicId: "topic-03-mirror-formula-and-magnification",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A concave mirror of focal length 15 cm forms a real image at 45 cm. The object distance is:`,
		latex: `\\frac{1}{v}+\\frac{1}{u}=\\frac{1}{f}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `−22.5 cm`
			},
			{
				id: "B",
				text: `−10 cm`
			},
			{
				id: "C",
				text: `−30 cm`
			},
			{
				id: "D",
				text: `+22.5 cm`
			}
		],
		correct: "A",
		explanation: [
			{
				title: `Mirror formula`,
				content: `1/v + 1/u = 1/f.`
			},
			{
				title: `Sign convention`,
				content: `f = −15 cm, v = −45 cm (real).`
			},
			{
				title: `Solve`,
				content: `1/u = 1/f − 1/v = −1/15 + 1/45 = −2/45 ⇒ u = −22.5 cm.`
			}
		],
		concepts: ["mirror formula"]
	},
	{
		id: "PHY10-LIG-LEN-M-0003",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-01-light-reflection-refraction",
		topicId: "topic-07-lens-formula-and-power",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Power of a convex lens of focal length 50 cm is:`,
		latex: `P=\\frac{1}{f}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `+2 D`
			},
			{
				id: "B",
				text: `+0.5 D`
			},
			{
				id: "C",
				text: `−2 D`
			},
			{
				id: "D",
				text: `+5 D`
			}
		],
		correct: "A",
		explanation: [{
			title: `P = 1/f (in metres)`,
			content: `f = 0.50 m, convex so positive.`
		}, {
			title: `P = +2 D`,
			content: `A dioptre is m⁻¹.`
		}],
		concepts: ["power of a lens"]
	},
	{
		id: "PHY10-LIG-TIR-M-0004",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-01-light-reflection-refraction",
		topicId: "topic-08-total-internal-reflection",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Total internal reflection occurs when light travels from:`,
		latex: `\\sin i_c=1/\\mu`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `air to water`
			},
			{
				id: "B",
				text: `air to glass`
			},
			{
				id: "C",
				text: `glass to air at an angle greater than critical angle`
			},
			{
				id: "D",
				text: `vacuum to glass`
			}
		],
		correct: "C",
		explanation: [{
			title: `Conditions`,
			content: `Denser to rarer, and i > i_c.`
		}, {
			title: `i_c`,
			content: `sin i_c = 1/μ.`
		}],
		concepts: ["TIR"]
	},
	{
		id: "PHY10-LIG-SNE-H-0005",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-01-light-reflection-refraction",
		topicId: "topic-04-laws-of-refraction-and-snell-s-law",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A ray in air is incident on glass (μ = 1.5) at 30°. The angle of refraction is nearly:`,
		latex: `n_1\\sin i=n_2\\sin r`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `19.5°`
			},
			{
				id: "B",
				text: `30°`
			},
			{
				id: "C",
				text: `48.6°`
			},
			{
				id: "D",
				text: `60°`
			}
		],
		correct: "A",
		explanation: [{
			title: `Snell`,
			content: `1 · sin 30° = 1.5 sin r.`
		}, {
			title: `sin r = 0.5/1.5 = 1/3`,
			content: `r ≈ 19.5°.`
		}],
		concepts: ["Snell's law"]
	},
	{
		id: "PHY10-LIG-MIR-H-0006",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-01-light-reflection-refraction",
		topicId: "topic-03-mirror-formula-and-magnification",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Magnification produced by a plane mirror is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `+1`
			},
			{
				id: "B",
				text: `−1`
			},
			{
				id: "C",
				text: `0`
			},
			{
				id: "D",
				text: `infinite`
			}
		],
		correct: "A",
		explanation: [{
			title: `Virtual, erect, same size`,
			content: `m = +1.`
		}, {
			title: `Sign`,
			content: `Positive magnification means erect.`
		}],
		concepts: ["magnification"]
	},
	{
		id: "PHY10-LIG-LEN-H-0007",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-01-light-reflection-refraction",
		topicId: "topic-07-lens-formula-and-power",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A convex lens of focal length 20 cm is combined with a concave lens of focal length 25 cm. The combination behaves as:`,
		isPyq: true,
		pyqYear: 2023,
		pyqExam: "CBSE",
		options: [
			{
				id: "A",
				text: `a convex lens of 100 cm`
			},
			{
				id: "B",
				text: `a concave lens of 100 cm`
			},
			{
				id: "C",
				text: `a convex lens of 10 cm`
			},
			{
				id: "D",
				text: `a plane glass`
			}
		],
		correct: "A",
		explanation: [{
			title: `P = P1+P2`,
			content: `+5 D + (−4 D) = +1 D.`
		}, {
			title: `f`,
			content: ` `,
			latex: `=`
		}],
		concepts: ["combination of lenses"]
	},
	{
		id: "PHY10-LIG-LAW-M-0008",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-01-light-reflection-refraction",
		topicId: "topic-01-laws-of-reflection",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The image formed by a convex mirror is always:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `real and inverted`
			},
			{
				id: "B",
				text: `virtual, erect and diminished`
			},
			{
				id: "C",
				text: `real and magnified`
			},
			{
				id: "D",
				text: `virtual and magnified`
			}
		],
		correct: "B",
		explanation: [{
			title: `Ray diagram`,
			content: `Convex mirrors form virtual, erect, diminished images for all real objects.`
		}, {
			title: `Use`,
			content: `Rear-view mirrors.`
		}],
		concepts: ["spherical mirrors"]
	},
	{
		id: "PHY10-ELE-OHM-M-0001",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-03-electricity",
		topicId: "topic-02-potential-difference-and-ohm-s-law",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Ohm's law states that:`,
		latex: `V=IR`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `V ∝ 1/I`
			},
			{
				id: "B",
				text: `V = IR at constant temperature`
			},
			{
				id: "C",
				text: `P = VI²`
			},
			{
				id: "D",
				text: `R = I/V`
			}
		],
		correct: "B",
		explanation: [{
			title: `Statement`,
			content: `V = IR for a metallic conductor at constant temperature.`
		}, {
			title: `Graph`,
			content: `V–I graph is a straight line through the origin.`
		}],
		concepts: ["Ohm's law"]
	},
	{
		id: "PHY10-ELE-RES-M-0002",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-03-electricity",
		topicId: "topic-04-series-and-parallel-resistors",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Two resistors 3 Ω and 6 Ω in parallel have equivalent resistance:`,
		latex: `\\frac{1}{R_p}=\\frac{1}{R_1}+\\frac{1}{R_2}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `9 Ω`
			},
			{
				id: "B",
				text: `2 Ω`
			},
			{
				id: "C",
				text: `0.5 Ω`
			},
			{
				id: "D",
				text: `18 Ω`
			}
		],
		correct: "B",
		explanation: [{
			title: `1/Rp = 1/3 + 1/6 = 1/2`,
			content: `Rp = 2 Ω.`
		}],
		concepts: ["parallel resistors"]
	},
	{
		id: "PHY10-ELE-POW-M-0003",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-03-electricity",
		topicId: "topic-06-electric-power-and-energy",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A 60 W bulb runs on 220 V. The current drawn is approximately:`,
		latex: `P=VI`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `0.27 A`
			},
			{
				id: "B",
				text: `3.7 A`
			},
			{
				id: "C",
				text: `60 A`
			},
			{
				id: "D",
				text: `13.2 A`
			}
		],
		correct: "A",
		explanation: [{
			title: `P = VI`,
			content: `I = P/V = 60/220 ≈ 0.27 A.`
		}],
		concepts: ["electric power"]
	},
	{
		id: "PHY10-ELE-JOU-H-0004",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-03-electricity",
		topicId: "topic-05-heating-effect-of-current",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Heat produced in a resistor is  I²Rt. If current is doubled for the same time, heat becomes:`,
		latex: `H=I^2 Rt`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `double`
			},
			{
				id: "B",
				text: `half`
			},
			{
				id: "C",
				text: `four times`
			},
			{
				id: "D",
				text: `unchanged`
			}
		],
		correct: "C",
		explanation: [{
			title: `H ∝ I²`,
			content: `(2I)² = 4 I².`
		}],
		concepts: ["Joule's law"]
	},
	{
		id: "PHY10-ELE-RES-H-0005",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-03-electricity",
		topicId: "topic-03-resistance-and-resistivity",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Resistivity of a wire depends on:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `length`
			},
			{
				id: "B",
				text: `area of cross-section`
			},
			{
				id: "C",
				text: `material and temperature`
			},
			{
				id: "D",
				text: `current`
			}
		],
		correct: "C",
		explanation: [{
			title: `ρ is material property`,
			content: `R = ρℓ/A; ρ does not depend on ℓ or A.`
		}],
		concepts: ["resistivity"]
	},
	{
		id: "PHY10-ELE-OHM-M-0006",
		class: 10,
		subject: "Physics",
		chapterId: "chapter-03-electricity",
		topicId: "topic-02-potential-difference-and-ohm-s-law",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `SI unit of potential difference is:`,
		isPyq: true,
		pyqYear: 2022,
		pyqExam: "CBSE",
		options: [
			{
				id: "A",
				text: `ampere`
			},
			{
				id: "B",
				text: `ohm`
			},
			{
				id: "C",
				text: `volt`
			},
			{
				id: "D",
				text: `watt`
			}
		],
		correct: "C",
		explanation: [{
			title: `1 volt = 1 joule / coulomb`,
			content: `Work to move 1 C through 1 V is 1 J.`
		}],
		concepts: ["potential difference"]
	},
	{
		id: "PHY12-CUR-DRI-M-0001",
		class: 12,
		subject: "Physics",
		chapterId: "chapter-03-current-electricity",
		topicId: "topic-01-drift-velocity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Drift velocity of electrons in a metal is typically of order:`,
		latex: `I=neAv_d`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `10⁸ m/s`
			},
			{
				id: "B",
				text: `10⁻⁴ m/s`
			},
			{
				id: "C",
				text: `3 × 10⁸ m/s`
			},
			{
				id: "D",
				text: `10³ m/s`
			}
		],
		correct: "B",
		explanation: [{
			title: `Slow drift`,
			content: `Thermal speeds are ~10⁵ m/s; drift is millimetres per second.`
		}, {
			title: `Current`,
			content: `I = n e A v_d still large because n is huge.`
		}],
		concepts: ["drift velocity"]
	},
	{
		id: "PHY12-CUR-KIR-H-0002",
		class: 12,
		subject: "Physics",
		chapterId: "chapter-03-current-electricity",
		topicId: "topic-03-kirchhoff-s-laws",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Kirchhoff's junction rule is a consequence of conservation of:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `energy`
			},
			{
				id: "B",
				text: `charge`
			},
			{
				id: "C",
				text: `momentum`
			},
			{
				id: "D",
				text: `mass`
			}
		],
		correct: "B",
		explanation: [{
			title: `KCL`,
			content: `Σ I = 0 at a junction — charge is conserved.`
		}, {
			title: `KVL`,
			content: `Σ ε = Σ IR around a loop — energy is conserved.`
		}],
		concepts: ["Kirchhoff's laws"]
	},
	{
		id: "PHY12-CUR-WHE-M-0003",
		class: 12,
		subject: "Physics",
		chapterId: "chapter-03-current-electricity",
		topicId: "topic-04-wheatstone-bridge",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A Wheatstone bridge is balanced when:`,
		latex: `\\frac{P}{Q}=\\frac{R}{S}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `P/Q = R/S`
			},
			{
				id: "B",
				text: `P/Q = S/R`
			},
			{
				id: "C",
				text: `P + Q = R + S`
			},
			{
				id: "D",
				text: `P Q = R S`
			}
		],
		correct: "A",
		explanation: [{
			title: `Balance`,
			content: `No current through the galvanometer when P/Q = R/S.`
		}],
		concepts: ["Wheatstone bridge"]
	},
	{
		id: "PHY12-CUR-EMF-H-0004",
		class: 12,
		subject: "Physics",
		chapterId: "chapter-03-current-electricity",
		topicId: "topic-05-cells-and-emf",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A cell of emf 2 V and internal resistance 1 Ω is connected to a 3 Ω resistor. Terminal voltage is:`,
		latex: `V=\\varepsilon-Ir`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `2 V`
			},
			{
				id: "B",
				text: `1.5 V`
			},
			{
				id: "C",
				text: `0.5 V`
			},
			{
				id: "D",
				text: `2.5 V`
			}
		],
		correct: "B",
		explanation: [{
			title: `I = ε/(R+r) = 2/4 = 0.5 A`,
			content: `V = ε − Ir = 2 − 0.5 = 1.5 V.`
		}, {
			title: `A`,
			content: `l`,
			latex: `s`
		}],
		concepts: ["internal resistance"]
	},
	{
		id: "PHY12-CUR-OHM-M-0005",
		class: 12,
		subject: "Physics",
		chapterId: "chapter-03-current-electricity",
		topicId: "topic-02-ohm-s-law-and-resistivity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The resistivity of a semiconductor with rise in temperature:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `increases`
			},
			{
				id: "B",
				text: `decreases`
			},
			{
				id: "C",
				text: `remains same`
			},
			{
				id: "D",
				text: `first increases then decreases`
			}
		],
		correct: "B",
		explanation: [{
			title: `More carriers`,
			content: `n increases exponentially, so ρ falls.`
		}],
		concepts: ["resistivity"]
	},
	{
		id: "PHY9-MOT-DIS-M-0001",
		class: 9,
		subject: "Physics",
		chapterId: "chapter-01-describing-motion-around-us",
		topicId: "topic-01-distance-and-displacement",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A student walks 3 m east and then 4 m north. Displacement is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `7 m`
			},
			{
				id: "B",
				text: `1 m`
			},
			{
				id: "C",
				text: `5 m`
			},
			{
				id: "D",
				text: `12 m`
			}
		],
		correct: "C",
		explanation: [{
			title: `Vector`,
			content: `Displacement is the straight-line result, √(3²+4²)=5 m north-east.`
		}, {
			title: `Distance`,
			content: `Distance travelled is 7 m.`
		}],
		concepts: ["displacement"]
	},
	{
		id: "PHY9-MOT-VEL-M-0002",
		class: 9,
		subject: "Physics",
		chapterId: "chapter-01-describing-motion-around-us",
		topicId: "topic-02-speed-and-velocity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Average speed of a car that travels 60 km in 1.5 h is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `40 km/h`
			},
			{
				id: "B",
				text: `90 km/h`
			},
			{
				id: "C",
				text: `60 km/h`
			},
			{
				id: "D",
				text: `30 km/h`
			}
		],
		correct: "A",
		explanation: [{
			title: `v_avg = s/t`,
			content: `60 / 1.5 = 40 km/h.`
		}],
		concepts: ["average speed"]
	},
	{
		id: "PHY9-MOT-ACC-M-0003",
		class: 9,
		subject: "Physics",
		chapterId: "chapter-01-describing-motion-around-us",
		topicId: "topic-03-acceleration",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A body starting from rest has acceleration 2 m/s². Speed after 5 s is:`,
		latex: `v=u+at`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `10 m/s`
			},
			{
				id: "B",
				text: `2.5 m/s`
			},
			{
				id: "C",
				text: `7 m/s`
			},
			{
				id: "D",
				text: `0.4 m/s`
			}
		],
		correct: "A",
		explanation: [{
			title: `v = u + at`,
			content: `0 + 2×5 = 10 m/s.`
		}],
		concepts: ["acceleration"]
	},
	{
		id: "PHY9-MOT-EQN-H-0004",
		class: 9,
		subject: "Physics",
		chapterId: "chapter-01-describing-motion-around-us",
		topicId: "topic-05-equations-of-motion",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A ball is thrown up with 20 m/s. Maximum height (g = 10 m/s²) is:`,
		latex: `v^2=u^2-2as`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `10 m`
			},
			{
				id: "B",
				text: `20 m`
			},
			{
				id: "C",
				text: `40 m`
			},
			{
				id: "D",
				text: `5 m`
			}
		],
		correct: "B",
		explanation: [{
			title: `v² = u² − 2gs`,
			content: `0 = 400 − 20 s ⇒ s = 20 m.`
		}],
		concepts: ["equations of motion"]
	},
	{
		id: "PHY9-MOT-GRA-M-0005",
		class: 9,
		subject: "Physics",
		chapterId: "chapter-01-describing-motion-around-us",
		topicId: "topic-04-graphical-representation-of-motion",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The area under a velocity–time graph represents:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `acceleration`
			},
			{
				id: "B",
				text: `displacement`
			},
			{
				id: "C",
				text: `force`
			},
			{
				id: "D",
				text: `momentum`
			}
		],
		correct: "B",
		explanation: [{
			title: `∫ v dt = displacement`,
			content: `Slope of v–t is acceleration.`
		}],
		concepts: ["v–t graph"]
	},
	{
		id: "PHY9-MOT-UCM-M-0006",
		class: 9,
		subject: "Physics",
		chapterId: "chapter-01-describing-motion-around-us",
		topicId: "topic-06-uniform-circular-motion",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `In uniform circular motion, which quantity is constant?`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `Velocity`
			},
			{
				id: "B",
				text: `Acceleration`
			},
			{
				id: "C",
				text: `Speed`
			},
			{
				id: "D",
				text: `Displacement`
			}
		],
		correct: "C",
		explanation: [{
			title: `Speed constant`,
			content: `Direction of velocity changes, so velocity and centripetal acceleration change direction.`
		}],
		concepts: ["UCM"]
	},
	{
		id: "MAT10-QUA-FOR-M-0001",
		class: 10,
		subject: "Mathematics",
		chapterId: "chapter-04-quadratic-equations",
		topicId: "topic-04-quadratic-formula",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The roots of x² − 5x + 6 = 0 are:`,
		latex: `x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `1 and 6`
			},
			{
				id: "B",
				text: `2 and 3`
			},
			{
				id: "C",
				text: `−2 and −3`
			},
			{
				id: "D",
				text: `5 and 6`
			}
		],
		correct: "B",
		explanation: [{
			title: `Factor`,
			content: `(x−2)(x−3)=0.`
		}, {
			title: `Formula`,
			content: `x = [5 ± √(25−24)]/2 = (5±1)/2 → 3, 2.`
		}],
		concepts: ["quadratic formula"]
	},
	{
		id: "MAT10-QUA-NAT-M-0002",
		class: 10,
		subject: "Mathematics",
		chapterId: "chapter-04-quadratic-equations",
		topicId: "topic-05-nature-of-roots",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `If the discriminant of a quadratic is zero, the roots are:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `real and distinct`
			},
			{
				id: "B",
				text: `real and equal`
			},
			{
				id: "C",
				text: `not real`
			},
			{
				id: "D",
				text: `imaginary and equal`
			}
		],
		correct: "B",
		explanation: [{
			title: `D = b² − 4ac = 0`,
			content: `Repeated real root x = −b/2a.`
		}],
		concepts: ["discriminant"]
	},
	{
		id: "MAT10-QUA-NAT-H-0003",
		class: 10,
		subject: "Mathematics",
		chapterId: "chapter-04-quadratic-equations",
		topicId: "topic-05-nature-of-roots",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `For what value of k does kx² − 6x + 1 = 0 have equal roots?`,
		latex: `b^2-4ac=0`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `9`
			},
			{
				id: "B",
				text: `3`
			},
			{
				id: "C",
				text: `1`
			},
			{
				id: "D",
				text: `6`
			}
		],
		correct: "A",
		explanation: [{
			title: `D = 36 − 4k(1) = 0`,
			content: `k = 9.`
		}],
		concepts: ["discriminant"]
	},
	{
		id: "MAT10-QUA-WOR-H-0004",
		class: 10,
		subject: "Mathematics",
		chapterId: "chapter-04-quadratic-equations",
		topicId: "topic-06-word-problems",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The sum of a number and its reciprocal is 13/6. The number is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `3/2`
			},
			{
				id: "B",
				text: `2/3 or 3/2`
			},
			{
				id: "C",
				text: `6`
			},
			{
				id: "D",
				text: `13`
			}
		],
		correct: "B",
		explanation: [{
			title: `x + 1/x = 13/6`,
			content: `6x² − 13x + 6 = 0 → (3x−2)(2x−3)=0.`
		}, {
			title: `x`,
			content: ` `,
			latex: `=`
		}],
		concepts: ["word problems"]
	},
	{
		id: "MAT12-MAT-TYP-M-0001",
		class: 12,
		subject: "Mathematics",
		chapterId: "chapter-03-matrices",
		topicId: "topic-01-types-of-matrices",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A square matrix A with A = Aᵀ is called:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `skew-symmetric`
			},
			{
				id: "B",
				text: `symmetric`
			},
			{
				id: "C",
				text: `orthogonal`
			},
			{
				id: "D",
				text: `singular`
			}
		],
		correct: "B",
		explanation: [{
			title: `Definition`,
			content: `A = Aᵀ ⇒ symmetric. A = −Aᵀ ⇒ skew-symmetric.`
		}],
		concepts: ["symmetric matrix"]
	},
	{
		id: "MAT12-MAT-OPE-H-0002",
		class: 12,
		subject: "Mathematics",
		chapterId: "chapter-03-matrices",
		topicId: "topic-02-operations",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `If A is 2×3 and B is 3×2, then AB is of order:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `2×2`
			},
			{
				id: "B",
				text: `3×3`
			},
			{
				id: "C",
				text: `2×3`
			},
			{
				id: "D",
				text: `not defined`
			}
		],
		correct: "A",
		explanation: [{
			title: `Inner dimensions match`,
			content: `2×3 times 3×2 gives 2×2. BA would be 3×3.`
		}],
		concepts: ["matrix multiplication"]
	},
	{
		id: "CHE12-SOL-CON-M-0001",
		class: 12,
		subject: "Chemistry",
		chapterId: "chapter-01-solutions",
		topicId: "topic-01-concentration-units",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Molality is defined as:`,
		latex: `m=\\frac{n_{\\mathrm{solute}}}{w_{\\mathrm{solvent}}(\\mathrm{kg})}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `moles of solute per litre of solution`
			},
			{
				id: "B",
				text: `moles of solute per kg of solvent`
			},
			{
				id: "C",
				text: `moles of solute per kg of solution`
			},
			{
				id: "D",
				text: `grams of solute per litre`
			}
		],
		correct: "B",
		explanation: [{
			title: `m = n_solute / mass_solvent(kg)`,
			content: `Independent of temperature, unlike molarity.`
		}],
		concepts: ["molality"]
	},
	{
		id: "CHE12-SOL-RAO-H-0002",
		class: 12,
		subject: "Chemistry",
		chapterId: "chapter-01-solutions",
		topicId: "topic-02-raoult-s-law",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `For an ideal solution, Raoult's law states that p_A =`,
		latex: `p_A=p_A^\\circ x_A`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `p_A° x_B`
			},
			{
				id: "B",
				text: `p_A° x_A`
			},
			{
				id: "C",
				text: `p_B° x_A`
			},
			{
				id: "D",
				text: `K_H x_A`
			}
		],
		correct: "B",
		explanation: [{
			title: `Partial pressure`,
			content: `p_A = p_A° · x_A for an ideal solution.`
		}],
		concepts: ["Raoult's law"]
	},
	{
		id: "CHE12-SOL-COL-M-0003",
		class: 12,
		subject: "Chemistry",
		chapterId: "chapter-01-solutions",
		topicId: "topic-03-colligative-properties",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Which is a colligative property?`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `viscosity`
			},
			{
				id: "B",
				text: `elevation of boiling point`
			},
			{
				id: "C",
				text: `colour`
			},
			{
				id: "D",
				text: `density`
			}
		],
		correct: "B",
		explanation: [{
			title: `Depends on number of particles`,
			content: `ΔTb = Kb · m.`
		}],
		concepts: ["colligative properties"]
	},
	{
		id: "CHE11-BAS-MOL-M-0001",
		class: 11,
		subject: "Chemistry",
		chapterId: "chapter-01-basic-concepts-chemistry",
		topicId: "topic-01-mole-concept",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Number of atoms in 0.5 mol of oxygen gas (O₂) is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `3.011 × 10²³`
			},
			{
				id: "B",
				text: `6.022 × 10²³`
			},
			{
				id: "C",
				text: `1.505 × 10²³`
			},
			{
				id: "D",
				text: `12.044 × 10²³`
			}
		],
		correct: "B",
		explanation: [{
			title: `0.5 mol O₂ = 0.5 × 2 × NA atoms`,
			content: `= 6.022 × 10²³ atoms.`
		}],
		concepts: ["mole concept"]
	},
	{
		id: "CHE11-BAS-STO-H-0002",
		class: 11,
		subject: "Chemistry",
		chapterId: "chapter-01-basic-concepts-chemistry",
		topicId: "topic-02-stoichiometry",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Mass of 0.1 mol of CaCO₃ (M = 100 g mol⁻¹) is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `10 g`
			},
			{
				id: "B",
				text: `100 g`
			},
			{
				id: "C",
				text: `1 g`
			},
			{
				id: "D",
				text: `0.1 g`
			}
		],
		correct: "A",
		explanation: [{
			title: `m = nM`,
			content: `0.1 × 100 = 10 g.`
		}],
		concepts: ["molar mass"]
	},
	{
		id: "CHE9-MIX-HOM-M-0001",
		class: 9,
		subject: "Chemistry",
		chapterId: "chapter-01-exploring-mixtures",
		topicId: "topic-01-homogeneous-and-heterogeneous-mixtures",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Air is an example of a:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `compound`
			},
			{
				id: "B",
				text: `homogeneous mixture`
			},
			{
				id: "C",
				text: `heterogeneous mixture`
			},
			{
				id: "D",
				text: `element`
			}
		],
		correct: "B",
		explanation: [{
			title: `Uniform composition`,
			content: `Gases mix completely; air is a homogeneous mixture (solution of gases).`
		}],
		concepts: ["mixtures"]
	},
	{
		id: "CHE9-MIX-COL-M-0002",
		class: 9,
		subject: "Chemistry",
		chapterId: "chapter-01-exploring-mixtures",
		topicId: "topic-02-solutions-suspensions-and-colloids",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The Tyndall effect is shown by:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `true solutions`
			},
			{
				id: "B",
				text: `colloids`
			},
			{
				id: "C",
				text: `pure compounds`
			},
			{
				id: "D",
				text: `elements`
			}
		],
		correct: "B",
		explanation: [{
			title: `Scattering`,
			content: `Colloidal particles scatter light; true solutions do not.`
		}],
		concepts: ["colloids", "Tyndall effect"]
	},
	{
		id: "CHE10-ACI-PH-M-0001",
		class: 10,
		subject: "Chemistry",
		chapterId: "chapter-02-acids-bases-salts",
		topicId: "topic-02-ph-scale-and-indicators",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `A solution with pH 3 is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `strongly basic`
			},
			{
				id: "B",
				text: `neutral`
			},
			{
				id: "C",
				text: `acidic`
			},
			{
				id: "D",
				text: `weakly basic`
			}
		],
		correct: "C",
		explanation: [{
			title: `pH < 7 acidic`,
			content: `pH 3 is strongly acidic compared with pH 6.`
		}],
		concepts: ["pH scale"]
	},
	{
		id: "CHE10-ACI-NEU-M-0002",
		class: 10,
		subject: "Chemistry",
		chapterId: "chapter-02-acids-bases-salts",
		topicId: "topic-03-neutralisation",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The salt formed when HCl reacts with NaOH is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `Na₂CO₃`
			},
			{
				id: "B",
				text: `NaCl`
			},
			{
				id: "C",
				text: `NaHCO₃`
			},
			{
				id: "D",
				text: `NaNO₃`
			}
		],
		correct: "B",
		explanation: [{
			title: `Neutralisation`,
			content: `HCl + NaOH → NaCl + H₂O.`
		}],
		concepts: ["neutralisation"]
	},
	{
		id: "CHE12-KIN-ORD-M-0001",
		class: 12,
		subject: "Chemistry",
		chapterId: "chapter-03-chemical-kinetics",
		topicId: "topic-02-order-and-molecularity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `For a first-order reaction, the unit of the rate constant is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `mol L⁻¹ s⁻¹`
			},
			{
				id: "B",
				text: `s⁻¹`
			},
			{
				id: "C",
				text: `L mol⁻¹ s⁻¹`
			},
			{
				id: "D",
				text: `mol⁻¹ s⁻¹`
			}
		],
		correct: "B",
		explanation: [{
			title: `Rate = k [A]`,
			content: `k has units of time⁻¹.`
		}],
		concepts: ["order of reaction"]
	},
	{
		id: "CHE12-KIN-HAL-H-0002",
		class: 12,
		subject: "Chemistry",
		chapterId: "chapter-03-chemical-kinetics",
		topicId: "topic-03-first-order-reactions",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Half-life of a first-order reaction with k = 0.693 min⁻¹ is:`,
		latex: `t_{1/2}=\\frac{0.693}{k}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `1 min`
			},
			{
				id: "B",
				text: `0.693 min`
			},
			{
				id: "C",
				text: `2 min`
			},
			{
				id: "D",
				text: `0.5 min`
			}
		],
		correct: "A",
		explanation: [{
			title: `t½ = 0.693 / k`,
			content: `0.693 / 0.693 = 1 min.`
		}],
		concepts: ["half-life"]
	},
	{
		id: "PHY11-GRAV-UNI-M-0006",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-02-universal-law-of-gravitation",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Two masses 2 kg and 8 kg are 6 m apart. The gravitational field is zero at a point from the 2 kg mass at a distance of:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `2 m`
			},
			{
				id: "B",
				text: `3 m`
			},
			{
				id: "C",
				text: `4 m`
			},
			{
				id: "D",
				text: `1.5 m`
			}
		],
		correct: "A",
		explanation: [{
			title: `Gm1/x² = Gm2/(6−x)²`,
			content: `√m1 / x = √m2 / (6−x).`
		}, {
			title: `√2 / x = √8 / (6−x)`,
			content: `1/x = 2/(6−x) ⇒ 6−x = 2x ⇒ x = 2 m.`
		}],
		concepts: ["gravitational field"]
	},
	{
		id: "PHY11-GRAV-SAT-M-0006",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-07-earth-satellites",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The time period of a satellite close to Earth's surface is approximately:`,
		latex: `T=2\\pi\\sqrt{R/g}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `84 minutes`
			},
			{
				id: "B",
				text: `24 hours`
			},
			{
				id: "C",
				text: `27 days`
			},
			{
				id: "D",
				text: `8 hours`
			}
		],
		correct: "A",
		explanation: [{
			title: `T = 2π √(R³/GM) = 2π √(R/g)`,
			content: `√(6.4e6 / 9.8) ≈ 808 s, × 2π ≈ 84 min.`
		}],
		concepts: ["near-Earth satellite"]
	},
	{
		id: "PHY11-GRAV-ACC-M-0006",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-04-acceleration-due-to-gravity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The relation between g and G is:`,
		latex: `g=\\frac{GM}{R^2}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `g = GM/R`
			},
			{
				id: "B",
				text: `g = GM/R²`
			},
			{
				id: "C",
				text: `g = GR²/M`
			},
			{
				id: "D",
				text: `g = G/R²`
			}
		],
		correct: "B",
		explanation: [{
			title: `mg = GMm/R²`,
			content: `g = GM/R².`
		}],
		concepts: ["g and G"]
	},
	{
		id: "PHY11-GRAV-POT-M-0006",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-05-gravitational-potential-energy",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The SI unit of gravitational potential is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `J`
			},
			{
				id: "B",
				text: `J/kg`
			},
			{
				id: "C",
				text: `N/kg`
			},
			{
				id: "D",
				text: `J/m`
			}
		],
		correct: "B",
		explanation: [{
			title: `V = U/m`,
			content: `joule per kilogram. Field is N/kg or m/s².`
		}],
		concepts: ["gravitational potential"]
	},
	{
		id: "PHY11-GRAV-KEP-M-0006",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-01-kepler-s-laws",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Areal velocity of a planet is:`,
		latex: `\\frac{dA}{dt}=\\frac{L}{2m}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `L/2m`
			},
			{
				id: "B",
				text: `L/m`
			},
			{
				id: "C",
				text: `2L/m`
			},
			{
				id: "D",
				text: `L/4m`
			}
		],
		correct: "A",
		explanation: [{
			title: `dA/dt = r² θ̇ / 2 = L/2m`,
			content: `Kepler II.`
		}],
		concepts: ["areal velocity"]
	},
	{
		id: "PHY11-GRAV-ESC-M-0007",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-06-escape-velocity",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `There is no atmosphere on the Moon because:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `it is too far from the Sun`
			},
			{
				id: "B",
				text: `escape velocity is small`
			},
			{
				id: "C",
				text: `it has no water`
			},
			{
				id: "D",
				text: `g is large`
			}
		],
		correct: "B",
		explanation: [{
			title: `Low mass, small R still yields small v_e`,
			content: `Thermal speeds of gases exceed v_e, so atmosphere leaked away.`
		}],
		concepts: ["escape velocity", "Moon"]
	},
	{
		id: "PHY11-GRAV-ENE-M-0006",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-08-energy-of-an-orbiting-satellite",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `As a satellite is lifted to a higher circular orbit, its potential energy:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `decreases (becomes more negative)`
			},
			{
				id: "B",
				text: `increases (becomes less negative)`
			},
			{
				id: "C",
				text: `remains the same`
			},
			{
				id: "D",
				text: `becomes zero`
			}
		],
		correct: "B",
		explanation: [{
			title: `U = −GMm/r`,
			content: `Larger r → U less negative, so PE increases.`
		}, {
			title: `Total E also increases`,
			content: `though still negative.`
		}],
		concepts: ["potential energy"]
	},
	{
		id: "PHY11-GRAV-CON-M-0005",
		class: 11,
		subject: "Physics",
		chapterId: "chapter-07-gravitation",
		topicId: "topic-03-gravitational-constant",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `G was first measured accurately by:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `Newton`
			},
			{
				id: "B",
				text: `Cavendish`
			},
			{
				id: "C",
				text: `Kepler`
			},
			{
				id: "D",
				text: `Galileo`
			}
		],
		correct: "B",
		explanation: [{
			title: `Cavendish torsion balance`,
			content: `Newton gave the law; Cavendish found G and 'weighed the Earth'.`
		}],
		concepts: ["Cavendish"]
	},
	{
		id: "PHY12-CHG-COU-M-0001",
		class: 12,
		subject: "Physics",
		chapterId: "chapter-01-electric-charges-fields",
		topicId: "topic-01-coulomb-s-law",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Coulomb's law is analogous to:`,
		latex: `F=\\frac{1}{4\\pi\\varepsilon_0}\\frac{q_1q_2}{r^2}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `Ohm's law`
			},
			{
				id: "B",
				text: `Newton's law of gravitation`
			},
			{
				id: "C",
				text: `Faraday's law`
			},
			{
				id: "D",
				text: `Ampere's law`
			}
		],
		correct: "B",
		explanation: [{
			title: `Both inverse square, central`,
			content: `Electrostatic can be repulsive; gravity cannot.`
		}],
		concepts: ["Coulomb's law"]
	},
	{
		id: "PHY12-CHG-GAU-H-0002",
		class: 12,
		subject: "Physics",
		chapterId: "chapter-01-electric-charges-fields",
		topicId: "topic-04-gauss-s-law",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Electric field due to an infinite plane sheet of charge density σ is:`,
		latex: `E=\\frac{\\sigma}{2\\varepsilon_0}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `σ/ε₀`
			},
			{
				id: "B",
				text: `σ/(2ε₀)`
			},
			{
				id: "C",
				text: `σ/(4ε₀)`
			},
			{
				id: "D",
				text: `2σ/ε₀`
			}
		],
		correct: "B",
		explanation: [{
			title: `Gauss pillbox`,
			content: `2EA = σA/ε₀ ⇒ E = σ/(2ε₀), independent of distance.`
		}],
		concepts: ["Gauss's law"]
	},
	{
		id: "PHY12-CHG-DIP-M-0003",
		class: 12,
		subject: "Physics",
		chapterId: "chapter-01-electric-charges-fields",
		topicId: "topic-03-electric-dipole",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `Torque on a dipole p in a uniform electric field E is:`,
		latex: `\\vec{\\tau}=\\vec{p}\\times\\vec{E}`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `p · E`
			},
			{
				id: "B",
				text: `p × E`
			},
			{
				id: "C",
				text: `zero always`
			},
			{
				id: "D",
				text: `p E`
			}
		],
		correct: "B",
		explanation: [{
			title: `τ = p E sinθ, direction p × E`,
			content: `Net force in a uniform field is zero.`
		}],
		concepts: ["electric dipole"]
	},
	{
		id: "MAT10-TRI-SIM-M-0001",
		class: 10,
		subject: "Mathematics",
		chapterId: "chapter-06-triangles",
		topicId: "topic-02-similarity-of-triangles",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `If two triangles are similar, their corresponding:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `sides are equal`
			},
			{
				id: "B",
				text: `angles are equal and sides are proportional`
			},
			{
				id: "C",
				text: `areas are equal`
			},
			{
				id: "D",
				text: `altitudes are equal`
			}
		],
		correct: "B",
		explanation: [{
			title: `AAA / SAS / SSS similarity`,
			content: `Angles equal, sides in the same ratio.`
		}],
		concepts: ["similar triangles"]
	},
	{
		id: "MAT10-TRI-PYT-M-0002",
		class: 10,
		subject: "Mathematics",
		chapterId: "chapter-06-triangles",
		topicId: "topic-05-pythagoras-theorem",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `In a right triangle with legs 6 and 8, the hypotenuse is:`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `10`
			},
			{
				id: "B",
				text: `14`
			},
			{
				id: "C",
				text: `7`
			},
			{
				id: "D",
				text: `48`
			}
		],
		correct: "A",
		explanation: [{
			title: `6²+8²=36+64=100`,
			content: `hypotenuse = 10. 3-4-5 scaled by 2.`
		}],
		concepts: ["Pythagoras"]
	},
	{
		id: "MAT11-LIM-DEF-M-0001",
		class: 11,
		subject: "Mathematics",
		chapterId: "chapter-12-limits-derivatives",
		topicId: "topic-01-limits",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `lim (x→0) (sin x)/x equals:`,
		latex: `\\lim_{x\\to 0}\\frac{\\sin x}{x}=1`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `0`
			},
			{
				id: "B",
				text: `1`
			},
			{
				id: "C",
				text: `∞`
			},
			{
				id: "D",
				text: `does not exist`
			}
		],
		correct: "B",
		explanation: [{
			title: `Standard limit`,
			content: `The squeeze theorem gives 1. x in radians.`
		}],
		concepts: ["standard limits"]
	},
	{
		id: "MAT11-LIM-DER-H-0002",
		class: 11,
		subject: "Mathematics",
		chapterId: "chapter-12-limits-derivatives",
		topicId: "topic-02-derivatives",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `The derivative of x² at x = 3 is:`,
		latex: `\\frac{d}{dx}x^2=2x`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `3`
			},
			{
				id: "B",
				text: `6`
			},
			{
				id: "C",
				text: `9`
			},
			{
				id: "D",
				text: `2`
			}
		],
		correct: "B",
		explanation: [{
			title: `d/dx (x²) = 2x`,
			content: `At 3, value 6.`
		}],
		concepts: ["derivatives"]
	},
	{
		id: "MAT12-INT-SUB-M-0001",
		class: 12,
		subject: "Mathematics",
		chapterId: "chapter-07-integrals",
		topicId: "topic-01-substitution",
		difficulty: "medium",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `∫ 2x dx equals:`,
		latex: `\\int 2x\\,dx=x^2+C`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `x² + C`
			},
			{
				id: "B",
				text: `2x² + C`
			},
			{
				id: "C",
				text: `x + C`
			},
			{
				id: "D",
				text: `2 + C`
			}
		],
		correct: "A",
		explanation: [{
			title: `Power rule`,
			content: `∫ x^n dx = x^{n+1}/(n+1). ∫ 2x = x² + C.`
		}],
		concepts: ["indefinite integral"]
	},
	{
		id: "MAT12-INT-DEF-H-0002",
		class: 12,
		subject: "Mathematics",
		chapterId: "chapter-07-integrals",
		topicId: "topic-04-definite-integrals",
		difficulty: "hard",
		type: "MCQ",
		marksCorrect: 4,
		marksWrong: -1,
		questionText: `∫₀¹ 2x dx equals:`,
		latex: `\\int_0^1 2x\\,dx=1`,
		isPyq: false,
		options: [
			{
				id: "A",
				text: `1`
			},
			{
				id: "B",
				text: `2`
			},
			{
				id: "C",
				text: `0`
			},
			{
				id: "D",
				text: `1/2`
			}
		],
		correct: "A",
		explanation: [{
			title: `[x²]₀¹ = 1 − 0 = 1`,
			content: `Fundamental theorem of calculus.`
		}],
		concepts: ["definite integral"]
	}
];
function questionsFor(classId, subject, chapterId) {
	return QUESTIONS.filter((q) => q.class === classId && q.subject === subject && q.chapterId === chapterId);
}
function questionById(id) {
	return QUESTIONS.find((q) => q.id === id);
}
function countForChapter(classId, subject, chapterId) {
	return questionsFor(classId, subject, chapterId).length;
}
function statusOf(state) {
	return state?.status ?? "NEW";
}
function updateStatus(prev, selected, correct, questionId, timeTaken) {
	const attempts = [...prev?.attempts ?? [], {
		questionId,
		selected,
		correct,
		at: Date.now(),
		timeTaken
	}];
	let consecutiveCorrect = prev?.consecutiveCorrect ?? 0;
	let status;
	if (!correct) {
		consecutiveCorrect = 0;
		status = "WRONG";
	} else {
		consecutiveCorrect += 1;
		status = consecutiveCorrect >= 2 ? "MASTERED" : "CORRECT";
	}
	return {
		status,
		attempts,
		consecutiveCorrect
	};
}
function poolFor(params) {
	const { classId, subject, chapterId, topicId, mode, difficulty, states } = params;
	let list = questionsFor(classId, subject, chapterId);
	if (topicId) list = list.filter((q) => q.topicId === topicId);
	if (mode === "pyq") list = list.filter((q) => q.isPyq);
	if (mode === "wrong") list = list.filter((q) => statusOf(states[q.id]) === "WRONG");
	else if (mode === "mastered") list = list.filter((q) => statusOf(states[q.id]) === "MASTERED");
	else if (mode === "topic" || mode === "practice" || mode === "chapter-mixed") {
		if (difficulty !== "mixed") list = list.filter((q) => q.difficulty === difficulty);
		list = list.filter((q) => statusOf(states[q.id]) !== "MASTERED");
		if (mode === "chapter-mixed") {}
	}
	return list;
}
function selectQuestions(pool, states, count, mode) {
	const tagged = pool.map((q) => ({
		q,
		s: statusOf(states[q.id])
	}));
	let eligible;
	if (mode === "wrong" || mode === "mastered" || mode === "pyq") eligible = tagged.map((t) => t.q);
	else {
		const neu = tagged.filter((t) => t.s === "NEW").map((t) => t.q);
		const wrong = tagged.filter((t) => t.s === "WRONG").map((t) => t.q);
		const corr = tagged.filter((t) => t.s === "CORRECT").map((t) => t.q);
		eligible = [
			...shuffle(neu),
			...shuffle(wrong),
			...shuffle(corr)
		];
	}
	const selected = shuffle(eligible).slice(0, count);
	return {
		selected,
		exhausted: selected.length === 0,
		remaining: eligible.length
	};
}
function shuffle(arr) {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function chapterStats(classId, subject, chapterId, states) {
	const qs = questionsFor(classId, subject, chapterId);
	const total = qs.length;
	let neu = 0, wrong = 0, mastered = 0, attempted = 0;
	for (const q of qs) {
		const s = statusOf(states[q.id]);
		if (s === "NEW") neu += 1;
		else {
			attempted += 1;
			if (s === "WRONG") wrong += 1;
			if (s === "MASTERED") mastered += 1;
		}
	}
	return {
		total,
		new: neu,
		wrong,
		mastered,
		attempted,
		remaining: neu + wrong
	};
}
function overallStats(states, tests) {
	const solved = Object.keys(states).length;
	let correct = 0;
	let wrong = 0;
	for (const st of Object.values(states)) {
		const last = st.attempts.at(-1);
		if (!last) continue;
		if (last.correct) correct += 1;
		else wrong += 1;
	}
	return {
		solved,
		correct,
		wrong,
		tests: tests.length,
		accuracy: solved ? Math.round(correct / solved * 100) : 0
	};
}
function lookupCorrect(id) {
	return QUESTIONS.find((q) => q.id === id)?.correct ?? null;
}
var useAppStore = create()(persist((set, get) => ({
	profile: {
		name: "Student",
		classId: 11
	},
	setProfile: (p) => set((s) => ({ profile: {
		...s.profile,
		...p
	} })),
	states: {},
	tests: [],
	bookmarks: [],
	active: null,
	startTest: (session) => set({ active: session }),
	lockAnswer: (questionId, selected, timeTaken) => {
		const active = get().active;
		if (!active || active.locked[questionId]) return;
		const isCorrect = selected != null && selected === lookupCorrect(questionId);
		set((s) => {
			if (!s.active) return s;
			return {
				active: {
					...s.active,
					answers: {
						...s.active.answers,
						[questionId]: selected
					},
					locked: {
						...s.active.locked,
						[questionId]: true
					},
					timePerQuestion: {
						...s.active.timePerQuestion,
						[questionId]: timeTaken
					}
				},
				states: {
					...s.states,
					[questionId]: updateStatus(s.states[questionId], selected, isCorrect, questionId, timeTaken)
				}
			};
		});
	},
	finishTest: () => {
		const active = get().active;
		if (!active) return null;
		let correct = 0, wrong = 0, skipped = 0, score = 0, maxScore = 0;
		for (const id of active.questionIds) {
			maxScore += 4;
			const a = active.answers[id];
			if (a == null && !active.locked[id]) skipped += 1;
			else if (a === lookupCorrect(id)) {
				correct += 1;
				score += 4;
			} else {
				wrong += 1;
				score -= 1;
			}
		}
		const completed = {
			id: active.id,
			class: active.class,
			subject: active.subject,
			chapterId: active.chapterId,
			topicId: active.topicId,
			mode: active.mode,
			difficulty: active.difficulty,
			questionIds: active.questionIds,
			correct,
			wrong,
			skipped,
			score,
			maxScore,
			startedAt: active.startedAt,
			completedAt: Date.now()
		};
		set((s) => ({
			active: null,
			tests: [completed, ...s.tests].slice(0, 40)
		}));
		return completed;
	},
	toggleBookmark: (id) => set((s) => ({ bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((x) => x !== id) : [...s.bookmarks, id] })),
	resetProgress: () => set({
		states: {},
		tests: [],
		bookmarks: [],
		active: null
	})
}), {
	name: "orbit-cbse-v1",
	skipHydration: true
}));
function PersistHydrate({ children }) {
	(0, import_react.useEffect)(() => {
		useAppStore.persist.rehydrate();
	}, []);
	return children;
}
var styles_default = "/assets/styles-BXYX7IVy.css";
var APP_NAME = "Orbit";
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0e1524"
			},
			{
				name: "description",
				content: "CBSE practice with a real question lifecycle — new, wrong, mastered."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Outfit:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersistHydrate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$8 = () => import("./routes-DnDOUNub.mjs");
var Route$8 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./practice-CfGbRkQk.mjs");
var Route$7 = createFileRoute("/practice")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./progress-CfsYt46z.mjs");
var Route$6 = createFileRoute("/progress")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./class._classId-Cc-qruNC.mjs");
var Route$5 = createFileRoute("/class/$classId")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./result._testId-D-IN8hYI.mjs");
var Route$4 = createFileRoute("/result/$testId")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./class._classId.index-DXwecFk9.mjs");
var Route$3 = createFileRoute("/class/$classId/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./class._classId._subject-R09wpCe8.mjs");
var Route$2 = createFileRoute("/class/$classId/$subject")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./class._classId._subject.index-YB9YiByJ.mjs");
var Route$1 = createFileRoute("/class/$classId/$subject/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./class._classId._subject._chapter-oQEvWlP1.mjs");
var Route = createFileRoute("/class/$classId/$subject/$chapter")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var PracticeRoute = Route$7.update({
	id: "/practice",
	path: "/practice",
	getParentRoute: () => Route$9
});
var ProgressRoute = Route$6.update({
	id: "/progress",
	path: "/progress",
	getParentRoute: () => Route$9
});
var ClassClassIdRoute = Route$5.update({
	id: "/class/$classId",
	path: "/class/$classId",
	getParentRoute: () => Route$9
});
var ResultTestIdRoute = Route$4.update({
	id: "/result/$testId",
	path: "/result/$testId",
	getParentRoute: () => Route$9
});
var ClassClassIdIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => ClassClassIdRoute
});
var ClassClassIdSubjectRoute = Route$2.update({
	id: "/$subject",
	path: "/$subject",
	getParentRoute: () => ClassClassIdRoute
});
var ClassClassIdSubjectIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => ClassClassIdSubjectRoute
});
var ClassClassIdSubjectRouteChildren = {
	ClassClassIdSubjectChapterRoute: Route.update({
		id: "/$chapter",
		path: "/$chapter",
		getParentRoute: () => ClassClassIdSubjectRoute
	}),
	ClassClassIdSubjectIndexRoute
};
var ClassClassIdRouteChildren = {
	ClassClassIdSubjectRoute: ClassClassIdSubjectRoute._addFileChildren(ClassClassIdSubjectRouteChildren),
	ClassClassIdIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	PracticeRoute,
	ProgressRoute,
	ClassClassIdRoute: ClassClassIdRoute._addFileChildren(ClassClassIdRouteChildren),
	ResultTestIdRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$4 as a, overallStats as c, QUESTIONS as d, countForChapter as f, Route$3 as i, poolFor as l, questionsFor as m, Route as n, useAppStore as o, questionById as p, Route$1 as r, chapterStats as s, router_exports as t, selectQuestions as u };
