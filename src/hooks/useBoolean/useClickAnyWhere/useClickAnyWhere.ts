import {useEventListener} from '../useEventListener'

type Handler = (event: MouseEvent) => void

export default function useClickAnyWhere(handler:Handler) {
useEventListener('click', event => {
    handler(event)
})

}
