"use client";

import { ReactNode, useState } from "react";
import { ShikiHighlighter } from "react-shiki";
import { useCopyToClipboard } from "react-use";
import Icon from "@/components/atoms/Icon";
import hljs from "highlight.js";

// Runs preferably in a server-like environment

interface NotionCodeProps {
  children: ReactNode;
  language?: string;
}

// Language mapping for Shiki supported languages (222 languages)
const languageMap: Record<string, string> = {
  // Common aliases to Shiki language names
  javascript: "javascript",
  js: "javascript",
  typescript: "typescript",
  ts: "typescript",
  python: "python",
  py: "python",
  shell: "bash",
  bash: "bash",
  shellscript: "bash",
  sh: "bash",
  powershell: "powershell",
  ps1: "powershell",
  csharp: "csharp",
  cs: "csharp",
  "c++": "cpp",
  cpp: "cpp",
  "c#": "csharp",
  html: "html",
  css: "css",
  scss: "scss",
  sass: "sass",
  json: "json",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml",
  markdown: "markdown",
  md: "markdown",
  sql: "sql",
  php: "php",
  ruby: "ruby",
  rb: "ruby",
  go: "go",
  rust: "rust",
  rs: "rust",
  swift: "swift",
  kotlin: "kotlin",
  kt: "kotlin",
  java: "java",
  scala: "scala",
  r: "r",
  matlab: "matlab",
  dockerfile: "dockerfile",
  docker: "dockerfile",

  // Shiki supported languages (direct mapping)
  abap: "abap",
  actionscript3: "actionscript-3",
  ada: "ada",
  angularhtml: "angular-html",
  angular: "angular-ts",
  apache: "apache",
  apex: "apex",
  apl: "apl",
  applescript: "applescript",
  asciidoc: "asciidoc",
  asm: "asm",
  astro: "astro",
  awk: "awk",
  ballerina: "ballerina",
  bat: "bat",
  batch: "bat",
  beancount: "beancount",
  berry: "berry",
  bibtex: "bibtex",
  bicep: "bicep",
  blade: "blade",
  bsl: "bsl",
  c: "c",
  cadence: "cadence",
  cairo: "cairo",
  clarity: "clarity",
  clj: "clojure",
  clojure: "clojure",
  cmake: "cmake",
  cobol: "cobol",
  codeowners: "codeowners",
  codeql: "codeql",
  coffee: "coffee",
  coffeescript: "coffeescript",
  commonlisp: "common-lisp",
  coq: "coq",
  crystal: "crystal",
  csv: "csv",
  cue: "cue",
  cypher: "cypher",
  d: "d",
  dart: "dart",
  dax: "dax",
  desktop: "desktop",
  diff: "diff",
  dotenv: "dotenv",
  dreammaker: "dream-maker",
  edge: "edge",
  elixir: "elixir",
  elm: "elm",
  emacslisp: "emacs-lisp",
  erb: "erb",
  erlang: "erlang",
  fennel: "fennel",
  fish: "fish",
  fluent: "fluent",
  fortran: "fortran-fixed-form",
  fsharp: "fsharp",
  fsl: "fsl",
  gdresource: "gdresource",
  gdscript: "gdscript",
  gdshader: "gdshader",
  genie: "genie",
  gherkin: "gherkin",
  gleam: "gleam",
  glsl: "glsl",
  gnuplot: "gnuplot",
  graphql: "graphql",
  groovy: "groovy",
  hack: "hack",
  haml: "haml",
  handlebars: "handlebars",
  haskell: "haskell",
  haxe: "haxe",
  hbs: "hbs",
  hcl: "hcl",
  hjson: "hjson",
  hlsl: "hlsl",
  hs: "haskell",
  http: "http",
  hxml: "hxml",
  hy: "hy",
  imba: "imba",
  ini: "ini",
  jade: "jade",
  jinja: "jinja",
  jison: "jison",
  jl: "julia",
  julia: "julia",
  kql: "kql",
  kts: "kts",
  kusto: "kusto",
  latex: "latex",
  lean: "lean",
  lean4: "lean4",
  less: "less",
  liquid: "liquid",
  lisp: "lisp",
  lit: "lit",
  llvm: "llvm",
  log: "log",
  logo: "logo",
  lua: "lua",
  luau: "luau",
  make: "makefile",
  makefile: "makefile",
  marko: "marko",
  mdc: "mdc",
  mdx: "mdx",
  mediawiki: "mediawiki",
  mermaid: "mermaid",
  mips: "mips",
  mipsasm: "mipsasm",
  mmd: "mmd",
  mojo: "mojo",
  move: "move",
  nar: "nar",
  narrat: "narrat",
  nextflow: "nextflow",
  nf: "nextflow",
  nginx: "nginx",
  nim: "nim",
  nix: "nix",
  nu: "nu",
  nushell: "nushell",
  objc: "objective-c",
  objectivec: "objective-c",
  objectivecpp: "objective-cpp",
  ocaml: "ocaml",
  pascal: "pascal",
  perl: "perl",
  perl6: "perl6",
  plsql: "plsql",
  po: "po",
  polar: "polar",
  postcss: "postcss",
  pot: "pot",
  potx: "potx",
  powerquery: "powerquery",
  prolog: "prolog",
  properties: "properties",
  proto: "proto",
  protobuf: "protobuf",
  ps: "powershell",
  pug: "pug",
  puppet: "puppet",
  purescript: "purescript",
  ql: "ql",
  qml: "qml",
  qmldir: "qmldir",
  qss: "qss",
  racket: "racket",
  raku: "raku",
  razor: "razor",
  reg: "reg",
  regex: "regexp",
  regexp: "regexp",
  rel: "rel",
  riscv: "riscv",
  rst: "rst",
  sas: "sas",
  scheme: "scheme",
  sdbl: "sdbl",
  shader: "shader",
  shaderlab: "shaderlab",
  shellsession: "shellsession",
  smalltalk: "smalltalk",
  solidity: "solidity",
  soy: "soy",
  sparql: "sparql",
  spl: "spl",
  splunk: "splunk",
  sshconfig: "ssh-config",
  stata: "stata",
  styl: "stylus",
  stylus: "stylus",
  svelte: "svelte",
  systemverilog: "system-verilog",
  systemd: "systemd",
  talon: "talon",
  talonscript: "talonscript",
  tasl: "tasl",
  tcl: "tcl",
  templ: "templ",
  terraform: "terraform",
  tex: "tex",
  tf: "terraform",
  tfvars: "terraform",
  toml: "toml",
  tstags: "ts-tags",
  tsp: "tsp",
  tsv: "tsv",
  tsx: "tsx",
  turtle: "turtle",
  twig: "twig",
  typ: "typst",
  typespec: "typespec",
  typst: "typst",
  v: "v",
  vala: "vala",
  vb: "vb",
  vbnet: "vb.net",
  verilog: "verilog",
  vhdl: "vhdl",
  vim: "viml",
  viml: "viml",
  vimscript: "viml",
  vuehtml: "vue-html",
  vuevine: "vue-vine",
  vy: "vyper",
  vyper: "vyper",
  wasm: "wasm",
  wenyan: "wenyan",
  wgsl: "wgsl",
  wiki: "wikitext",
  wikitext: "wikitext",
  wit: "wit",
  wl: "wolfram",
  wolfram: "wolfram",
  xsl: "xsl",
  zenscript: "zenscript",
  zig: "zig",
  zsh: "zsh",
  text: "text",
};

// Auto-detect language using highlight.js with manual overrides
const detectLanguage = (code: string): string => {
  try {
    const result = hljs.highlightAuto(code);
    return result.language || "text";
  } catch (error) {
    console.error("Language detection failed:", error);
    return "text";
  }
};

export const NotionCode = ({ children, language }: NotionCodeProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();
  const codeString = typeof children === "string" ? children : String(children);

  const getFinalLanguage = (): string => {
    let finalLanguage = "text";
    if (language) {
      const key = language.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(languageMap, key)) {
        finalLanguage = languageMap[key];
      }
    }
    if (finalLanguage === "text") {
      finalLanguage = detectLanguage(codeString);
    }
    return finalLanguage;
  };

  const finalLanguage = getFinalLanguage();

  // Check if code has only one line
  const isSingleLine = codeString.split("\n").length === 1;

  const copyCode = () => {
    setIsCopied(true);
    copyToClipboard(codeString);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="pb-4">
      <div className="relative group">
        <ShikiHighlighter
          language={finalLanguage}
          theme="github-dark"
          showLineNumbers
          className="bg-gray-900 rounded-xl shadow-lg"
        >
          {codeString}
        </ShikiHighlighter>

        {/* Copy Button */}
        <button
          className="absolute top-2 right-2 bg-gray-900 rounded border border-gray-600 p-2 text-sm transition-colors hover:bg-gray-700"
          onClick={copyCode}
        >
          {isCopied ? (
            <Icon icon="HiCheckCircle" className="text-white" />
          ) : (
            <Icon icon="HiClipboard" className="text-white" />
          )}
        </button>

        {/* Language Label - only show for multi-line code */}
        {!isSingleLine && (
          <div className="absolute bottom-4 right-2 text-sm bg-gray-700 rounded-lg text-gray-400 p-2 text-right lowercase select-none">
            {finalLanguage}
          </div>
        )}
      </div>
    </div>
  );
};
