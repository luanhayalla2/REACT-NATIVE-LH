import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

export const addDocument = async (collectionName: string, data: any) => {
  try {
    const colRef = collection(db, collectionName);
    const payload = { ...data };
    // Sempre adiciona timestamp do servidor (ignora Date() do cliente)
    payload.createdAt = serverTimestamp();
    const docRef = await addDoc(colRef, payload);
    console.log(`✅ [Firestore] Adicionado em "${collectionName}" com ID: ${docRef.id}`);
    return docRef.id;
  } catch (error: any) {
    const msg = error?.message || 'Erro desconhecido';
    console.error(`❌ [Firestore] Erro ao adicionar em "${collectionName}":`, msg);
    throw error;
  }
};

export const getDocuments = async (collectionName: string) => {
  try {
    const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    console.log(`✅ [Firestore] Carregados ${docs.length} documentos de "${collectionName}"`);
    return docs;
  } catch (error: any) {
    const msg = error?.message || 'Erro desconhecido';
    console.error(`❌ [Firestore] Erro ao carregar "${collectionName}":`, msg);
    throw error;
  }
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    console.log(`✅ [Firestore] Atualizado "${collectionName}/${id}"`);
  } catch (error: any) {
    const msg = error?.message || 'Erro desconhecido';
    console.error(`❌ [Firestore] Erro ao atualizar "${collectionName}/${id}":`, msg);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log(`✅ [Firestore] Deletado "${collectionName}/${id}"`);
  } catch (error: any) {
    const msg = error?.message || 'Erro desconhecido';
    console.error(`❌ [Firestore] Erro ao deletar "${collectionName}/${id}":`, msg);
    throw error;
  }
};

export default null;
