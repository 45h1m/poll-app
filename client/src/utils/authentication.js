import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function getUser() {
    const access_token = Cookies.get("access_token");
    if(!access_token) {
        return null;
    }
    try {
        const decoded = jwtDecode(access_token);
        return decoded;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export function logOut() {
    Cookies.remove("access_token");
    window.location.reload();
};