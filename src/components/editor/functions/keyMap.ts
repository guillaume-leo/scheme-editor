import { udpSend } from "@/config/osc"
import { keymap } from "@codemirror/view"
import { blink, removeMarks } from "./evalBlink"



export const keyMaps = (view: { state: any, dispatch: any })=> keymap.of([{
  key: "Mod-e",
  preventDefault: true,
  run: ():any=>{
    const cm = view.state
    let currOffset = cm.selection.main.head
    
    if (currOffset === 0) return 
    
    const currText: any = cm.doc.toString()

    if (currText[currOffset - 1] === '(') currOffset ++ 

    const beforeCursor = currText.slice(0,currOffset)


    const reSexpStart = /^\([a-zA-Z]/gm
    let sExpStartIndex: number = -1
    let match:any
    while ((match = reSexpStart.exec(beforeCursor)) !== null) {  
      sExpStartIndex = match && match.index  
    }
    

    if (sExpStartIndex===-1) return 

    let sExpEndIndex: number = 1
    
    for (let i = sExpStartIndex + 1; i <= currText.length; i++){
      if (currText[i] === '(') sExpEndIndex ++
      if (currText[i] === ')') sExpEndIndex! --
      if (sExpEndIndex === 0){
        sExpEndIndex = i + 1
        break
      }
      
    }
      if (sExpStartIndex < currOffset && currOffset < sExpEndIndex){
        blink(view, sExpStartIndex, sExpEndIndex)
        setTimeout(()=>{removeMarks(view, sExpStartIndex, sExpEndIndex)}, 1000)
        udpSend(currText.slice(sExpStartIndex, sExpEndIndex))
      }
      return     
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
      const newPos = afterCursor.indexOf('\n' + nextExp[0])+beforeCursor.length + 2
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
      const newPos = beforeCursor.lastIndexOf('\n' + prevExp.pop()) + 2
      view.dispatch({
          selection: {
          anchor: newPos
          }
      })
    }
  }
])