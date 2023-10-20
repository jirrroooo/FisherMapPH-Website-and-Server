import { setCookie, deleteCookie, getCookie, hasCookie } from "cookies-next";
import { NextApiResponse, NextApiRequest } from "next";

export default function handler (req: NextApiRequest, res: NextApiResponse) {
    const { token } = req.body;

    // Verifying a cookie
    if ( req.method === 'GET') {
      try{

        const hasToken = hasCookie("token", {req, res});        
        const val = getCookie("token", {req, res});

        if(hasToken){
          return res.status(200).json({
                status: "success",
                token: val
              });
        }else{
          return res.status(200).json({
            status: "unsuccessful",
            token: ""
          });
        }
      }catch{
        return res.status(200).json({
          status: "unsuccessful",
          token: ""
        });
      }
    }
  }