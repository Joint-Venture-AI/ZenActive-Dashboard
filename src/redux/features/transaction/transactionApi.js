import { baseApi } from "../../api/baseApi";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransaction: builder.query({
      query: (type) => ({
        url: `/payment/earn?type=${type}`,
        method: "GET",
      }),
    }),
    getTotalEarnings: builder.query({
      query: () => "/payment/total-earn",
    }),
    getRecentTransactions: builder.query({
      query: ({ searchTerm, purchaseDate }) => {
        let queryParams = [];
        if (searchTerm)
          queryParams.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
        if (purchaseDate)
          queryParams.push(`purchaseDate=${encodeURIComponent(purchaseDate)}`);

        const queryString =
          queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

        return {
          url: `/payment${queryString}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetAllTransactionQuery,
  useGetTotalEarningsQuery,
  useGetRecentTransactionsQuery,
} = transactionApi;
