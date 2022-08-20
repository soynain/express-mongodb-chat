import { validarContrasena } from '../authpass/SaltPepperModule';
import { findCredencialControllerByUsername } from './CredencialesController';
import generarToken from '../auth/token-auth-sign';

const loginController=async (req, res) => {
    const { usuario, contrasena } = req.body;
    let credencialesEncontradas = await findCredencialControllerByUsername(usuario);
    if (credencialesEncontradas !== null) {
        let hashValido = await validarContrasena(contrasena, credencialesEncontradas.contrasena);
        if (hashValido) {
            try {
                let token = await generarToken({usuario,'usuario_id':credencialesEncontradas.id});
                return res.header('access-token',token).json({
                    data:{token},
                    usuario_id:credencialesEncontradas.id
                });
            } catch (JsonWebTokenError) {
                console.log(JsonWebTokenError);
                return res.status(500).json({ 'error': 'token couldnt be generated' });
            }
        }
    }
    return res.status(404).json({ 'Status': 'Invalid credentials' }); 
};

export default loginController;