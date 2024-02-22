const jwt = require('jsonwebtoken');

const generarJWT = (email)=>{
    return new Promise((resolve, reject)=>{
        const payload = {email};

    jwt.sign(payload, process.env.SECRETORPUBLIC_KEY, 
        {
            expiresIn: '10h'
        },
        (err, token)=>{
            if (err){
                console.error(err);
                reject('Error signing');
            }
            else{
                resolve(token);
            }
        }
    );

    })
}
const generarJWTPassword = (email)=>{
    return new Promise((resolve, reject)=>{
        const payload = {email};

    jwt.sign(payload, process.env.SECRETORPUBLIC_KEY, 
        {
            expiresIn: '30m'
        },
        (err, token)=>{
            if (err){
                console.error(err);
                reject('Error signing');
            }
            else{
                resolve(token);
            }
        }
    );

    })
}

module.exports = {
    generarJWT,
    generarJWTPassword
};

