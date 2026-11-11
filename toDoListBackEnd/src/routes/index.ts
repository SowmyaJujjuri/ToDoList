import { Router } from 'express';
import { isCreateTodoBody, isUpdateTodoBody } from '../types/CreateToDo.js';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert } from 'firebase-admin/app';
import { randomUUID } from 'node:crypto';

// Import your downloaded service account JSON file
import serviceAccount from '../service-account.json' with { type: 'json' };

// Initialize the Firebase Admin App
initializeApp({
  credential: cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  }),
});



// Register feature routers here when application implementation begins.
export const apiRouter = Router();
export const db = getFirestore();

apiRouter.post('/toDo', async (_req, res) => {
  console.log("recieved todo create/update request");
  let body = _req.body

  if (!isCreateTodoBody(body)) {
      res.status(400);
  }

  const id = randomUUID();

  await db.collection("todos").doc(id).create(body);
  
  console.log(body.title);
  res.sendStatus(204);
    
});

apiRouter.get("/getAll", async (_req, res) => {
  console.log("Recieved request for all todos");

  const snapshot = await db.collection("todos").get();

  const todos = snapshot.docs.map(doc => ({
  ...doc.data(),
  id: doc.id,
  }));

  res.status(200).json(todos);
    
})


apiRouter.patch("/toDo", async(_req, res) => {
  console.log("Need to update item")
  let body = _req.body

  if (!isUpdateTodoBody(body)) {
      res.status(400);
  }

  await db.collection("todos").doc(body.id).update({
    completed: body.completed});

  res.sendStatus(200);

})