#!/usr/bin/env bash
# Render thesis TikZ figures to web-ready SVG.
#
# Each figure is compiled standalone, so the thesis-only macros (acronyms,
# cleveref cross-references, siunitx numbers) have to be stubbed. Acronyms
# resolve to their short form, which is what a figure label wants anyway.
#
#   usage: tools/tikz2svg.sh <figures-dir> <output-dir>

set -euo pipefail

SRC_DIR="${1:?usage: tikz2svg.sh <figures-dir> <output-dir>}"
OUT_DIR="${2:?usage: tikz2svg.sh <figures-dir> <output-dir>}"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

mkdir -p "$OUT_DIR"

ok=0; failed=0; failed_names=()

for src in "$SRC_DIR"/*.tex; do
  [ -e "$src" ] || continue
  name="$(basename "$src" .tex)"

  # \usetikzlibrary must sit in the preamble; everything else can stay inline.
  grep -hoE '\\usetikzlibrary\{[^}]*\}' "$src" > "$WORK/libs.tex" || true

  # \resizebox is neutralised in the preamble rather than stripped here, so
  # the closing brace is consumed by LaTeX whatever line it sits on.
  sed -e 's/^\\usetikzlibrary{[^}]*}$//' "$src" > "$WORK/body.tex"

  cat > "$WORK/fig.tex" <<EOF
\\documentclass[border=5pt]{standalone}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage{amsmath,amssymb,bm}
\\usepackage{tikz}
\\usetikzlibrary{arrows.meta,positioning,calc,shapes.geometric,shapes.misc,fit,backgrounds,decorations.pathreplacing,patterns,chains}
\\usepackage{xcolor}
\\input{libs.tex}
% --- thesis-only macros, stubbed for standalone rendering ---
\\providecommand{\\acs}[1]{#1}
\\providecommand{\\acl}[1]{#1}
\\providecommand{\\ac}[1]{#1}
\\providecommand{\\num}[1]{#1}
\\providecommand{\\Cref}[1]{ref.}
\\providecommand{\\cref}[1]{ref.}
% \textwidth is meaningless outside the thesis page geometry; render at natural size.
\\renewcommand{\\resizebox}[3]{#3}
\\begin{document}
\\input{body.tex}
\\end{document}
EOF

  if (cd "$WORK" && latex -interaction=nonstopmode -halt-on-error fig.tex >compile.log 2>&1); then
    if (cd "$WORK" && dvisvgm --no-fonts --exact --page=1 --output="$name.svg" fig.dvi >/dev/null 2>&1) \
       && [ -s "$WORK/$name.svg" ]; then
      # drop the XML declaration and dvisvgm banner
      tail -n +3 "$WORK/$name.svg" > "$OUT_DIR/$name.svg"
      printf '  ok    %s\n' "$name"
      ok=$((ok+1))
      continue
    fi
  fi

  printf '  FAIL  %s\n' "$name"
  cp "$WORK/compile.log" "$OUT_DIR/$name.log" 2>/dev/null || true
  failed=$((failed+1)); failed_names+=("$name")
done

echo
echo "converted $ok, failed $failed"
[ "$failed" -gt 0 ] && printf 'failed: %s\n' "${failed_names[*]}"
exit 0
