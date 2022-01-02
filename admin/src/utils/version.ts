import * as pj from '../../package.json'

const version = pj.version

function getCookieVersion(): number {
    const v: string | null = localStorage.getItem("v")
    if (!v)
        return 0
    return parseInt(v)
}

export function getVersion(): string {
    return version
}

function getParsedVersion(): number {
    console.log(parseInt(version.split(".").join("")))
    return parseInt(version.split(".").join(""))
}

function isNewVersion(): boolean {
    return getCookieVersion() < getParsedVersion()
}

export function checkVersion(): boolean {
    const v = isNewVersion()
    if (v)
        localStorage.setItem("v", String(getParsedVersion()))
    return v
}