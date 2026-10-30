"""
Makes the site's own small Noto Sans JP files (src/fonts/noto-sans-jp-{400,500}.woff2): only
the characters the site's text uses, plus all kana, Japanese punctuation and full-width
letters, so one small file replaces the ~270 pieces Google Fonts serves for Japanese.
Characters outside the file (e.g. a rare kanji in a new Instagram post) show in the device's
own Japanese font.

Run again after changing Japanese text in src/ (needs fonttools + brotli):
    python scripts/make-jp-font.py <path to NotoSansJP[wght].ttf>
The source font is the official variable Noto Sans JP from github.com/google/fonts (OFL).
"""
import os
import pathlib
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "fonts"
WEIGHTS = [400, 500]

# Every character in the site's source text.
chars = set()
for path in (ROOT / "src").rglob("*"):
    if path.suffix in {".ts", ".tsx", ".json", ".css"} and "fonts" not in path.parts:
        chars.update(path.read_text(encoding="utf-8", errors="ignore"))
# Fixed sets: printable ASCII, Japanese punctuation, hiragana, katakana, full-width forms.
for lo, hi in [(0x20, 0x7E), (0x3000, 0x303F), (0x3040, 0x309F), (0x30A0, 0x30FF), (0xFF00, 0xFFEF)]:
    chars.update(chr(c) for c in range(lo, hi + 1))
chars.update("・ー〜…‥「」『』【】〈〉《》→←↑↓↗※〒℃°′″")
text = "".join(sorted(c for c in chars if c.isprintable()))

OUT.mkdir(parents=True, exist_ok=True)
for weight in WEIGHTS:
    font = instancer.instantiateVariableFont(TTFont(sys.argv[1]), {"wght": weight})
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["palt", "kern", "liga", "vert", "vkrn", "vpal"]
    options.name_IDs = ["*"]
    sub = subset.Subsetter(options)
    sub.populate(text=text)
    sub.subset(font)
    target = OUT / f"noto-sans-jp-{weight}.woff2"
    font.flavor = "woff2"
    font.save(target)
    print(f"{target.name}: {os.path.getsize(target) // 1024} KB")
print(f"{len(text)} characters")
