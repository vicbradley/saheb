import { getUserInfo } from "@/app/logic/getUserInfo";
import { useCartContext } from "@/app/context/Cart";
import { useCancelOrderItems } from "@/app/features/cart/useCancelOrderItems";

const PaymentProcess = () => {
  const { cart } = useCartContext();

  const {mutate: cancelOrderItems} = useCancelOrderItems(getUserInfo().uid);

  return (
    <div>
      <div className="divider p-3 mb-3"></div>
      {cart.productsBeingPaid.length > 0 && (
        <div className="w-[95%] mx-auto p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <p className="text-lg font-bold">Proses Pembayaran</p>
              <span className="loading loading-dots loading-md ml-4"></span>
            </div>
            <button className="btn btn-danger" onClick={cancelOrderItems}>
              Cancel
            </button>
          </div>
          {cart.productsBeingPaid.map((product) => (
            <div className="flex items-center p-3 mb-3" key={`${Math.floor(Math.random() * 100) + 1 + parseInt(product.price) + parseInt(product.amount)}`}>
              <div className="avatar">
                <div className="w-24 rounded-xl">
                  <img src={product.image} className="object-cover" />
                </div>
              </div>

              <div className="ml-3 ">
                <p className="font-extrabold">{product.name}</p>
                <p>Rp {Intl.NumberFormat("id-ID").format(product.price)}</p>
                <p>Jumlah : {product.amount}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.paidProducts.length > 0 && (
        <>
          <div className="w-[95%] mx-auto p-3 mb-3 bg-white border border-gray-200 rounded-lg shadow">
            <p className="text-xl font-bold">Pesanan Selesai</p>
            {cart.paidProducts.map((product) => (
              <div className="flex items-center p-3 mb-3" key={`${Math.floor(Math.random() * 100) + 1 + parseInt(product.price) + parseInt(product.amount)}`}>
                <div className="avatar">
                  <div className="w-24 rounded-xl">
                    <img src={product.image} className="object-cover" />
                  </div>
                </div>

                <div className="ml-3 ">
                  <p className="font-extrabold">{product.name}</p>
                  <p>Rp {Intl.NumberFormat("id-ID").format(product.price)}</p>
                  <p>Jumlah : {product.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentProcess;


