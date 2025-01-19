import React, { useState, useEffect } from 'react';

interface TransactionProps {
  userId: string;
}

const Transaction: React.FC<TransactionProps> = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('credit');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  // Update date and time every second
  useEffect(() => {
    updateDateTime(); // Set initial values
    const interval = setInterval(updateDateTime, 1000); // Update every second
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

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

    const dateInUTC = new Date();

    // Format the date to 'YYYY-MM-DD' in IST
    const dateOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    const formattedDate = dateInUTC.toLocaleDateString('en-CA', dateOptions).toString().split('T')[0];

    // Format the time to 'HH:mm' in IST
    const timeOptions: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    const formattedTime = dateInUTC.toLocaleTimeString('en-GB', timeOptions);

    // Set the formatted date and time
    setDate(formattedDate); // YYYY-MM-DD
    setTime(formattedTime); // HH:mm

    const transactionData = {
      user_id: userId,
      amount,
      type: transactionType,
      title,
      date: formattedDate,
      time: formattedTime,
    };

    try {
      const response = await fetch('http://localhost:8000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        // Reset form fields
        setAmount('');
        setTransactionType('credit');
        setTitle('');

        // Refresh the transactions list
        const updatedTransactions = await fetch(
          `http://localhost:8000/api/transactions/${userId}`
        );
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
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded text-sm lg:text-base"
          >
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
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded text-sm lg:text-base"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Right Container: Transaction History */}
      <div className="w-full lg:w-1/2 p-6 bg-gray-800 lg mt-6 lg:mt-0">
      <h2 className="text-white text-xl lg:text-2xl mb-4">Transaction History</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="overflow-y-auto max-h-[400px]">
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full table-auto border-collapse border border-gray-700 text-white text-sm lg:text-base">
              <thead className="bg-gray-900 sticky top-0 z-10">
                <tr>
                  <th className="p-4 border border-gray-700 text-left text-center">#</th>
                  <th className="p-4 border border-gray-700 text-left text-center">Amount</th>
                  <th className="p-4 border border-gray-700 text-left text-center">Type</th>
                  <th className="p-4 border border-gray-700 text-left text-center">Title</th>
                  <th className="p-4 border border-gray-700 text-left text-center">Date</th>
                  <th className="p-4 border border-gray-700 text-left text-center">Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction: any, index: number) => (
                    <tr
                      key={transaction.id}
                      className={`text-center ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                        }`}
                    >
                      <td className="p-4 border border-gray-700">{index + 1}</td>
                      <td className="p-4 border border-gray-700">{transaction.amount}</td>
                      <td
                        className={`p-4 border border-gray-700 ${transaction.type === 'credit'
                          ? 'text-green-500 font-bold'
                          : 'text-red-500 font-bold'
                          }`}
                      >
                        {transaction.type.charAt(0).toUpperCase() +
                          transaction.type.slice(1)}
                      </td>
                      <td className="p-4 border border-gray-700">{transaction.title}</td>
                      <td className="p-4 border border-gray-700">
                        {(() => {
                          const dateParts = transaction.date.split('T')[0].split('-'); // Split into [yyyy, mm, dd]
                          return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Return dd-mm-yyyy
                        })()}
                      </td>

                      <td className="p-4 border border-gray-700">{transaction.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
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
    </div>
  );
};

export default Transaction;
