
const modifiers = {
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

export const parseBufferShortcuts = (str)=>{

    let start = 0
    let end = 0
    let shortcut = ''
    let allShortCuts = []
    const buffArray = ['',...str.split('\n'),'']

    // let end = 0
    buffArray.forEach((lineContent, lineNb) => {
        if (lineContent.includes('%k ')){
            const mod = lineContent.split(' ')[1].split('-')[0]
            shortcut = `${modifiers[mod]}+${lineContent.split(' ')[1].split('-')[1]}`
            start = lineNb + 1
        }
        if (lineContent.includes('%end')){
            end = lineNb
                allShortCuts.push({
                    shortcut:shortcut,
                    start:start,
                    end:end
                })
        }
    })
return allShortCuts
}