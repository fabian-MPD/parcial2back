const fs = require('fs/promises');
const path = require('path');

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
    
    const allnuevoAdmin = await fs.readFile(path.join(__dirname,'../../db/Admin.json'));
    const objnuevoAdmin = JSON.parse(allnuevoAdmin);
   
    const allnuevoUser = await fs.readFile(path.join(__dirname,'../../db/user.json'));
    const objnuevoUser = JSON.parse(allnuevoUser);
   
    
 
    
    if (objnuevoUser[username] && objnuevoUser[username] === password ) {
        return res.status(200).json("user");
    } else if (objnuevoAdmin[username] && objnuevoAdmin[username] === password) {
        return res.status(200).json("admin");
    } else {
        
        return res.status(401).json("Credenciales incorrectas");
    }
} catch (error) {
    console.error('Error al leer las credenciales:', error);
    return res.status(500).json({ message: "Error en el servidor" });
}

}

const registroCredenciales = async (req, res)=>{
  
    const {rol,...addcredenciales} = req.body;
    const allnuevoAdmin = await fs.readFile(path.join(__dirname,'../../db/Admin.json'));
    const objnuevoAdmin = JSON.parse(allnuevoAdmin);
   
    const allnuevoUser = await fs.readFile(path.join(__dirname,'../../db/user.json'));
    const objnuevoUser = JSON.parse(allnuevoUser);
    const {user} = addcredenciales;
    const {password} = addcredenciales;

  

    
    if (!objnuevoUser[user] && objnuevoAdmin[user]=== undefined){

        if(rol=== "user"){

            objnuevoUser[user] = password;
            const objUpdateuser = { ...objnuevoUser };
            await fs.writeFile(path.join(__dirname, '../../db/user.json'), JSON.stringify(objUpdateuser, null, 2), 'utf-8');
            return res.json("se creo usuario Generico")
        }else{

            objnuevoAdmin[user] = password;
            const objUpdateuser = { ...objnuevoAdmin };
            await fs.writeFile(path.join(__dirname, '../../db/Admin.json'), JSON.stringify(objUpdateuser, null, 2), 'utf-8');
            return res.json("se creo usuario de administrador")

        }
    }else{
    return res.json("usuario ya existe ") }
    
    

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