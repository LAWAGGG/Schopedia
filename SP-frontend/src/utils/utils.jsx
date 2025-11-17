export default function setToken(token, rememberMe = true, name = "", role = "") {
    if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("role", role);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("role");
    } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("role", role);
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("role");
    }
}

export function getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function getName() {
    return localStorage.getItem("name") || sessionStorage.getItem("name");
}

export function getUserRole() {
    return localStorage.getItem("role") || sessionStorage.getItem("role");
}

export function removeToken() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("name");
    sessionStorage.removeItem("name");
    localStorage.removeItem("role");
    sessionStorage.removeItem("role");
}
