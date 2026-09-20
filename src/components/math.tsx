import katex from "katex";
// Registers the \ce{...} command katex needs for chemistry: reaction arrows,
// equilibrium arrows, states of matter, isotopes, bonds — e.g.
//   $\\ce{2H2 + O2 -> 2H2O}$          (reaction, with a real arrow)
//   $\\ce{Fe^3+ + 3OH- -> Fe(OH)3 v}$ (charges + precipitate arrow)
//   $\\ce{^{14}_6C}$                  (isotope notation)
// Plain KaTeX math mode already covers ordinary formulas in any subject
// (fractions, integrals, subscripts/superscripts like H_2O or CO_3^{2-}) —
// mhchem is only needed for the special chemistry arrows/notation above.
import "katex/contrib/mhchem";
import { cn } from "@/lib/utils";

export function MathTex({
  tex,
  display = false,
  className,
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  let html = "";
  try {
    html = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      output: "html",
      trust: true,
      strict: "ignore",
    });
  } catch {
    html = tex;
  }
  return (
    <span
      className={cn(
        display ? "block overflow-x-auto py-1" : "inline-block max-w-full overflow-x-auto align-middle",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Renders plain text that may contain inline KaTeX segments.
 *
 * Question text, option text, and explanation content are stored as normal
 * strings. To drop a formula, fraction, integral, chemical bond, etc. into
 * the middle of a sentence, wrap it in single dollars for inline math
 * ($...$) or double dollars for a centred display block ($$...$$). Anything
 * outside the dollar signs is rendered as plain text, so this is always
 * safe to use even on strings with no math in them at all.
 *
 * Example authoring pattern in questions.ts:
 *   questionText: `A particle moves so that $v = \\frac{dx}{dt}$ stays constant.`
 *   content: `Using $$\\int_0^t a\\,dt' = v - v_0$$ we recover the first equation of motion.`
 */
export function MathText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = splitMath(text);
  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (part.type === "text") return <span key={i}>{part.value}</span>;
        return (
          <MathTex
            key={i}
            tex={part.value}
            display={part.type === "display-math"}
            className={part.type === "display-math" ? "my-1" : "mx-0.5"}
          />
        );
      })}
    </span>
  );
}

type Segment =
  | { type: "text"; value: string }
  | { type: "inline-math"; value: string }
  | { type: "display-math"; value: string };

function splitMath(input: string): Segment[] {
  if (!input || !input.includes("$")) return [{ type: "text", value: input }];
  const segments: Segment[] = [];
  // Matches $$...$$ (display) first, then $...$ (inline), non-greedy, no
  // newlines inside a single-dollar span so stray currency signs in normal
  // prose don't get swallowed.
  const re = /\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) {
    if (m.index > last) segments.push({ type: "text", value: input.slice(last, m.index) });
    if (m[1] !== undefined) segments.push({ type: "display-math", value: m[1].trim() });
    else segments.push({ type: "inline-math", value: (m[2] ?? "").trim() });
    last = re.lastIndex;
  }
  if (last < input.length) segments.push({ type: "text", value: input.slice(last) });
  return segments;
}
