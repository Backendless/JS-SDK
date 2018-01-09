const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const RTUtils = {

  generateUID() {
    //TODO: find a better solution for generate UID
    let hash = ''

    for (let i = 0; i < 8; i++) {
      hash += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
    }

    return hash + Date.now()
  }
}

export default RTUtils