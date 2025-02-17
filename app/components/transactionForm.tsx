import React, { useState, useEffect } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import axios, { AxiosResponse } from 'axios';

interface TransactionProps {
  userId: string;
}

interface Transaction {
  id: number;
  user_id: string;
  user_name: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'partially paid';
  type: 'credit' | 'debit';
  title: string;
  date: string;
  time: string;
}


const Transaction: React.FC<TransactionProps> = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string }>({
    key: 'date',
    direction: 'asc',
  });

  // Function to get current date and time in IST
  const updateDateTime = () => {
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
    updateDateTime(); // Set initial values
    const interval = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/transactions/${userId}`);
        console.log(response.data); // Add this line to check if `status` is coming correctly
        setTransactions(response.data);
        setFilteredTransactions(response.data); // Set default filtered list to all transactions
      } catch (err) {
        setError('An error occurred while fetching transactions');
      }
    };
  
    fetchTransactions();
  }, [userId]);

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

    const transactionData = {
      user_id: userId,
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

        const updatedTransactions = await axios.get(`http://localhost:8000/api/transactions/${userId}`);
        setTransactions(updatedTransactions.data);
        setFilteredTransactions(updatedTransactions.data);
      } else {
        setError('Failed to add transaction');
      }
    } catch (error) {
      setError('Error adding transaction');
    }
  };

  const handleSort = (key: keyof Transaction) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction: newDirection });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue < bValue) return newDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredTransactions(sortedTransactions);
  };


  const handleDelete = (transactionId: number) => {
    if (confirm("Delete the transaction?") == true) {
      // Remove transaction from frontend state
      setFilteredTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== transactionId)
      );

      // Delete the transaction from the backend
      axios
        .delete(`http://localhost:8000/api/transactions/${transactionId}`)
        .then((response: AxiosResponse) => {
          console.log('Transaction deleted successfully:', response.data);
        })
        .catch((error) => {
          console.error('Error deleting transaction:', error);
        });
    } else {
      // do nothing
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left Container: Transaction Form */}
      <div className="w-full lg:w-1/2 p-6 bg-gray-800 lg">
        <h2 className="text-white text-xl lg:text-2xl mb-4">Transaction Form</h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded text-sm lg:text-base"
          />
  
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded text-sm lg:text-base" required
          >
            <option value="" disabled>Select payment status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially paid</option>
          </select>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded text-sm lg:text-base" required
          >
            <option value="" disabled>Select payment type</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded text-sm lg:text-base"
          />
          <div className="flex space-x-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 bg-gray-700 text-white border border-gray-600 rounded text-sm lg:text-base"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="p-2 bg-gray-700 text-white border border-gray-600 rounded text-sm lg:text-base"
            />
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded text-sm lg:text-base"
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Right Container: Transaction History */}
      <div className="w-full lg:w-1/2 p-6 bg-gray-800 lg mt-6 lg:mt-0">
        <h2 className="text-white text-xl lg:text-2xl mb-4">Transaction History</h2>
        <div className="overflow-y-auto max-h-[400px]">
          <table className="w-full table-auto border-collapse border border-gray-700 text-white text-sm lg:text-base">
            <thead className="bg-gray-900 sticky top-0 z-10">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="p-4 border border-gray-700 text-left text-center cursor-pointer"
                >
                  #
                </th>
                <th
                  onClick={() => handleSort('amount')}
                  className="p-4 border border-gray-700 text-left text-center cursor-pointer"
                >
                  Amount
                </th>
                <th
                  onClick={() => handleSort('type')}
                  className="p-4 border border-gray-700 text-left text-center cursor-pointer"
                >
                  Type
                </th>
                <th className="p-4 border border-gray-700 text-left text-center cursor-pointer">
                  Title
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="p-4 border border-gray-700 text-left text-center cursor-pointer"
                >
                  Date
                </th>
                <th className="p-4 border border-gray-700 text-left text-center cursor-pointer">
                  Time
                </th>

                <th
                  onClick={() => handleSort('status')}
                  className="p-4 border border-gray-700 text-left text-center cursor-pointer"
                >
                  Status
                </th>

                <th className="p-4 border border-gray-700 text-left text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction: Transaction, index: number) => (
                  <tr
                    key={transaction.id}
                    className={`text-center ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}`}
                  >
                    <td className="p-4 border border-gray-700">{index + 1}</td>
                    <td className="p-4 border border-gray-700">{transaction.amount}</td>
                    <td
                      className={`p-4 border border-gray-700 ${transaction.type === 'credit'
                        ? 'text-green-500 font-bold'
                        : 'text-red-500 font-bold'
                        }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </td>
                    <td className="p-4 border border-gray-700">{transaction.title}</td>
                    <td className="p-4 border border-gray-700">
                      {(() => {
                        const dateParts = transaction.date.split('T')[0].split('-');
                        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                      })()}
                    </td>
                    <td className="p-4 border border-gray-700">{transaction.time}</td>
                    <td className="p-4 border border-gray-700">{transaction.status}</td>
                    <td className="p-4 border border-gray-700">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center border border-gray-700 bg-gray-800"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
