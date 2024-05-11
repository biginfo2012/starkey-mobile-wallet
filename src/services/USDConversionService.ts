import { store } from 'store/index';
import { UsdConversionApiBaseURL } from 'theme/Helper/constant';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import { getUSDPrice } from './apiActions';

const USDConversionService = () => {
  // Store the base URL for the API
  const API_BASE_URL = UsdConversionApiBaseURL;
  // Store the intervals for the price observer
  let intervals: NodeJS.Timeout[] = [];

  // Create a new AbortController
  const controller = new AbortController();

  // Create a function to fetch the USD price
  async function fetchUSDPrice({ item }: { item: ExistingNetworksItem[] }) {
    // Create a request config object
    const requestConfig = {
      // Set the ids to the coingeckoTokenIds of the item
      ids: Object.values(item)
        .map(entry => entry.coingeckoTokenId)
        .join(','),
      // Set the vs_currencies to USD
      vs_currencies: 'USD',
      // Include the 24hr change
      include_24hr_change: true,
    };

    // Call the API
    return await callUSDPriceConversionApi(requestConfig, item);
  }

  // Create a function to call the API
  const callUSDPriceConversionApi = async (
    requestConfig: {
      ids: string;
      vs_currencies: string;
      include_24hr_change: boolean;
    },
    item: ExistingNetworksItem[],
  ) => {
    // Create an array to store the USD values, short names, and 1 day price changes
    let usdValueAndShortNameArray = [];
    // Create a query param string from the request config
    const queryParam = new URLSearchParams(requestConfig).toString();
    try {
      // Obtain a reference to the AbortSignal
      const signal = controller.signal;

      // Make the API call
      const response = await fetch(`${API_BASE_URL}${queryParam}`, {
        signal,
      });

      // Get the data from the response
      const data = await response?.json();

      // Iterate through the item array
      for (let obj of item) {
        // Check if the data contains the USD price
        if (data[obj.coingeckoTokenId]?.usd) {
          // Push the USD value, short name, and 1 day price change to the array
          usdValueAndShortNameArray.push({
            usdAmount: data[obj.coingeckoTokenId]?.usd ?? 0,
            shortName: obj.shortName,
            oneDayUSDPriceChangePercentage:
              data[obj.coingeckoTokenId]?.usd_24h_change ?? 0,
          });
        }
      }
      // Return the array
      return usdValueAndShortNameArray;
    } catch (error) {
      // Log the error
      console.log('error', error);
      // Return an array with an error
      return [
        {
          error: 'something went wrong!!',
          shortName: 'error',
          usdAmount: 0,
          oneDayUSDPriceChangePercentage: 0,
        },
      ];
    }
  };

  // Create a function to start the USD price observer
  const startUSDPriceObserver = (item: ExistingNetworksItem[]) => {
    // Abort the controller
    controller.abort();
    // Dispatch the getUSDPrice action
    store.dispatch(
      getUSDPrice({
        item: item,
      }),
    );

    // Create a new interval
    const currentInterval = setInterval(() => {
      // Abort the controller
      controller.abort();
      // Dispatch the getUSDPrice action
      store.dispatch(
        getUSDPrice({
          item: item,
        }),
      );
    }, 60000);

    // Push the interval to the intervals array
    intervals.push(currentInterval);
  };

  // Create a function to remove listeners
  const removeListeners = () => {
    // Abort the controller
    controller.abort();
    // Iterate through the intervals array and clear them
    intervals.forEach(value => clearInterval(value));
    // Set the intervals array to an empty array
    intervals = [];
  };

  // Return the functions
  return { startUSDPriceObserver, fetchUSDPrice, removeListeners };
};

export default USDConversionService;
