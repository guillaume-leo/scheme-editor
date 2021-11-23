
/*
------------------------------------------------------
parseBuffer: 

    analyse a buffer (string) and return
    an array of objects representing all s-expressions
    following this structure : 

    [
        0:  {
            start: [lineNum, charNum],
            end: [lineNum, charNum]
            },
        ...
    ] 
______________________________________________________
*/

// import store from '@/store'

export const parseBuffer = str => {

    let prevVal = 0
    let val = 0
    let newVal = 0
    let sExpStart = []
    let sExpEnd = []
    const sExp = []
    
    const buffArray = ['',...str.split('\n'),'']

    buffArray.forEach((lineContent, lineNum) => {
        
        let isComment = false

        lineContent.split('').forEach((char, charNum) => {

            if (char === ';') isComment = true

            if (!isComment){
                prevVal = val
                if (char === '(') val ++
                if (char === ')') val --
                newVal = val
                if (prevVal === 0 && newVal === 1) sExpStart = [lineNum,charNum]
                if (prevVal === 1 && newVal === 0) {
                    sExpEnd = [lineNum,charNum] 
                    sExp.push({
                        start: sExpStart,
                        end: sExpEnd
                    })
            }
            }
        })
    })
    return sExp
}