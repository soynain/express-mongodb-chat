import bcrypt from 'bcrypt';

const validarContrasena = async (contrasenaIntroducida, contrasenaOriginal) => {
    return await bcrypt.compare(contrasenaIntroducida, contrasenaOriginal);
}

const generarContrasena = async (contrasenaAEncriptar) => {
    return bcrypt.hash(contrasenaAEncriptar, 12);
}

export { validarContrasena, generarContrasena };