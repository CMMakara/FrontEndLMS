import { loginUser } from "../services/authService"
import { useNavigate } from "react-router-dom"
import { setAuth } from "../utils/auth"

const useUserAuth = () =>{
  const navigate = useNavigate()

  const handleLogin =  async (email_or_username , password) =>{
    const data = await loginUser({email_or_username , password});
    setAuth(data.token , data.role_name)

    if(data.role_name === "Admin"){
      navigate('/admin')
    }
    else if (data.role_name === "Librarian"){
      navigate('/librarian/dashboard')
    }
    else{
      navigate('/')
    }
    
  }
  return {handleLogin}

}

export default useUserAuth;