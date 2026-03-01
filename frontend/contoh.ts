import { authService } from "./lib/services/auth/authService";

const data = async () => {
    const res = await authService.register({email: "khaerul1234@gmail.com", name:"lutfi", password: "12345678"})
    console.log(res)
}
data()