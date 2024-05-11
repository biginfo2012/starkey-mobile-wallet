import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { FlatList, Linking, View } from 'react-native';
import { useSelector } from 'react-redux';

import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import { DeviceMetrics } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import { ActivityItemInterface } from 'types/apiResponseInterfaces';

import { ActivityIndicatorLoader, BorderButton } from '..';
import ActivityFilterControlView from '../ActivityFilterControlView/ActivityFilterControlView';
import ActivityItem from '../ActivityItem/ActivityItem';
import HorizontalSeparatorView from '../HorizontalSeparatorView/HorizontalSeparatorView';
import NodataActivityView from '../NodataActivityView/NodataActivityView';
import { ActivityListHandleType } from './ActivityListView.types';
import { style } from './styles';

/**
ActivityListView Component
This component is a custom FlatList-based view that displays a list of activity items.
It is designed to be used in the context of a wallet or transaction history screen, where a list of activities
related to specific tokens or assets is presented.
*/

type Props = {
  tokenList: ActivityItemInterface[];
  onPressFilter: () => void;
  tokenType: string;
  onPressItem: (item: ActivityItemInterface) => void;
  walletAddress: string;
  shouldShowLoader: boolean;
  shouldShowNoData: boolean;
  shouldShowBalance?: boolean;
};

const ActivityListView = forwardRef<ActivityListHandleType, Props>(
  (props, ref) => {
    const {
      tokenList,
      onPressFilter,
      tokenType,
      onPressItem,
      walletAddress,
      shouldShowLoader,
      shouldShowBalance,
      shouldShowNoData,
    } = props;

    const { Images, Gutters } = useTheme();

    const [filterData, setFilterData] = useState(tokenList);

    const [filterObj, setFilterObj] = useState([]);

    const currentTokenInfo = useSelector((state: RootState) => {
      return state.wallet.data.currentSelectedToken;
    });

    useEffect(() => {
      setFilterData(tokenList);
    }, [tokenList]);

    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    useImperativeHandle(ref, () => ({
      applySortFilter(obj, type: 'filter' | 'clearFilter') {
        if (type === 'filter') {
          setFilterObj(obj);
        } else if (type === 'clearFilter') {
          setFilterObj([]);
        }
      },
    }));

    useUpdateEffect(() => {
      let tokenListCopy = [...tokenList];

      if (filterObj.length !== 0) {
        tokenListCopy = tokenListCopy.filter(item =>
          filterObj.some(networksItem => networksItem.id === item.id),
        );
      }

      setFilterData([...tokenListCopy]);
    }, [filterObj]);

    const activityListArray = useMemo(() => {
      return filterData;
    }, [filterData]);

    return (
      <>
        <ActivityFilterControlView
          title={t('wallet:activity')}
          onPressFilter={onPressFilter}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />

        <FlatList
          scrollEnabled={false}
          data={activityListArray}
          keyExtractor={(item, index) => item?.blockHash + index}
          bounces={false}
          renderItem={({ item }: { item: ActivityItemInterface }) => (
            <ActivityItem
              item={item}
              walletAddress={walletAddress}
              tokenType={tokenType}
              onPress={() => {
                onPressItem(item);
              }}
              shouldShowBalance={shouldShowBalance}
            />
          )}
          ListFooterComponent={
            !shouldShowLoader &&
            activityListArray?.length !== 0 && (
              <View
                style={
                  DeviceMetrics.hasNotch
                    ? style(Gutters).bottomViewTiny
                    : style(Gutters).bottomView
                }
              >
                {currentTokenInfo?.explorerAccountURL && (
                  <BorderButton
                    text={t('wallet:view_full_history_on_explorer')}
                    onPress={() => {
                      Linking.openURL(
                        currentTokenInfo?.explorerAccountURL?.replace(
                          '$tx',
                          walletAddress,
                        ),
                      );
                    }}
                  />
                )}
              </View>
            )
          }
        />
        {shouldShowLoader && !activityListArray?.length && (
          <ActivityIndicatorLoader
            size="large"
            loaderStyle={style(Gutters).loader}
          />
        )}
        {shouldShowNoData && activityListArray?.length === 0 && (
          <NodataActivityView
            text={t('wallet:no_activities_yet')}
            iconPath={Images.ic_empty_activity}
          />
        )}
      </>
    );
  },
);

ActivityListView.defaultProps = {
  shouldShowBalance: false,
};

export default ActivityListView;
