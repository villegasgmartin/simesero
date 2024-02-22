const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const mailClave = require('../templateEmail/recuperarClave');
const confirmar = require('../templateEmail/mailConfirmar');
const confirmarPlanEmail = require('../templateEmail/confirmarPlanEmail');
const nuevoValoresEmail = require('../templateEmail/nuevoplanEmail');
const cancelarSuscripcion = require('../templateEmail/CancerlarPlan');

// const  {Resend}  = require('resend') ;

// const resendConfig = new Resend('re_925XzR87_Gf68xaof6XwEHmhcWMR8gZyo');



// const createTrans = ()=>{
//   // const transport = nodemailer.createTransport({
//   //   host: "sandbox.smtp.mailtrap.io",
//   //     port: 2525,
//   //     auth: {
//   //       user: "f7df9a1b3863b3",
//   //       pass: "e1f8a83e3b91c1"
//   //     }
//   // })
//   const transport = nodemailer.createTransport(
//     nodemailerSendgrid({
//       apikey: process.env.API_KEY,
//     })
//   )

//   return transport;
// }

// const sendMail = async (user) =>{
//   const transporter = createTrans();
//   const info = await transporter.sendMail({
//     from : 'test@test.com',
//     to:user,
//     subject: "Restaura tu contraseña",
//     html :mailClave,
//   })

//   console.log("mensaje enviado", info.messageId);
//   return

// }

let transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY
  }
})
function sendEmail (correo){
  
      transporter.sendMail({
        from: "contacto@simesero.com", // verified sender email
        to: correo, // recipient email
        subject: "Recupera tu password", // Subject line
        text: "Equipo de Si Mesero", // plain text body
        html: mailClave, // html body
      }, function(error, info){
        if (error) {
          console.log(error);
        } else {
          
          console.log('Email sent: ' + info.response);
        }
      });

}


// function confirmarPago(correo){
//   console.log('enviado')
//   resendConfig.emails.send({
//   from: 'martinvillegas90@hotmail.com',
//   to: correo,
//   subject: 'Su pago a sido confirmado',
//   html: '<p>Gracias por confiar en Simesero <br><strong>Su pago a sido confirmado correctamente</strong>!</p>'
// })
// };
function confirmarPago(correo){
    transporter.sendMail({
      from: "contacto@simesero.com", // verified sender email
      to: correo, // recipient email
      subject: "Confirmacion de suscripcion", // Subject line
      text: "Equipo de Si Mesero", // plain text body
      html: `Bienvenido a SiMesero <br>
            Su pago a sido confirmado correctamente, <br><strong>Disfrute de Nuestra Web</strong> <br>
            <a style="color:orange; text-decoration:none;" href="https://simesero.com">Dashboard</a>
      
      `, // html body
    }, function(error, info){
      if (error) {
        console.log(error);
      } else {
        
        console.log('Email sent: ' + info.response);
      }
    });
}
function confirmarPlan(correo){
  transporter.sendMail({
    from: "contacto@simesero.com", // verified sender email
    to: correo, // recipient email
    subject: "Confirmacion cambio de plan", // Subject line
    text: "Equipo de Si Mesero", // plain text body
    html: `Bienvenido a SiMesero <br>
    Su pago a sido confirmado correctamente, <br><strong>Empiece a disfrutar de su plan actualizado</strong> <br>
    <a style="color:orange; text-decoration:none;" href="https://simesero.com">Dashboard</a>

`, // html body
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}

// function nuevoValoresCorreo(correo, standard, premium){
//   transporter.sendMail({
//     from: "martinvillegas90@hotmail.com", // verified sender email
//     to: correo, // recipient email
//     subject: "Nuevos Valores de Suscripcion", // Subject line
//     text: "Equipo de Si Mesero", // plain text body
//     html: nuevoValoresEmail(standard, premium), // html body
//   }, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
      
//       console.log('Email sent: ' + info.response);
//     }
//   });
// }

function cancelarsuscripcion(correo){
  transporter.sendMail({
    from: "contacto@simesero.com", // verified sender email
    to: correo, // recipient email
    subject: "Cancelacion de suscripcion", // Subject line
    text: correo + "quiere cancelar la suscripcion", // plain text body
    html: `Bienvenido a SiMesero <br>
    Su solicitud de cancelacion de servicio fue registrada, el mismo quedara sin efecto a partir del proximo mes <br><strong>Nos da lastima perderlo como miembro</strong> <br>
    <a style="color:orange; text-decoration:none;" href="https://simesero.com">Sugerencias</a>

`, // html body
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}

function nuevaPassword(token, correo){
  transporter.sendMail({
    from: "contacto@simesero.com", // verified sender email
    to: correo, // recipient email
    subject: "Solicitud nueva Contraseña", // Subject line
    text: correo + " Configure su nueva contraseña", // plain text body
    html:  `Bienvenido a SiMesero <br>
    Su solicitud de cambio de clave fue registrado, ingrese al siguiente link para actualizarla <br><strong>Este link tiene una validez de 30 min</strong> <br>
    <a style="color:orange; text-decoration:none;" href="https://simesero.com/newpassword?token=${token}">Actualizar Password</a>

`, // html body
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      
      console.log('Email sent: ' + info.response);
    }
  });
}


module.exports = {
  sendEmail,
  confirmarPago,
  confirmarPlan,
  // nuevoValoresCorreo,
  cancelarsuscripcion,
  nuevaPassword
}




  // exports.sendMail = (user) => sendMail(user);


  





