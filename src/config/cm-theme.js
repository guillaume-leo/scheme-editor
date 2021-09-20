import {EditorView} from "@codemirror/view"
import {HighlightStyle, tags as t} from "@codemirror/highlight"

const chalky = "#e5c07b",
  coral = "#e06c75",
  cyan = "#56b6c2",
  invalid = "#ffffff",
  ivory = "#abb2bf",
  stone = "#7d8799", // Brightened compared to original to increase contrast
  malibu = "#61afef",
  sage = "#98c379",
  whiskey = "#d19a66",
  violet = "#c678dd",
  darkBackground = "#21252b",
  highlightBackground = "#2c313a",
  background = "rgba(0.0,0.0,0.0,0.0)",
  selection = "#3E4451",
  cursor = "#528bff"


export const oneDarkTheme  = EditorView.theme({
    "&": {
      color: ivory,
      maxWidth: "100%",
      height: "100%",
      backgroundColor: background
    },
  
    ".cm-content": {
      caretColor: cursor,
    },
  
    "&.cm-focused .cm-cursor": {borderLeftColor: cursor},
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {backgroundColor: selection},
  
    ".cm-panels": {backgroundColor: darkBackground, color: ivory},
    ".cm-panels.cm-panels-top": {borderBottom: "2px solid black"},
    ".cm-panels.cm-panels-bottom": {borderTop: "2px solid black"},
  
    ".cm-searchMatch": {
      backgroundColor: "#72a1ff59",
      outline: "1px solid #457dff"
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#6199ff2f"
    },
  
    ".cm-activeLine": {backgroundColor: highlightBackground},
    ".cm-selectionMatch": {backgroundColor: "#aafe661a"},
  
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "#bad0f847",
      outline: "1px solid #515a6b"
    },
  
    ".cm-gutters": {
      backgroundColor: background,
      color: stone,
      border: "none"
    },
  
    ".cm-activeLineGutter": {
      backgroundColor: highlightBackground
    },
  
    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: "#ddd"
    },
  
    ".cm-tooltip": {
      border: "1px solid #181a1f",
      backgroundColor: darkBackground
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: highlightBackground,
        color: ivory
      }
    }
  }, {dark: true})

  export const oneDarkHighlightStyle = HighlightStyle.define([
    {tag: t.keyword,
     color: chalky},
    {tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
     color: coral},
    {tag: [t.function(t.variableName), t.labelName],
     color: malibu},
    {tag: [t.color, t.constant(t.name), t.standard(t.name)],
     color: whiskey},
    {tag: [t.definition(t.name), t.separator],
     color: ivory},
    {tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
     color: violet},
    {tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
     color: cyan},
    {tag: [t.meta, t.comment],
     color: stone},
    {tag: t.strong,
     fontWeight: "bold"},
    {tag: t.emphasis,
     fontStyle: "italic"},
    {tag: t.strikethrough,
     textDecoration: "line-through"},
    {tag: t.link,
     color: stone,
     textDecoration: "underline"},
    {tag: t.heading,
     fontWeight: "bold",
     color: coral},
    {tag: [t.atom, t.bool, t.special(t.variableName)],
     color: "red" },
    {tag: [t.processingInstruction, t.string, t.inserted],
     color: sage},
    {tag: t.invalid,
     color: invalid},
  ])

  export const oneDark = [oneDarkTheme, oneDarkHighlightStyle]