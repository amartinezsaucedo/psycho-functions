const admin = require("firebase-admin");
const serviceAccount = require("../service-account.json");

const scrumService = {
  init() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://gestorscrum.firebaseio.com"
    });
  },
  async createUser(req) {
    let documentId;
    const db = admin.firestore();
    const usersCollectionRef = db.collection("usersPsycho");
    const userQuery = await usersCollectionRef
      .where("uid", "==", req.body.uid)
      .where("name", "==", req.body.name)
      .where("age", "==", req.body.age)
      .where("male", "==", req.body.male)
      .where("country", "==", req.body.country)
      .get();
    const userExists = userQuery.size > 0;
    if (userExists) {
      documentId = userQuery.docs[0].id;
    }
    else {
      const documentRef = usersCollectionRef.doc();
      documentId = documentRef.id;
      await documentRef.create(req.body);
    }
    return documentId;
  },
  async createMetric(req) {
    const db = admin.firestore();
    const documentRef = db.collection("usersPsycho").doc(req.body.hash);
    const document = await documentRef.get();
    if (!document.exists) {
      return false;
    } else {
      const documentActions = await document.get("actions") || [];
      const actions = req.body.actions.split("_");
      for (a of actions) {
        let index = 0;
        const actionData = a.split("|");
        if (actionData.length > 1) {
          const actionId = actionData[index++];
          const objectId = actionData[index++];
          const value = actionData[index++];
          const date = actionData[index];
          documentActions.push({ actionId, objectId, value, date });
        }
      }
      await documentRef.update({ actions: documentActions });
      return true;
    }
  }
}

scrumService.init();

module.exports = scrumService;