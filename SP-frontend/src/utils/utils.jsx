export function SetToken(Token) {
    localStorage.setItem("token", Token)
}
export const Token = localStorage.getItem("token")