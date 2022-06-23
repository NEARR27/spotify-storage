import React, {useState, useEffect} from "react";
import firebaseApp from "../credenciales";
import {getAuth, signOut} from "firebase/auth";
import {getFirestore, doc, getDoc, setDoc} from "firebase/firestore"
import { Container, Button } from "react-bootstrap";
import AgregarTarea from "./AgregarTarea";
import ListadoTareas from "./ListadoTareas";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export const Home = ({correoUsuario}) => {

  const [arrayTareas, setArrayTareas] = useState(null);
  
  const fakeData = [{id: 1, descripcion: "prueba1", tautor: "prueba1", talbum: "prueba1", tgenero:"prueba1", url:"https://picsum.photos/420"},
  {id: 2, descripcion: "prueba1", tautor: "prueba1", talbum: "prueba1", tgenero:"prueba1", url:"https://picsum.photos/420"},
  {id: 3, descripcion: "prueba1", tautor: "prueba1", talbum: "prueba1", tgenero:"prueba1", url:"https://picsum.photos/420"}
];

   async function buscarDocuemntoOrCrearDocumento(idDocumento){
    //crear referencia al documento
    const docuRef = doc(firestore, `usuarios/${idDocumento}` );
    //buscar documento
    const consulta = await getDoc(docuRef);

     //revisar si existe
     if (consulta.exists()){
      //si existe
      const infoDocu = consulta.data();
      return infoDocu.tareas;
    }else{
      //si no existe
      await setDoc(docuRef, {tareas: [...fakeData]});
      const consulta = await getDoc(docuRef);
      const infoDocu = consulta.data();
      return infoDocu.tareas;
  }

}
    useEffect(() => {
      async function fetchTareas(){
        const tareasFetcheadas = await buscarDocuemntoOrCrearDocumento(correoUsuario);
        setArrayTareas(tareasFetcheadas);
      }

      fetchTareas();

    }, [])




   
  return(
    <Container>
        <h4>Hola, Sesión Iniciada</h4>
        <Button onClick={() => signOut(auth)}>
            Cerrar Sesión
        </Button>
        <hr/>
        <AgregarTarea/>
        {
          arrayTareas ? (
        <ListadoTareas arrayTareas = {arrayTareas} setArrayTareas={setArrayTareas} correoUsuario={correoUsuario}/>
          ): null}
    </Container>
    
);
};

export default Home;
