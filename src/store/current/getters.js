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

export function INTERFACE_THEME (state) {
  return state.interface_theme
}
