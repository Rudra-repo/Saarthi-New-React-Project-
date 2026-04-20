// src/services/managementService.js
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

/**
 * Adds a new government scheme to Firestore.
 */
export async function addScheme(schemeData) {
  return await addDoc(collection(db, 'schemes'), {
    ...schemeData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

/**
 * Updates an existing scheme.
 */
export async function updateScheme(id, schemeData) {
  const ref = doc(db, 'schemes', id)
  return await updateDoc(ref, {
    ...schemeData,
    updatedAt: serverTimestamp()
  })
}

/**
 * Adds a new private/government job opportunity.
 */
export async function addJob(jobData) {
  return await addDoc(collection(db, 'jobs'), {
    ...jobData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

/**
 * Updates an existing job.
 */
export async function updateJob(id, jobData) {
  const ref = doc(db, 'jobs', id)
  return await updateDoc(ref, {
    ...jobData,
    updatedAt: serverTimestamp()
  })
}

/**
 * Deletes a record (Scheme or Job).
 */
export async function deleteRecord(type, id) {
  const collectionName = type === 'scheme' ? 'schemes' : 'jobs'
  return await deleteDoc(doc(db, collectionName, id))
}
