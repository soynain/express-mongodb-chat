import validarToken from "../auth/token-auth-verify";


const tokenMiddleware = async(req, res, next) => {
    const token = req.header('access-token')
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = await validarToken(token);
        req.user = verified
        next() // continuamos
    } catch (error) {
        res.status(400).json({error: 'token no es válido'})
    }
}

export default tokenMiddleware;