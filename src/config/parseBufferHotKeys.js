
const modifiers = {
    m: 'Mod',
    a: 'alt',
    c: 'ctrl',
    s: 'shift',
    ca:'ctrl+alt',
    cs:'ctrl+shit',
    as:'alt+shift',
    ac:'ctrl+alt',
    sc:'ctrl+shit',
    sa:'alt+shift'
}

export const parseBufferHotKeys = (doc, ref)=>{
    let start = 0
    let end = 0
    let shortcut = ''
    let allHotKeys = []
    const buffArray = ['',...doc.toString().split('\n'),'']
    buffArray.forEach((lineContent, lineNb) => {
        if (lineContent.includes('%k ')){
            const mod = lineContent.split(' ')[1].split('-')[0]
            shortcut = `${modifiers[mod]}-${lineContent.split(' ')[1].split('-')[1]}`
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