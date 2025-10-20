export default function setToken(token, rememberMe = true, name = "") {
    if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("name");
    } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("name", name);
        localStorage.removeItem("token");
        localStorage.removeItem("name");
    }
}

export function getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function getName() {
    return localStorage.getItem("name") || sessionStorage.getItem("name");
}

export function removeToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("name");
    sessionStorage.removeItem("name");
}
