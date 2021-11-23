export interface editor {
    name:string,
    code:string,
    ref:any[]
}

export interface EditorState {
    editors : Array<editor>
    snippets: any[]
    hotkeys: any[]
    copy: any[]
}

