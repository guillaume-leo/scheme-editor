


(function () {
    'use strict';
  
    // @omit
    // This file was generated by lezer-generator. You probably shouldn't edit it.
    const {LRParser} = CM["@lezer/lr"];
    const {NodeProp} = CM["@lezer/common"];
    const parser = LRParser.deserialize({
      version: 13,
      states: "!WQYQPOOOhQPO'#CdOOQO'#Ci'#CiOOQO'#Ce'#CeQYQPOOOOQO,59O,59OOyQPO,59OOOQO-E6c-E6cOOQO1G.j1G.j",
      stateData: "![~O[OSPOS~ORQOSQOTQOVPO~ORQOSQOTQOUTOVPO~ORQOSQOTQOUWOVPO~O",
      goto: "u^PPPPPPPP_ePPPoXQOPSUQSOQUPTVSUXROPSU",
      nodeNames: "⚠ LineComment Program Identifier String Boolean ) ( Application",
      maxTerm: 13,
      nodeProps: [
        [NodeProp.openedBy, 6,"("],
        [NodeProp.closedBy, 7,")"]
      ],
      skippedNodes: [0,1],
      repeatNodeCount: 1,
      tokenData: "$W~R^XY}YZ}]^}pq}rs!`st!}xy#]yz#b}!O#g!Q![#g!]!^#{!c!}#g#R#S#g#T#o#g~!SS[~XY}YZ}]^}pq}~!cTOr!`rs!rs#O!`#O#P!w#P~!`~!wOS~~!zPO~!`~#QQ#Y#Z#W#h#i#W~#]OT~~#bOV~~#gOU~~#lTR~}!O#g!Q![#g!c!}#g#R#S#g#T#o#g~$QQP~OY#{Z~#{",
      tokenizers: [0],
      topRules: {"Program":[0,2]},
      tokenPrec: 0
    });
  
    // @omit
    const {foldNodeProp, foldInside, indentNodeProp} = CM["@codemirror/language"];
    const {styleTags, tags: t} = CM["@codemirror/highlight"];
  
    let parserWithMetadata = parser.configure({
      props: [
        styleTags({
          Identifier: t.variableName,
          Boolean: t.bool,
          String: t.string,
          LineComment: t.lineComment,
          "( )": t.paren
        }),
        indentNodeProp.add({
          Application: context => context.column(context.node.from) + context.unit
        }),
        foldNodeProp.add({
          Application: foldInside
        })
      ]
    });
  
    //!language
    const {LRLanguage} = CM["@codemirror/language"];
  
    const exampleLanguage = LRLanguage.define({
      parser: parserWithMetadata,
      languageData: {
        commentTokens: {line: ";"}
      }
    });
  
    //!completion
    const {completeFromList} = CM["@codemirror/autocomplete"];
  
    const exampleCompletion = exampleLanguage.data.of({
      autocomplete: completeFromList([
        {label: "defun", type: "keyword"},
        {label: "defvar", type: "keyword"},
        {label: "let", type: "keyword"},
        {label: "cons", type: "function"},
        {label: "car", type: "function"},
        {label: "cdr", type: "function"}
      ])
    });
  
    //!support
    const {LanguageSupport} = CM["@codemirror/language"];
  
   export const  example = ()=> {
      return new LanguageSupport(exampleLanguage, [exampleCompletion])
    }
  
    const {EditorState, EditorView, basicSetup} = CM["@codemirror/basic-setup"];
  
    let mystate = EditorState.create({
      doc: `(defun check-login (name password) ; absolutely secure\n  (if (equal name "admin")\n    (equal password "12345")\n    #t))`,
      extensions: [basicSetup, example()]
    });
  
    new EditorView({state, parent: document.querySelector("#editor")});
  
  }());