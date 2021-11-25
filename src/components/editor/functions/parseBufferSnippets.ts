

export const parseBufferSnippets = (doc: any)=>{
    let start = 0
    let end = 0
    let label = ''
    const allSnippets: any[] = []
    const buffArray = ['',...doc.toString().split('\n'),'']
    buffArray.forEach((lineContent, lineNb) => {
        if (lineContent.includes('%s ')){
            label = lineContent.split(' ')[1]
            start = doc.line(lineNb + 1).from 
        }
        if (lineContent.includes('%end')){
            end = doc.line(lineNb).from
                allSnippets.push({
                    label:label,
                    code:doc.toString().slice(start, end - 1)
                })
        }
    })
return allSnippets
}