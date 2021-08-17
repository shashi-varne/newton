import { useRef, useEffect } from 'react'
import {
  initBackButtonTracker,
  untrackBackButtonPress,
} from '../common/functions'

export default function useBackButtonTracker() {
  const _mounted = useRef(false)
  useEffect(() => {
    _mounted.current = true
    return () => {
      untrackBackButtonPress()
    }
  }, [])
  if (!_mounted.current) {
    initBackButtonTracker()
  }
}
