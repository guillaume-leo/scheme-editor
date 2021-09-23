

export const parseBufferSnippets = (str)=>{

    let start = 0
    let end = 0
    let label = ''
    let allSnippets = []
    const buffArray = ['',...str.split('\n'),'']

    // let end = 0
    buffArray.forEach((lineContent, lineNb) => {
        if (lineContent.includes('%s ')){
            label = lineContent.split(' ')[1]
            start = lineNb + 1
        }
        if (lineContent.includes('%s-end')){
            end = lineNb
                allSnippets.push({
                    label:label,
                    start:start,
                    end:end
                })
        }
    })
return allSnippets
}