const nombreEditText = document.getElementById('nombreEditText');
const cedulaEditText = document.getElementById('cedulaEditText');
const botonRegistrar = document.getElementById('botonRegistrar');
const IDvotado = document.getElementById('IDvotado');
const botonVotar = document.getElementById('botonVotar');
const botonesVer = document.getElementById('botonesVer');
const verCandidatos = document.getElementById('verCandidatos');
const verVotaciones = document.getElementById('verVotaciones');
const baseDatos = firebase.database();
let candidatos = baseDatos.ref("Napoleon/Candidatos");
let votaciones = baseDatos.ref("Napoleon/Votaciones");

//Hacer funciones: con un lamda
// "let" hace que esa variable sólo sea valida para esa función o contextos
const registrarCandidatos = () => {
    console.log("registrar");
    let nombre = nombreEditText.value;
    let cedula = cedulaEditText.value;
    //Con candidatos estamos referenciando la rama de candidatos.
    //Orderbychild me permite ordenar elementos en este caso "cédula"
    //EqualTo busca si estos elementos es igual a cedula
    //Once es para que esta verificacion se haga solo una vez
    candidatos.orderByChild("cedula").equalTo(cedula).once("value", function (data) {
        if (data.exists()) {
            alert("Esta cedula ya existe");
            return; //Así cerramos el proceso
        } else {
            candidatos.orderByChild("nombre").equalTo(nombre).once("value", function (data) {
                if (data.exists()) {
                    alert("Este nombre ya está registrado");
                    return;
                } else {
                    //3=== para texto
                    if (nombre === "" || cedula === "") {
                        alert("Ponga los datos >:o");
                        return;
                    } else {
                        let candidato = {
                            cedula: cedula,
                            nombre: nombre
                        }
                        baseDatos.ref("Napoleon/Candidatos/" + candidato.cedula).set(candidato);
                        nombreEditText.value = "";
                        cedulaEditText.value = "";
                    }
                }
            });
        }
    });
}

botonRegistrar.addEventListener('click', registrarCandidatos);
const votarCandidatos = () => {
    let cedulaVotada = IDvotado.value;
    if (cedulaVotada === "") {
        alert("Pero escriba algo :)");
        return;
    } else {
        let candidatoVotado = {
            cedula: cedulaVotada
        }
        candidatos.once("value", function (data) {
            data.forEach(function (user) {
                let cedulaCandidato = user.key;
                if (cedulaVotada === cedulaCandidato) {
                    database.ref("Napoleon/Votaciones/" + cedulaCandidato.ID).push().set(candidatoVotado);
                    IDvotado.value = "";
                    return;
                }
            })
        });
    }
};
botonVotar.addEventListener('click', votarCandidatos);