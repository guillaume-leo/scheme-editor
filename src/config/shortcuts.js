import hotkeys from 'hotkeys-js';



export const ALL_SHORTCUTS = ()=>{
    hotkeys('alt+f4',
        (event, handler)=>{
        event.preventDefault() 
        console.log(handler) 
        }
    )

    hotkeys('alt+c',
        (event)=>{
        event.preventDefault() 
        document
            .getElementById('commandInput')
            .focus()
        }
    )


}