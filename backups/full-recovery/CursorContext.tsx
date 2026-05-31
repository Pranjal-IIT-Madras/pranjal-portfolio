'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

export type CursorType = 'default' | 'button' | 'card' | 'link' | 'node' | 'text'

interface CursorContextValue {
  cursorType: CursorType
  setCursorType: (type: CursorType) => void
  /** Convenience helpers */
  enterButton: () => void
  enterCard:   () => void
  enterLink:   () => void
  enterNode:   () => void
  leaveAll:    () => void
}

const CursorContext = createContext<CursorContextValue>({
  cursorType:  'default',
  setCursorType: () => {},
  enterButton: () => {},
  enterCard:   () => {},
  enterLink:   () => {},
  enterNode:   () => {},
  leaveAll:    () => {},
})

export function useCursor() {
  return useContext(CursorContext)
}

interface CursorProviderProps {
  children: ReactNode
}

export function CursorProvider({ children }: CursorProviderProps) {
  const [cursorType, setCursorType] = useState<CursorType>('default')

  const enterButton = useCallback(() => setCursorType('button'), [])
  const enterCard   = useCallback(() => setCursorType('card'),   [])
  const enterLink   = useCallback(() => setCursorType('link'),   [])
  const enterNode   = useCallback(() => setCursorType('node'),   [])
  const leaveAll    = useCallback(() => setCursorType('default'), [])

  return (
    <CursorContext.Provider
      value={{ cursorType, setCursorType, enterButton, enterCard, enterLink, enterNode, leaveAll }}
    >
      {children}
    </CursorContext.Provider>
  )
}
