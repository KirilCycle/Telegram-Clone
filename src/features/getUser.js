import firebase from "firebase/compat/app";

export async function getUser(id) {

    const db = firebase.firestore()

    const collectionRef = db.collection("usersPrew");
    const documentRef = collectionRef.doc( id );
    // Retrieve the document using the get() method
  return documentRef
      .get()
      .then((doc) => {
    
        if (doc.data().uid) {
            return doc.data()
         } 
         return 'Error getting user (corupted data)'

      })
      .catch((error) => {
        console.log("Error getting user:", error);
        return "Error getting user"
      });
  }





