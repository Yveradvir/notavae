import { Cookies } from "react-cookie";

const cookies: Cookies = new Cookies();
export const isAuthenticated = (): boolean => !!cookies.get("refresh_csrf") 

export default cookies; 