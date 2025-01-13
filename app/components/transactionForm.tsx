import React, { useState, useEffect } from 'react';

interface TransactionProps {
  userId: string;
}

const Transaction: React.FC<TransactionProps> = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('credit');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toISOString().split('T')[1].slice(0, 5));
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions when the component loads
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/transactions/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch transactions');
        }
      } catch (err) {
        setError('An error occurred while fetching transactions');
      }
    };

    fetchTransactions();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData = {
      user_id: userId,
      amount,
      type: transactionType,
      title,
      date,
      time,
    };

    // Call backend API to add the transaction
    try {
      const response = await fetch('http://localhost:8000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        // After successfully adding the transaction, reset the form fields and refresh the transaction list
        setAmount('');
        setTransactionType('credit');  // Reset to default
        setTitle('');
        setDate(new Date().toISOString().split('T')[0]);
        setTime(new Date().toISOString().split('T')[1].slice(0, 5));

        // Refresh the transaction list
        const updatedTransactions = await fetch(`http://localhost:8000/api/transactions/${userId}`);
        const data = await updatedTransactions.json();
        setTransactions(data);
      } else {
        const errorData = await response.json();
        console.error('Error adding transaction:', errorData.error);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left Container: Transaction Form */}
      <div className="w-full lg:w-1/2 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-white text-2xl mb-4">Transaction Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          />
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>

          <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded"
        />

          <div className="flex space-x-4">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 bg-gray-700 text-white border border-gray-600 rounded"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="p-2 bg-gray-700 text-white border border-gray-600 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right Container: Transaction History */}
      <div className="w-full lg:w-1/2 p-6 bg-gray-800 rounded-lg mt-6 lg:mt-0">
        <h2 className="text-white text-2xl mb-4">Transaction History</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="overflow-y-auto max-h-[400px]"> {/* Fixed height and scrollable */}
          <table className="w-full table-auto text-white">
            <thead>
              <tr>
                <th className="p-2 border-b">Amount</th>
                <th className="p-2 border-b">Type</th>
                <th className="p-2 border-b">Title</th>
                <th className="p-2 border-b">Date</th>
                <th className="p-2 border-b">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction: any) => (
                  <tr
                    key={transaction.id}
                    className={transaction.type === 'credit' ? 'bg-green-600' : 'bg-red-600'}
                  >
                    <td className="p-2">{transaction.date}</td>
                    <td className="p-2">{transaction.time}</td>
                    <td className="p-2">{transaction.type}</td> {/* Display 'type' */}
                    <td className="p-2">{transaction.title}</td>
                    <td className="p-2">{transaction.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-2 text-center">
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
