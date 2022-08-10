import bcrypt from 'bcrypt';

const SALT_ROUNDS=12;
const validarContrasena = async (contrasenaIntroducida, contrasenaOriginal) => {
    return await bcrypt.compare(contrasenaIntroducida, contrasenaOriginal);
}

const generarContrasena = async (contrasenaAEncriptar) => {
    return bcrypt.hash(contrasenaAEncriptar, SALT_ROUNDS);
}

export { validarContrasena, generarContrasena };