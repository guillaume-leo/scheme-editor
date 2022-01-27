import { StateEffect, StateField } from "@codemirror/state"
import { Decoration, DecorationSet, EditorView } from "@codemirror/view"


const addBlink = StateEffect.define<{from: number, to: number}>()
const removeBlink: any[any] = StateEffect.define<{from: number, to: number}>()

const blinkField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none
  },
  update(blinks:any, tr) {
    blinks = blinks.map(tr.changes)
    for (const e of tr.effects) {
      if (e.is(addBlink)) {
        blinks = blinks.update({
          add: [blinkMark.range(e.value.from, e.value.to)]
        })
      }else if (e.is(removeBlink)) {
        blinks = blinks.update({
            filter: e.value
        })}
    }
    return blinks
  },
  provide: (f:any) => EditorView.decorations.from(f)
})

export function removeMarks(view:any, a: number, b: number) {
  view.dispatch({
    effects: removeBlink.of((from: number, to: number) => {to <= a || from >= b})
  })
}

const blinkMark = Decoration.mark(
  {
    class: "cm-blink",
    'id': 'BLINK'
  })

const blinkTheme = EditorView.baseTheme({
  ".cm-blink": {  animationName: 'blink',
                  animationDuration: '1s',

                  borderRadius:'2.5px',
                },
})


export const blink = (view:any, start:number, end:number) => {
  const effects:any[] = [addBlink.of({from:start, to:end})]
  if (!effects.length) return false
0
  if (!view.state.field(blinkField, false))

    effects.push(StateEffect.appendConfig.of([blinkField,
                                              blinkTheme]))


  view.dispatch({effects})
  return true
}

