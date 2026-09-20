import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-Crn9Pt0d.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40 min-h-11 px-4", {
	variants: {
		variant: {
			primary: "bg-ink text-paper hover:bg-ink-soft",
			copper: "bg-copper text-ink hover:bg-copper-2",
			outline: "border border-line bg-paper text-ink hover:bg-paper-2",
			ghost: "text-ink hover:bg-paper-2",
			danger: "bg-danger text-paper hover:opacity-90",
			sage: "bg-sage text-paper hover:bg-ok"
		},
		size: {
			md: "h-11",
			sm: "h-9 min-h-9 px-3 text-xs",
			lg: "h-12 px-5"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { cn as n, Button as t };
