// forked from @material-ui/utils
// https://github.com/mui/material-ui/tree/1a47213c443239860bbee373e198c95dac1f69b6/packages/mui-utils/src
// https://github.com/gregberge/react-merge-refs/issues/5
import * as React from 'react'

/**
 * Merges refs into a single stable callback ref function.
 * @param refs - Multiple refs to merge into a single ref
 * @returns A single callback ref function
 */
export function useMergeRefs<Instance>(
  ...refs: Array<React.Ref<Instance> | undefined>
): React.RefCallback<Instance> | null {
  /**
   * This will create a new function if the refs passed to this hook change and are all defined.
   * This means react will call the old forkRef with `null` and the new forkRef
   * with the ref. Cleanup naturally emerges from this behavior.
   */
  return React.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null
    }

    return (instance) => {
      refs.forEach((ref) => {
        setRef(ref, instance)
      })
    }
  }, refs)
}

function setRef<T>(
  ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null
): void {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}
