export function WORKSPACE (state) {
  return state.workspace
}

export function IS_WORKSPACE (state) {
  return Boolean(state.workspace)
}

export function PROJECT (state) {
  return state.project
}

export function IS_SPACE_DEFINED (state) {
  return Boolean(state.workspace && state.project)
}

export function LOADING (state) {
  return !!state.loading
}

export function LOADING_TEXT (state) {
  if (!state.loading_module) return ''

  return `Loading ${state.loading_module}...`
}

export function ISSUE (state) {
  return state.issue
}

export function ISSUE_MESSAGES (state) {
  return state.issue_messages
}

export function ARE_ISSUE_MESSAGES (state) {
  return state.issue_messages.length > 0
}

export function ISSUE_HISTORY (state) {
  return state.issue_history
}
