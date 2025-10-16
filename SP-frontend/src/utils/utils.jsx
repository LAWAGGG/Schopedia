export default function setToken(token, rememberMe = true) {
    if (rememberMe) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token");
    } else {
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");
    }
}

export function getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function removeToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
}