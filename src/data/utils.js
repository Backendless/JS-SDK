import User from '../users/user'

export function resolveModelClassFromString (className) {
  if(className === User.className){
    return User
  }

  return function() {
  }
}
