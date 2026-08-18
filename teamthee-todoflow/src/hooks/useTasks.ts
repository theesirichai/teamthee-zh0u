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

    setLoading(true);
    console.log("🔄 Starting Task Listener for UID:", userId);
    
    // Simple query first to ensure we get data even without complex indexes
    const qSimple = query(
      collection(db, 'tasks'),
      where('userId', '==', userId)
    );

    let unsubscribe: () => void;

    const setupListener = (q: any, isFallback: boolean = false) => {
      return onSnapshot(q, (snapshot) => {
        console.log(`✅ Snapshot received [${isFallback ? 'Fallback' : 'Primary'}]:`, snapshot.size, "items found for", userId);
        
        const taskList: Task[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Debug individual document if needed
          if (snapshot.size < 5) console.log("📄 Document:", doc.id, data);
          
          taskList.push({
            id: doc.id,
            ...data,
            priority: data.priority || 'medium',
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now()),
            updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : (data.updatedAt || Date.now()),
            dueDate: data.dueDate?.toMillis ? data.dueDate.toMillis() : data.dueDate,
          } as Task);
        });

        // Always sort in memory to be safe and consistent
        taskList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        setTasks([...taskList]);
        setLoading(false);
      }, (error) => {
        console.error("❌ Firestore Listener Error:", error.code, error.message);
        setLoading(false);
      });
    };

    unsubscribe = setupListener(qSimple); // Use simple query by default to ensure visibility

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
