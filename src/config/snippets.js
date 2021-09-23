import {snippetCompletion as snip} from "@codemirror/autocomplete"


export const snippets = 
[
snip(
`(define (#{name})
  (post #{name}))#{}`,   
{
  label: 'define',
  detail: 'this is something'
})
]