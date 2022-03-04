import { useContext, useMemo, useRef } from "react"
import { TokenContext } from "../App"
// import { serverAddress, serverPort } from "../data/data"
import { config } from "dotenv"
config();
const serverAddress = process.env.REACT_APP_BASE_URL;
const serverPort = process.env.REACT_APP_BASE_PORT;
const useFetch = (method) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const logout = useRef(tokenContext[2]);
    const func = useMemo(() => method === "GET"
        ? async (url, abortController) => {
            const aController = abortController || new AbortController()
            const resp = await fetch(`${serverAddress}:${serverPort}${url}`, {
                signal: aController.signal,
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (resp.status === 401)
                logout.current();
            else
                return resp.json();
        }
        : async (url, data, abortController) => {
            const apiData = JSON.stringify(data);
            const aController = abortController || new AbortController()
            const resp = await fetch(`${serverAddress}:${serverPort}${url}`, {
                method: method,
                signal: aController.signal,
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json",
                    "Content-Length": apiData.length
                },
                body: apiData
            });
            const contentType = resp.headers.get("content-type");
            if (resp.status === 401)
                logout.current();
            else if (resp.status === 403)
                throw new Error(403);
            else if (contentType && contentType.indexOf("application/json") !== -1)
                return resp.json();

            else
                throw new Error(500);
        }, [token, method, logout])
    return func
}

export default useFetch