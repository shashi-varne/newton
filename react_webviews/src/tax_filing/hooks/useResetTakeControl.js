import { useRef, useEffect } from 'react'
import { nativeCallback } from 'utils/native_callback'

export default function useResetTakeControl() {
  const _mounted = useRef(false)

  useEffect(() => {
    _mounted.current = true
  }, [])

  if (!_mounted.current) {
    nativeCallback({ action: 'take_control_reset' })
  }
}
