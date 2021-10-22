import { useContext } from "react";
import context from "./conext.js";

function useUnsyncForm(deps: string[] | any) {
  const lastArg = deps[deps.length - 1]
  const config = typeof lastArg !== 'string' && !Array.isArray(lastArg) ?  lastArg: null

  let fieldNames
  if (Array.isArray(deps[0])) {
    fieldNames = deps[0]
  } else {
    if (config) {
      fieldNames = deps.slice(0, deps.length - 1)
    } else {
      fieldNames = deps
    }
  }

  const contextForm = useContext(config?.context ?? context);
  const form = config?.form || contextForm

  return {
    form,
    fieldNames
  }
}

export default useUnsyncForm