export async function checkNeccessaryData() {
  const db = firebase.firestore();

  const docRef = doc(db, "usersLinksToChat", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.log("cc action");
    await setDoc(doc(db, "usersLinksToChat", user.uid), {
      //
    }).catch((er) => reject(er));
  }

  const prewuserSnapRef = doc(db, "usersPrew", user.uid);
  const prewuserSnap = await getDoc(prewuserSnapRef);

  if (!prewuserSnap.exists()) {
    console.log("cpu action");
    await setDoc(doc(db, "usersPrew", user.uid), {
      uid: user.uid,
      photoURl: `https://robohash.org/${user.uid}.png`,
      email: user.email,
      username: user.email.slice(0, user.email.indexOf("@")) + wordGenerator(),
    })
      .then((res) => setUserToStore(res))
      .catch(() => reject(er));
  } else {
    setUserToStore(prewuserSnap.data(), db);
    resolve(true);
  }
}
