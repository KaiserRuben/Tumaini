const dbOnline = true

export const SERVER_ADDRESS = !dbOnline ? "http://localhost:3000" : "https://api.tumaini.be"
export const MEDIA_LOCATION = `https://files.tumaini.be/`
export const FILES_LOCATION = `https://files.tumaini.be/`
