const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

export const RTUtils = {

  generateUID() {
    let hash = ''

    for (let i = 0; i < 6; i++) {
      hash += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
    }

    return hash
  }
}