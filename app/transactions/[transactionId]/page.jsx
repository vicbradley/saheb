"use client";
import Loading from "@/app/components/Loading";
import { useFetchTransactionById } from "@/app/features/transaction/useFetchTransactionById";

const page = ({ params }) => {
  const { data: transaction, isLoading } = useFetchTransactionById(params.transactionId);

  if (isLoading) return <Loading />;

  return (
    <section className="bg-gray-50 mt-2">
      <div className="w-full p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl">
        <div className="flex flex-col space-y-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Id Transaksi : <mark className="px-2 text-white bg-blue-600 rounded dark:bg-blue-500">{params.transactionId}</mark>
          </h1>
          <div className="divider"></div>
        </div>

        <div className="text-base sm:text-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold">Waktu Transaksi </span>
            <span className="text-blue-600 font-bold">{transaction.transactionDate}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold">Nama Toko </span>
            <span className="text-blue-600 font-bold">{transaction.storeName}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold">Alamat Pengantaran </span>
            <span className="text-blue-600 font-bold">{transaction.address}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold">Nomor Telefon Terdaftar </span>
            <span className="text-blue-600 font-bold">{transaction.phoneNumber}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold">Penerima Paket </span>
            <span className="text-blue-600 font-bold">{transaction.recipientName}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <span className="font-semibold">Bukti Penerima </span>
            <img src={transaction.shipmentProof} alt="Bukti Penerima" className="w-80 h-auto" />
          </div>

          <p className="font-semibold">Daftar Pesanan</p>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full text-sm sm:text-base">
            <thead>
              <tr className="bg-base-200">
                <th className="text-sm sm:text-base">No</th>
                <th className="text-sm sm:text-base">Nama Produk</th>
                <th className="text-sm sm:text-base">Jumlah</th>
                <th className="text-sm sm:text-base">Harga</th>
                <th className="text-sm sm:text-base">Total</th>
              </tr>
            </thead>
            <tbody>
              {transaction.products.map((product, index) => (
                <tr className="hover" key={product.id}>
                  <td className="text-sm sm:text-base">{index + 1}</td>
                  <td className="text-sm sm:text-base">{product.name}</td>
                  <td className="text-sm sm:text-base">{product.quantity}</td>
                  <td className="text-sm sm:text-base">Rp. {Intl.NumberFormat("id-ID").format(product.price)}</td>
                  <td className="text-sm sm:text-base">Rp. {Intl.NumberFormat("id-ID").format(product.price * product.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold text-gray-900">
                <th colSpan={4} scope="row" className="px-6 py-3 text-sm sm:text-base">
                  Total Harga
                </th>
                <th className="text-sm sm:text-base text-blue-600 font-semibold">Rp. {Intl.NumberFormat("id-ID").format(transaction.totalPrice)}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
};

export default page;
