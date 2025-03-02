import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit, FaCross } from 'react-icons/fa';
import axios from 'axios';

interface TransactionProps {
  userId: string;
}

interface Transaction {
  id: number;
  user_id: string;
  user_name: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Partially Paid';
  type: 'credit' | 'debit';
  title: string;
  date: string;
  time: string;
}

const TransactionComponent: React.FC<TransactionProps> = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [editing, setIsEditing] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: 'date',
    direction: 'asc',
  });

  const updateDateTime = (): void => {
    if (editing) return; // Prevent updates when editing
  
    const dateInUTC = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
  
    const formattedDate = dateInUTC.toLocaleDateString('en-IN', dateOptions);
    const formattedTime = dateInUTC.toLocaleTimeString('en-IN', timeOptions);
  
    const [day, month, year] = formattedDate.split('/');
    const [hours, minutes] = formattedTime.split(':');
  
    setDate(`${year}-${month}-${day}`);
    setTime(`${hours}:${minutes}`);
  };
  
  useEffect(() => {
    if (!editing) {
      updateDateTime();
      const interval = setInterval(updateDateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [editing]);
  
  

  // Fetch Transactions
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/transactions/${userId}`);
      setTransactions(response.data);
      console.log("i got from back to front ",transactions);
      setFilteredTransactions(response.data); // Set default filtered list to all transactions
      console.log("i got from back to front again ", filteredTransactions);
    } catch (err) {
      setError('An error occurred while fetching transactions');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);


  // Handle Edit submission
  const handleUpdate = async (e: React.FormEvent) => {
    if (confirm("Update the transaction?")) {
      const transactionData = {
        // user_id: userId,
        transaction_id: transactionId,
        amount,
        status: paymentStatus,
        type: transactionType,
        title,
        date,
        time,
      };
      try {
        const response = await axios.put(`http://localhost:8000/api/transactions/${transactionId}`, transactionData);

        if (response.status === 200) {
          setAmount('');
          setTransactionType('');
          setPaymentStatus('');
          setTitle('');
          fetchTransactions();
          setIsEditing(false);
        } else {
          setError('Failed to add transaction');
        }
      } catch (error) {
        setError('Error adding transaction');
      }
    }
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dateInUTC = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const formattedDate = dateInUTC.toLocaleDateString('en-CA', dateOptions).toString().split('T')[0];

    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    const formattedTime = dateInUTC.toLocaleTimeString('en-GB', timeOptions);

    setDate(formattedDate); // YYYY-MM-DD
    setTime(formattedTime); // HH:mm

    console.log("date posting to database is ",formattedDate);

    const transactionData = {
      user_id: userId,
      transaction_id: transactionId,
      amount,
      status: paymentStatus,
      type: transactionType,
      title,
      date: formattedDate,
      time: formattedTime,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/transactions', transactionData);

      if (response.status === 200) {
        setAmount('');
        setTransactionType('');
        setPaymentStatus('');
        setTitle('');
        fetchTransactions();
        setIsEditing(false);
      } else {
        setError('Failed to add transaction');
      }
    } catch (error) {
      setError('Error adding transaction');
    }
  };

  // Handle Delete
  const handleDelete = async (transactionId: number) => {
    if (confirm('Delete the transaction?')) {
      try {
        await axios.delete(`http://localhost:8000/api/transactions/${transactionId}`);
        setFilteredTransactions(prev => prev.filter(transaction => transaction.id !== transactionId));
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  // Handle Edit
  const handleEdit = (id: number, amt: number, type: string, title: string, date: string, time: string, status: string) => {
    const formattedDate = date.split('T')[0]; 
  
    setTransactionId(id);
    setAmount(String(amt));
    setTransactionType(type);
    setTitle(title);
    setDate(formattedDate); 
    setTime(time);
    setPaymentStatus(status);
    setIsEditing(true);
  };
  

  // Handle Sorting
  const handleSort = (key: keyof Transaction) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction: newDirection });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      if (a[key] < b[key]) return newDirection === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredTransactions(sortedTransactions);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Transaction Form */}
      <div className="w-full lg:w-2/5 p-6 bg-gray-800">
        <h2 className="text-white text-xl mb-4">Transaction Form</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={(e) => { e.preventDefault(); editing ? handleUpdate(e) : handleSubmit(e); }} className='space-y-4'>

          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 bg-gray-700 text-white rounded" required />

          <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="w-full p-2 bg-gray-700 text-white rounded" required>
            <option value="" disabled>Select payment status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially paid</option>
          </select>

          <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} className="w-full p-2 bg-gray-700 text-white rounded" required>
            <option value="" disabled>Select payment type</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>

          <div className="flex space-x-4">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 bg-gray-700 text-white border border-gray-600 rounded text-sm lg:text-base" />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="p-2 bg-gray-700 text-white border border-gray-600 rounded text-sm lg:text-base" />
          </div>

          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-gray-700 text-white rounded" required />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">{editing ? 'Update' : 'Submit'}</button>
          {editing && (
            <button
              type="button"
              className="w-full p-2 bg-red-500 text-white rounded"
              onClick={() => {
                setAmount('');
                setTransactionType('');
                setPaymentStatus('');
                setTitle('');
                setDate('');
                setTime('');
                setTransactionId(null);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Transaction History */}
      <div className="w-full lg:w-3/5 p-6 bg-gray-800">
        <h2 className="text-white text-xl mb-4">Transaction History</h2>
        <table className="w-full border-collapse border border-gray-700 text-white">
          <thead>
            <tr>
              {['ID', 'Amount', 'Type', 'Title', 'Date', 'Time', 'Status', 'Action'].map((col, i) => (
                <th key={i} className="p-4 border border-gray-700 text-center cursor-pointer" onClick={() => handleSort(col.toLowerCase() as keyof Transaction)}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => (
              <tr key={transaction.id} className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}>
                <td className="p-4 border border-gray-700 text-center">{transaction.id}</td>
                <td className="p-4 border border-gray-700 text-center">{transaction.amount}</td>
                <td className="p-4 border border-gray-700 text-center">{transaction.type}</td>
                <td className="p-4 border border-gray-700 text-center">{transaction.title}</td>
                <td className="p-4 border border-gray-700 text-center">
                  {(() => {
                    const dateParts = transaction.date.split('T')[0].split('-');
                    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                  })()}
                </td>
                <td className="p-4 border border-gray-700 text-center">{transaction.time.slice(0, 5)}</td>
                <td className="p-4 border border-gray-700 text-center">{transaction.status}</td>
                <td className="p-4 border border-gray-700 text-center flex gap-4">
                  <button onClick={() => handleDelete(transaction.id)} className="text-red-500"><FaTrashAlt /></button>
                  <button onClick={() => handleEdit(transaction.id, transaction.amount, transaction.type, transaction.title, transaction.date, transaction.time, transaction.status)} className="text-blue-500"><FaEdit /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionComponent;