const TransactionHistory = ({transactions}) => {
  return (
    <div>
      {transactions.length > 0 && (
        <div className="w-[95%] mx-auto p-3 mb-3 mt-10 bg-white border border-gray-200 rounded-lg shadow">
          <div className="mb-2">
            <p className="text-lg lg:text-2xl font-bold">Daftar Transaksi</p>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="bg-base-200">
                  <th>Id Transaksi</th>
                  <th>Daftar Produk</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th>Total Harga</th>
                  <th></th>
                  <th>Nama Toko</th>
                  <th></th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr className="hover" key={transaction.transactionId}>
                    <td>{transaction.transactionId}</td>
                    <td colSpan={4}>
                      <div className="">
                        {transaction.products.map((product, index) => (
                          <div key={index} className="mt-1">
                            {index + 1}. {product.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td colSpan={2}>Rp. {Intl.NumberFormat("id-ID").format(transaction.totalPrice)}</td>
                    <td colSpan={2}>{transaction.storeName}</td>
                    <td>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">{transaction.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
