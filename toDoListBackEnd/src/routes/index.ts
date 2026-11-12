import { Router } from 'express';
import { isCreateTodoBody, isUpdateTodoBody } from '../types/CreateToDo.js';
import { randomUUID } from 'node:crypto';
import { getFirestoreDb } from '../config/firestore.js';




// Register feature routers here when application implementation begins.
export const apiRouter = Router();
export const db = getFirestoreDb();

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