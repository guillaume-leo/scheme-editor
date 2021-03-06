
export const parseBufferHotKeys = (doc: any, ref: any)=>{
    let start = 0
    let end = 0
    let shortcut = ''
    const allHotKeys : any[] = []
    const buffArray = ['',...doc.toString().split('\n'),'']
    buffArray.forEach((lineContent, lineNb) => {
        if (lineContent.includes('%k ')){
            shortcut = lineContent.split(' ')[1]
            start = doc.line(lineNb + 1).from
        }
        if (lineContent.includes('%end')){
            end = doc.line(lineNb).from
                allHotKeys.push({
                    hotkey:shortcut,
                    start:start,
                    end:end,
                    code:doc.toString().slice(start, end - 1),
                    ref:ref
                })
        }
    })
return allHotKeys
}