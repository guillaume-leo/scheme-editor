import hotkeys from 'hotkeys-js';



export const ALL_SHORTCUTS = ()=>{
    hotkeys('alt+f4',
        (event, handler)=>{
        event.preventDefault() 
        console.log(handler) 
        }
    )

    hotkeys('ctrl+r',
        (event, handler)=>{
        event.preventDefault() 
        console.log(handler) 
        }
    )

    hotkeys('alt+c',
        (event)=>{
        event.preventDefault() 
        document
            .getElementById('commandInput')!
            .focus()
        }
    )

    // make sure that shortcuts are still working inside INPUT/TEXT/TEXTAREA elements
    hotkeys.filter = function(event: any){
        const tagName = (event.target || event.srcElement)!.tagName;
        hotkeys.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
        return true;
      }

}