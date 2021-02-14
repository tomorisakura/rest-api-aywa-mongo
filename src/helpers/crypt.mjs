import bcrypt from 'bcrypt';

export function hashCrypt(password) {
    const saltx = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, saltx);
}

export function compareCrypt(password, dbPassword) {
    return bcrypt.compareSync(password, dbPassword);
}
