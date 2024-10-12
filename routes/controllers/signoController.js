const fs = require('fs/promises');
const path = require('path');
const User = require('../../db/user')
const bcrypt = require('bcrypt');

const mongodb = require('../../db/mongo')

const signToken = _id => JsonWebTokenError.sign({_id}, 'mi-string-secreto')


const getAllSignos = async (req, res)=>{
    const signo = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const signosJson = JSON.parse(signo)
    res.json(signosJson);
}

const getOneSigno = async (req, res)=>{
    const {categoriaU, signoU} = req.params;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);
    const result1 = objSignos[categoriaU][signoU];
    // const result =result1[oneSigno]

    console.log(categoriaU)
    console.log(signoU)
    res.json(result1)
}

const updateSigno = async (req, res)=>{
    const {categoria,signoEditar} = req.params;
    const {textoEditar} = req.body;
    const allSignos = await fs.readFile(path.join(__dirname,'../../db/signos.json'));
    const objSignos = JSON.parse(allSignos);

    
    objSignos[categoria][signoEditar] = textoEditar;
    const objUpdate = { ...objSignos };
    await fs.writeFile(path.join(__dirname, '../../db/signos.json'), JSON.stringify(objSignos, null, 2), 'utf-8');
    

 

    res.json({
        message: "Updated"
    })
}

const validarCredenciales = async (req, res)=>{
   //const {categoria,signoEditar} = req.params;
   
   const {username,password} = req.body;
   try{

    const user = await User.findOne({email: username})

    if (!user){
        res.status(403).send('usuario o contaseña invalida')
    }else{

        const isMatch =await bcrypt.compare(password, user.password)
        if (isMatch){

          if(user.rol === 'user'){

            res.json('user')
        }else{
            
            res.json('admin')
         
          }

        }
    }

    
} catch (error) {
    console.error('Error al leer las credenciales:', error);
    return res.status(500).json({ message: "Error en el servidor" });
}

}

const registroCredenciales = async (req, res)=>{
  
    const {...addcredenciales} = req.body;

    console.log(addcredenciales)

    const {email} = addcredenciales
    const {password} = addcredenciales
    const {rol} = addcredenciales
    
    console.log(email)
    console.log(password)
    
    try{
        const isUser = await User.findOne({email: email})
        if(isUser){
            return res.status(403).send('usuario ya existe')
        }

        const salt = await  bcrypt.genSalt()
        const hashed = await bcrypt.hash(password, salt)
        const user = await User.create({rol:rol, email:email, password: hashed,salt})
    }catch(err){

        console.log(err)
        res.status(500).send(err.message)

    }
    
    

}

const editarContrasena = async (req, res)=>{
  
    const {...newpassword} = req.body;
    const allcredencialAdmin = await fs.readFile(path.join(__dirname,'../../db/Admin.json'));
    const objedicredeAdmin = JSON.parse(allcredencialAdmin);
   
    const allcredencialUser = await fs.readFile(path.join(__dirname,'../../db/user.json'));
    const objedicredeUser = JSON.parse(allcredencialUser);

    const {usuario} = newpassword
    const {password} = newpassword
    const {newPassword} = newpassword

    console.log(usuario);
    console.log(password);
    console.log(newPassword);

    const valida = objedicredeUser[usuario];
    console.log(valida);

    if(!objedicredeUser[usuario] && objedicredeAdmin[usuario]=== undefined){

        //console.log("ingreso")
        return res.json("usuari no existe crea uno nuevo")
        }if (objedicredeUser[usuario] || objedicredeAdmin[usuario] !== undefined){
           
            if((objedicredeUser[usuario] && objedicredeUser[usuario] === password) ||
                 (objedicredeAdmin[usuario] && objedicredeAdmin[usuario] === password)){
             
             
             
                if(objedicredeUser[usuario]){
                 
                    objedicredeUser[usuario] = newPassword;
                    const objUpdateuser = { ...objedicredeUser };
                    await fs.writeFile(path.join(__dirname, '../../db/user.json'), JSON.stringify(objUpdateuser, null, 2), 'utf-8');
                    return res.json("Se modifico contraseña de Usuario")
                }

                if(objedicredeAdmin[usuario]){
                
                    objedicredeAdmin[usuario] = newPassword;
                    const objUpdateadmin = { ...objedicredeAdmin };
                    await fs.writeFile(path.join(__dirname, '../../db/Admin.json'), JSON.stringify(objUpdateadmin, null, 2), 'utf-8');
                    return res.json("Se modifico contraseña de admin")
                }

            }else {
           
                return res.json("Usuario o contraseña incorrectos");
            }

    }
    

  

}

module.exports = {
    getAllSignos,
    getOneSigno,
    updateSigno,
    validarCredenciales,
    registroCredenciales,
    editarContrasena
}