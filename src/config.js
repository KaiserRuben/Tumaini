const dev = import.meta.env.DEV;
const dbOnline = true;
export const SERVER_ADDRESS = dev && !dbOnline ? "http://localhost:3000" : "https://api.tumaini.be";
