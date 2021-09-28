import {EditorView} from "@codemirror/view"
import {HighlightStyle, tags as t} from "@codemirror/highlight"

const coral = "#e06c75",
  invalid = "#ffffff",
  ivory = "#abb2bf",
  stone = "#7d8799", // Brightened compared to original to increase contrast
  darkBackground = "#21252b",
  highlightBackground = "rgba(100,100,100,0.3)",
  background = "rgba(0.0,0.0,0.0,0.0)",
  selection = "rgba(200,200,200,0.5)"

export const oneDarkTheme  = EditorView.theme({
    "&": {
      color: ivory,
      maxWidth: "100%",
      height: "100%",
      backgroundColor: background
    },

    '@keyframes blink' : {
      from: {backgroundColor: 'rgba(175,175,175,1.0)'},
      to: {backgroundColor: 'rgba(0.0,0.0,0.0,0.5)'}
    },
  
    ".cm-content": {
      caretColor: 'rgba(255,255,255,1.0)',
      
    },
  
    "&.cm-focused .cm-cursor": {
      borderLeftColor: 'rgba(255,255,255,1.0)',
      },

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
  
    ".cm-line": {
      width: "fit-content",
      backgroundColor: 'rgba(0.0,0.0,0.0,0.4)'
    },
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
     color: 'red'},
    {tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
     color: '#f7768e'}, // post
    {tag: [t.function(t.variableName), t.labelName],
     color: 'pink'},
    {tag: [t.color, t.constant(t.name), t.standard(t.name)],
     color: '#0db9d7'}, // define
    {tag: [t.definition(t.name), t.separator],
     color: 'pink'},
    {tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
     color: '#ff9e64'}, // numbers
    {tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
     color: '#10B981'},
    {tag: [t.meta, t.comment],
     color: '#c0caf5'}, // comments
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
     color: "#7dcfff" }, // 'hello
    {tag: [t.processingInstruction, t.string, t.inserted],
     color: "#73daca"},
    {tag: t.invalid,
     color: invalid},
  ])

  export const oneDark = [oneDarkTheme, oneDarkHighlightStyle]