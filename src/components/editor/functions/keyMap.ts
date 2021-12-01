import { WSsend } from "@/config/osc"
import { keymap } from "@codemirror/view"
import { isNumber } from "lodash";
import { blink, removeMarks } from "./evalBlink"

function getWordAt (str:string, pos:number) {

  // Perform type conversions.
  str = String(str);
  pos = Number(pos) >>> 0;

  // Search for the word's beginning and end.
  const left = str.slice(0, pos + 1).search(/\S+$/),
      right = str.slice(pos).search(/\s/);

  // The last word in the string is a special case.
  if (right < 0) {
      return str.slice(left);
  }

  // Return the word, using the located bounds to extract it from the string.
  return str.slice(left, right + pos);

}

export const keyMaps = (view: { state: any, dispatch: any })=> keymap.of([{
  key: "Mod-e",
  preventDefault: true,
  run: ():any=>{
    let sExp =''
    const cm = view.state
    let currOffset = cm.selection.main.head
    if (currOffset === 0) return 
    const currText = cm.doc.toString()
    if (currText[currOffset - 1] === '(') currOffset ++ 
    const beforeCursor = currText.slice(0,currOffset)
    const afterCursor = currText.slice(currOffset)
    // compute the beggining of the s-exp from cursor
    let start = beforeCursor.match(/^\([a-zA-Z]/gm)
    if (start===null) return 
    start = beforeCursor.lastIndexOf(start.pop())
    // compute end of the s-exp from cursor
    let end = afterCursor.match(/^\([a-zA-Z]/gm)
    if (end === null) {
      end = currText.lastIndexOf(currText.match(/\)/gm).pop()) + 1
      sExp = currText.slice(start, end)
      if (start < currOffset && currOffset < end){
        blink(view, start, end)
        setTimeout(()=>{removeMarks(view, start, end)}, 1000)
        WSsend(sExp)
      }
      return
    }
    const nextExpIndex = /^\([a-zA-Z]/gm.exec(afterCursor)?.index  + beforeCursor.length
    end = currText.slice(0, nextExpIndex)
    end = end.lastIndexOf(end.match(/\)/gm).pop()) + 1
    sExp = currText.slice(start, end)
    if (start < currOffset && currOffset < end){
      blink(view, start, end)
      setTimeout(()=>{removeMarks(view, start, end)}, 1000)
      WSsend(sExp)
    }        
  }
  },
  {
    key: "Mod-ArrowDown",
    preventDefault: true,
    run: ()=>{
      const cm = view.state
      let currOffset = cm.selection.main.head
      const currText = cm.doc.toString()
      if (currText[currOffset - 1] === '(') currOffset ++ 
      const beforeCursor = currText.slice(0,currOffset)
      const afterCursor = currText.slice(currOffset)
      const nextExp = afterCursor.match(/^\([a-zA-Z]/gm)
      if (nextExp === null) return
      const newPos = afterCursor.indexOf(nextExp[0])+beforeCursor.length + 1
      view.dispatch({
          selection: {
          anchor: newPos
          }
      })
    }
  },
  {
    key: "Mod-ArrowUp",
    preventDefault: true,
    run: ()=>{
      const cm = view.state
      const currOffset = cm.selection.main.head
      const currText = cm.doc.toString()
      const beforeCursor = currText.slice(0,currOffset)
      const prevExp = beforeCursor.match(/^\([a-zA-Z]/gm)
      if (prevExp===null) return 
      const newPos = beforeCursor.lastIndexOf(prevExp.pop()) + 1
      view.dispatch({
          selection: {
          anchor: newPos
          }
      })
    }
  },
  {
    key: "Mod-shift-ArrowUp",
    preventDefault: true,
    run: ()=>{
      const cm = view.state
      const currOffset = cm.selection.main.head
      const currWordRange = cm.wordAt(currOffset) 
      if (currWordRange === null) return
      const currWord = cm.doc.toString().slice(currWordRange.from, currWordRange.to)
      let currNumber = parseInt(currWord)
      if (isNaN(currNumber)) return
      currNumber ++
      view.dispatch({
        changes: {from: currWordRange.from, to:currWordRange.to, insert: currNumber.toString()}
      })
    }
  },
  {
    key: "Mod-shift-ArrowDown",
    preventDefault: true,
    run: ()=>{
      const cm = view.state
      const currOffset = cm.selection.main.head
      const currWordRange = cm.wordAt(currOffset) 
      if (currWordRange === null) return
      const currWord = cm.doc.toString().slice(currWordRange.from, currWordRange.to)
      let currNumber = parseInt(currWord)
      if (isNaN(currNumber) || currNumber === 0) return
      currNumber --
      view.dispatch({
        changes: {from: currWordRange.from, to:currWordRange.to, insert: currNumber.toString()}
      })
    }
  },
])