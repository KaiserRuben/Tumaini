/**
 * This module provides several functions to handle version numbers on client side.
 *
 * Copyright: Ruben Kaiser 2022
 * Version: 0.1.0
 */

const version = '0.9.0'

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
