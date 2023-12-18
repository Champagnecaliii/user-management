import React, { useContext, useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { firestore } from './firebaseConfig';
import { auth } from './firebaseConfig';
import { AuthContext } from './AuthContext';
import { signOut } from 'firebase/auth';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const UserManagementCom = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        console.log("userColl: ", usersCollection)
        console.log("usersData: ", usersData)
        console.log("usersSnapshot: ", usersSnapshot)

        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlock = async (userId) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, { status: 'blocked' });

      // Optionally, sign out the user if they block themselves
      // const { currentUser } = useAuth();
      if (currentUser?.uid === userId) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Error blocking user:', error.message);
    }
  };

  const handleUnblock = async (userId) => {
    try {
      const userRef = doc(firestore, 'users', String(userId));
      const userDoc = await getDoc(userRef);

      // console.log('userRef', userRef);
      // console.log('userDoc', userDoc.exists());

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.status === 'blocked') {
          await updateDoc(userRef, { status: 'active' });

          // Optionally, sign out the user if they unblock themselves
          // const { currentUser } = useAuth();
          if (currentUser?.uid === userId) {
            await signOut(auth);
          }

          console.log('User unblocked successfully');
        } else {
          console.error('Error unblocking user: User is not blocked');
        }
      } else {
        console.error('Error unblocking user: Document not found');
      }
    } catch (error) {
      console.error('Error unblocking user:', error.message);
    }
  };
  
  
  const handleDelete = async (userId) => {
    try {
      const userRef = doc(firestore, 'users', String(userId));
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        // Optionally, sign out the user if they delete themselves
        // const { currentUser } = useAuth();
        if (currentUser?.uid === userId) {
          await signOut(auth);
        }

        await deleteDoc(userRef);
      } else {
        console.error('Error deleting user: Document not found');
      }
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };
  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allUserIds = users.map((user) => user.id);
      setSelectedUserIds(allUserIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prevSelectedUserIds) => {
      if (prevSelectedUserIds.includes(userId)) {
        return prevSelectedUserIds.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUserIds, userId];
      }
    });
  };

  const handleBlockSelected = async () => {
    try {
      for (const userId of selectedUserIds) {
        await handleBlock(userId);
      }
    } catch (error) {
      console.error('Error blocking selected users:', error.message);
    } finally {
      // Optionally, perform any cleanup or additional actions after blocking selected users
    }
  };

  const handleUnblockSelected = async () => {
    try {
      for (const userId of selectedUserIds) {
        await handleUnblock(userId);
      }
    } catch (error) {
      console.error('Error unblocking selected users:', error.message);
    } finally {
      // Optionally, perform any cleanup or additional actions after unblocking selected users
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const userId of selectedUserIds) {
        await handleDelete(userId);
      }
    } catch (error) {
      console.error('Error deleting selected users:', error.message);
    } finally {
      // Optionally, perform any cleanup or additional actions after deleting selected users
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="toolbar">
        <Button variant="danger" onClick={handleBlockSelected}>
          Block
        </Button>
        <Button variant="success" onClick={handleUnblockSelected}>
          Unblock
        </Button>
        <Button variant="danger" onClick={handleDeleteSelected}>
          Delete
        </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedUserIds.length === users.length}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Registration Time</th>
            <th>Last Login</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
            <tr key={user.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  onChange={() => handleCheckboxChange(user.id)}
                  checked={selectedUserIds.includes(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.registrationTime}</td>
              <td>{user.lastLogin}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => handleBlock(user.id)}>Block</button>
                <button onClick={() => handleUnblock(user.id)}>Unblock</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          )})}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagementCom;
