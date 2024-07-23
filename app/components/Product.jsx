import Image from "next/image";
import AddToCartBtn from "./AddToCartBtn";
import { useRouter } from "next/navigation";

const Product = (props) => {
  const { id, name, price, stock, image, storeId, storeName } = props.data;
  const { push } = useRouter();

  const trimTitle = (str) => {
    if (str.length > 35) {
      return str.substring(0, 35) + "...";
    } else {
      return str;
    }
  };

  const handleToStoreOnClick = (e) => {
    e.stopPropagation();
    push(`/${storeId}`);
  };

  return (
    <div className="w-[80%] h-[60vh] lg:h-[80vh] mt-10 lg:p-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className="h-[60%] lg:h-[60%] p-8 flex justify-center items-center rounded-t-lg cursor-pointer" onClick={() => push(`${storeId}/product/${id}`)}>
        <Image src={image} alt={name} width={250} height={100} />
      </div>
      <div className="px-5">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{trimTitle(name)}</h5>
        <div className="flex items-center mt-2.5 mb-5">
          <div className="flex items-center space-x-1 rtl:space-x-reverse">
            <a onClick={handleToStoreOnClick} className="text-[#001a9d] cursor-pointer">
              {storeName}
            </a>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">Stock: {stock}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="bg-blue-100 text-blue-800 text-sm sm:text-md md:text-md lg:text-base font-semibold p-2 rounded">Rp {Intl.NumberFormat("id-ID").format(price)}</span>
          <AddToCartBtn productData={props.data} />
        </div>
      </div>
    </div>
  );
};

export default Product;
