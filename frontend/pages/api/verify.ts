import { setCookie, deleteCookie, getCookie, hasCookie } from "cookies-next";
import { NextApiResponse, NextApiRequest } from "next";

export default function handler (req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.body;

    // Verifying a cookie
    if ( req.method === 'GET') {
      try{
        const hasToken = hasCookie("tk", {req, res});
        const hasId = hasCookie("id", {req, res});
        const tk = getCookie("tk", {req, res});
        const id = getCookie("id", {req, res});

        if(tk != "" && id != "" && hasToken && hasId){
          return res.status(200).json({
                status: "success",
                token: tk,
                id: id
              });
        }else{
          deleteCookie("tk", {req, res});
          deleteCookie("id", {req, res});

          return res.status(200).json({
            status: "failed",
            token: "",
            id: ""
          });
        }
      }catch{
        deleteCookie("tk", {req, res});
        deleteCookie("id", {req, res});
        return res.status(500).json({
          status: "failed",
          token: "",
          id: ""
        });
      }
    }
  }