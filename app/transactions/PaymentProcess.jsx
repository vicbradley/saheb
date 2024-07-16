import { getUserInfo } from "@/app/logic/getUserInfo";
import { useCancelOrderItems } from "@/app/features/cart/useCancelOrderItems";

const PaymentProcess = ({cart}) => {
  const { mutate: cancelOrderItems } = useCancelOrderItems(getUserInfo().uid);

  const handleDelete = (transactionId) => {
    cancelOrderItems({ transactionId });
  };


  return (
    <div>
      {cart.paymentProcess.length > 0 && (
        <div className="w-[95%] mx-auto p-3 mb-3 mt-10 bg-white border border-gray-200 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <p className="text-lg lg:text-2xl font-bold">Proses Pembayaran</p>
              <span className="loading loading-dots loading-md ml-4"></span>
            </div>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.paymentProcess.map((order) => (
                  <tr className="hover" key={order.transactionId}>
                    <td>{order.transactionId}</td>
                    <td colSpan={4}>
                      <div className="">
                        {order.products.map((product, index) => (
                          <div key={index} className="mt-1">
                            {index + 1}. {product.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td colSpan={2}>Rp. {Intl.NumberFormat("id-ID").format(order.totalPrice)}</td>
                    <td colSpan={2}>{order.storeName}</td>
                    <td onClick={() => handleDelete(order.transactionId)}>
                      <p className="font-bold text-red-600 hover:underline cursor-pointer">Batalkan</p>
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

export default PaymentProcess;
