import ReedSolomonErasure from 'algorithms/reedSolomonErasure.js';
import * as reedSolomonErasureCore from 'algorithms/reedSolomonErasureCore.js';

import EncryptionService from './EncryptionService';

export const RsDecode = async (fileData: string | any[]) => {
  try {
    const tempObj = new ReedSolomonErasure(reedSolomonErasureCore);
    let shardSize = 0;
    let DATA_SHARDS = 0;
    let PARITY_SHARDS = 0;
    let filteredData;

    if (fileData.length > 0) {
      const object = JSON.parse(
        await EncryptionService().decrypt(JSON.parse(fileData[0])),
      );

      shardSize = object.shard_size;
      DATA_SHARDS = object.data_shards;
      PARITY_SHARDS = object.parity_shards;
    }
    let f_data = new Array(shardSize).fill(0);

    let received = Array(DATA_SHARDS + PARITY_SHARDS).fill(f_data.toString());
    let arrayShardsAvailable = new Array(DATA_SHARDS + PARITY_SHARDS).fill(
      false,
    );
    for (let i = 0; i < DATA_SHARDS + PARITY_SHARDS; i++) {
      let data =
        fileData[i] &&
        JSON.parse(await EncryptionService().decrypt(JSON.parse(fileData[i])));
      if (data) {
        received[data?.position] = data?.data;
        arrayShardsAvailable[data?.position] = true;
      }
    }
    const combinedString = received.join(',');
    const numberStrings = combinedString.split(',');
    const numberArray = numberStrings.map(numberString =>
      // eslint-disable-next-line radix
      parseInt(numberString),
    );
    let u8 = Uint8Array.from(numberArray);

    const result_test = tempObj.reconstruct(
      u8,
      DATA_SHARDS,
      PARITY_SHARDS,
      arrayShardsAvailable,
    );

    if (result_test === 0) {
      let unfilteredData = new Int8Array(u8).slice(0, shardSize * DATA_SHARDS);
      let removeTempDataFrom = unfilteredData.length - 1;
      while (true) {
        if (unfilteredData[removeTempDataFrom] !== 0) {
          removeTempDataFrom += 1;
          break;
        }
        removeTempDataFrom--;
      }
      filteredData = Buffer.from(
        new Int8Array(unfilteredData).slice(0, removeTempDataFrom),
      )
        .toString()
        .trim();
    }
    return { result_test, recoveredSeed: filteredData };
  } catch (error) {
    return JSON.stringify({});
  }
};
