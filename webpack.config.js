import path from "path";

const module = {
    target: "node", 
    entry: "./main.js", 
    output: {
        filename: "bundle.js",
        path: path.resolve(import.meta.dirname, "dist"),
    },
    mode: "production",
}

export default module;