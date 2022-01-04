const dev = process.env.NODE_ENV === "development"
const dbOnline = false

export const SERVER_ADDRESS = dev && !dbOnline ? "http://localhost:3000" : "https://api.tumaini.be"