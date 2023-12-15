import AddToCartBtn from "./AddToCartBtn";
import { useRouter } from "next/navigation";

const Product = (props) => {
  const { id, name, price, stock, image, storeId, storeName } = props.data;
  const { push } = useRouter();

  const trimTitle = (str) => {
    if (str.length > 35) {
      return str.substring(0, 35) + '...';
    } else {
      return str;
    }
  }

  const handleToStoreOnClick = (e) => {
    e.stopPropagation();
    push(`${storeId}`);
  };

  return (
    <div className="w-[80%] h-[60vh] lg:h-[80vh] mt-4 p-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" onClick={() => push(`${storeId}/product/${id}`)}>
      <div className="h-[65%] flex justify-center items-center">
        <img className="p-8 mx-auto w-[100%] h-[100%] rounded-t-lg object-cover" src={image} alt={name} />
      </div>
      <div className="px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{trimTitle(name)}</h5>
        <div className="flex items-center mt-2.5 mb-5">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <a onClick={handleToStoreOnClick} className="text-[#001a9d]">
              {storeName}
            </a>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">Stock: {stock}</span>
        </div>
        <div className="flex items-center justify-between">
        <span className="bg-blue-100 text-blue-800 text-sm sm:text-md md:text-md lg:text-base font-semibold p-2 rounded">Rp {Intl.NumberFormat("id-ID").format(price)}</span>

          {/* <span className="bg-blue-100 text-blue-800 text-md font-semibold p-2 rounded ">Rp {Intl.NumberFormat("id-ID").format(price)}</span> */}
          {/* <span className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">Rp {Intl.NumberFormat("id-ID").format(price)}</span> */}
          <AddToCartBtn productId={id} productPrice={price} storeId={storeId} productData={props.data} />
        </div>
      </div>
    </div>
  );
};

export default Product;
