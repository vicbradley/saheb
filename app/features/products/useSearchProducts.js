import MiniSearch from "minisearch";

const useSearchProducts = (products, searchParams) => {
  const miniSearchConfig = {
    fields: ["name", "desc", "storeName"],
    storeFields: ["id", "name", "price", "stock", "desc", "image", "storeName", "storeId"],
  };

  let miniSearch = new MiniSearch(miniSearchConfig);

  miniSearch.addAll(products);

  const results = miniSearch.search(searchParams);

  return results;
};

export default useSearchProducts;
