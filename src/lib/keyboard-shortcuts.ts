import { KeyCombination as KeyCombinationType } from '@/hooks/useKeyCombination'

const keyShortcutsUnchecked = {
  createRequest: {
    keys: ['c', 'r'],
  },
  createFolder: {
    keys: ['c', 'f'],
  },
}

type KeyShortcuts = {
  [K in keyof typeof keyShortcutsUnchecked]: KeyCombinationType
}

export const keyShortcuts: KeyShortcuts = keyShortcutsUnchecked
