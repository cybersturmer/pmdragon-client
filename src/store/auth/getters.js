export function IS_LOGGED_IN (state, getters) {
  const isUserId = !!getters.MY_USER_ID
  const isRefreshTokenValid = getters.IS_REFRESH_TOKEN_VALID

  return isUserId && isRefreshTokenValid
}

export function IS_ACCESS_TOKEN_VALID (state) {
  const now = Date.now()
  return state.tokens.access.expired_at !== null &&
    now < Date.parse(state.tokens.access.expired_at)
}

export function IS_REFRESH_TOKEN_VALID (state) {
  const now = Date.now()
  return state.tokens.refresh.expired_at !== null &&
    now < Date.parse(state.tokens.refresh.expired_at)
}

export function ACCESS_TOKEN (state) {
  return state.tokens.access.data
}

export function REFRESH_TOKEN (state) {
  return state.tokens.refresh.data
}

export function IS_REFRESH_TOKEN_REQUIRED (state, getters) {
  /** We use this getters to understand can we just updated current tokens
   * For it we need valid refresh token
   * But we really need update access token just in a case it not valid anymore
   * **/

  return !getters.IS_ACCESS_TOKEN_VALID && getters.IS_REFRESH_TOKEN_VALID
}

export function PERSON_BY_ID (state, getters) {
  /** Getting person by id from current workspace **/
  return personId => {
    return getters.PERSONS.find(person => person.id === personId)
  }
}

export function WORKSPACES (state) {
  return state.workspaces
}

export function PERSONS (state) {
  return state.persons
}

export function INVITED (state) {
  return state.invited
}

export function WORKSPACE_DATA (state, getters, rootState, rootGetters) {
  return state.workspaces
    .find(workspace => workspace.prefix_url === rootGetters['current/WORKSPACE'])
}

export function PARTICIPANTS_BY_CURRENT_PROJECT (state, getters) {
  try {
    return getters.WORKSPACE_DATA.participants
  } catch (e) {
    return []
  }
}

export function WORKSPACE_ID (state, getters) {
  try {
    return getters.WORKSPACE_DATA.id
  } catch (e) {
    return null
  }
}

export function WORKSPACE_FIRST_ID (state) {
  try {
    return state.workspaces[0].id
  } catch (e) {
    return null
  }
}

export function WORKSPACE_FIRST_PREFIX (state) {
  try {
    return state.workspaces[0].prefix_url
  } catch (e) {
    return null
  }
}

export function IS_ANY_PROJECT (state) {
  try {
    return !!state.workspaces.find(workspace => workspace.projects.length > 0)
  } catch (e) {
    return false
  }
}

export function PROJECT_DATA (state, getters, rootState, rootGetters) {
  try {
    return getters.WORKSPACE_DATA.projects.find(
      project => project.id === rootGetters['current/PROJECT'])
  } catch (e) {
    return null
  }
}

export function PROJECT_TITLE (state, getters) {
  try {
    return getters.PROJECT_DATA.title
  } catch (e) {
    return null
  }
}

export function PROJECT_KEY (state, getters) {
  try {
    return getters.PROJECT_DATA.key
  } catch (e) {
    return null
  }
}

export function PROJECT_OWNED_BY (state, getters) {
  try {
    return getters.PERSON_BY_ID(getters.PROJECT_DATA.owned_by)
  } catch (e) {
    return null
  }
}

export function IS_ME_OWNER_OF_PROJECT (state, getters) {
  try {
    return getters.PROJECT_OWNED_BY.id === getters.MY_USER_ID
  } catch (e) {
    return false
  }
}

export function MY_DATA (state, getters) {
  try {
    return getters.PERSON_BY_ID(getters.MY_USER_ID)
  } catch (e) {
    return null
  }
}

export function IS_MY_DATA_FILLED (state, getters) {
  try {
    return !!getters.MY_FIRST_NAME &&
           !!getters.MY_LAST_NAME &&
           !!getters.MY_USERNAME
  } catch (e) {
    return false
  }
}

export function MY_FIRST_NAME (state, getters) {
  try {
    return getters.MY_DATA.first_name
  } catch (e) {
    return null
  }
}

export function MY_LAST_NAME (state, getters) {
  try {
    return getters.MY_DATA.last_name
  } catch (e) {
    return null
  }
}

export function MY_USERNAME (state, getters) {
  try {
    return getters.MY_DATA.username
  } catch (e) {
    return null
  }
}

export function MY_EMAIL (state, getters) {
  try {
    return getters.MY_DATA.email
  } catch (e) {
    return null
  }
}

export function MY_AVATAR (state, getters) {
  try {
    return getters.MY_DATA.avatar
  } catch (e) {
    return null
  }
}

export function MY_USER_ID (state) {
  return state.user_id ? state.user_id : null
}

export function ME_LAST_LOGIN (state, getters) {
  try {
    return getters.MY_DATA.last_login
  } catch (e) {
    return null
  }
}

export function ME_CREATED_AT (state, getters) {
  try {
    return getters.MY_DATA.created_at
  } catch (e) {
    return null
  }
}
