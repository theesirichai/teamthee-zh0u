import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Task, Priority } from '@/src/types';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        taskList.push({
          id: doc.id,
          ...data,
          priority: data.priority || 'medium',
          // Convert Firestore timestamps to numbers for easier handling in React
          createdAt: data.createdAt?.toMillis() || Date.now(),
          updatedAt: data.updatedAt?.toMillis() || Date.now(),
          dueDate: data.dueDate?.toMillis(),
        } as Task);
      });
      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addTask = async (title: string, dueDate?: number, priority: Priority = 'medium') => {
    if (!userId) return;
    await addDoc(collection(db, 'tasks'), {
      userId,
      title,
      completed: false,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      completed: !completed,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteTask = async (taskId: string) => {
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  return { tasks, loading, addTask, toggleTask, deleteTask };
}
