import store from "@/store"
import { editorMutations } from "@/store/editor/mutations"
import { EditorView } from "@codemirror/basic-setup"


export const onChange = (view: { state: any }, name:string) => EditorView.updateListener.of((obj) => {
  const cm = view.state
  if (obj.view.hasFocus) store.commit(editorMutations.FOCUSED_EDITOR, view)
  const currText = cm.doc.toString()
  store.commit(editorMutations.UPDATE_CODE, {
    name: name,
    code: currText
  })
})