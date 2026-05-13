import * as React from "react"

const QUERY_PARAM_EVENT = "queryparam:change"

function readParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key)
}

function writeParam(key: string, value: string) {
  const params = new URLSearchParams(window.location.search)
  params.set(key, value)
  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.replaceState(null, "", newUrl)
  window.dispatchEvent(new Event(QUERY_PARAM_EVENT))
}

/**
 * Syncs a single URL query param with component state.
 * Uses replaceState — tab changes don't pollute browser history.
 */
export function useQueryParam(
  key: string,
  defaultValue: string
): [string, (value: string) => void] {
  const [value, setValue] = React.useState<string>(
    () => readParam(key) ?? defaultValue
  )

  React.useEffect(() => {
    const sync = () => setValue(readParam(key) ?? defaultValue)
    window.addEventListener("popstate", sync)
    window.addEventListener(QUERY_PARAM_EVENT, sync)
    return () => {
      window.removeEventListener("popstate", sync)
      window.removeEventListener(QUERY_PARAM_EVENT, sync)
    }
  }, [key, defaultValue])

  const set = React.useCallback(
    (newValue: string) => {
      writeParam(key, newValue)
      setValue(newValue)
    },
    [key]
  )

  return [value, set]
}
