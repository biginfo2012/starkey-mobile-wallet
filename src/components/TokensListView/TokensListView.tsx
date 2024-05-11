import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { ImageSourcePropType, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import { t } from 'i18next';
import { RootState } from 'store/index';
import Variables from 'theme/Variables';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import HorizontalSeparatorView from '../HorizontalSeparatorView/HorizontalSeparatorView';
import SearchInputBox from '../SearchInputBox/SearchInputBox';
import WalletTokenItem from '../WalletTokenItem/WalletTokenItem';
import { TokenListHandleType } from './TokensListView.types';

type Props = {
  tokenList: ExistingNetworksItem[];
  onPressSort: () => void;
  testID: string;
  onPressRedirect: (obj: {}) => void;
  searchRightIcon?: ImageSourcePropType;
  shouldShowBalance?: boolean;
};

const TokensListView = forwardRef<TokenListHandleType, Props>((props, ref) => {
  const {
    tokenList,
    onPressSort,
    testID,
    onPressRedirect,
    searchRightIcon,
    shouldShowBalance,
  } = props;
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState<ExistingNetworksItem>([]);

  const [isChecked, setIsChecked] = useState(false);
  const [sortObj, setSortObj] = useState({});
  const [filterObj, setFilterObj] = useState([]);

  const config = useSelector((state: RootState) => state.userInfo.data.config);

  useUpdateEffect(() => {
    setIsChecked(config.shouldHideTokenBalance);
  }, [config.shouldHideTokenBalance]);

  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    applySortFilter(
      obj,
      type: 'sorting' | 'filter' | 'clearSorting' | 'clearFilter',
    ) {
      if (type === 'sorting') {
        setSortObj(obj);
      } else if (type === 'filter') {
        setFilterObj(obj);
      } else if (type === 'clearSorting') {
        setSortObj({});
      } else if (type === 'clearFilter') {
        setFilterObj([]);
      }
    },
  }));

  /*
This custom hook is used to apply to filtering and sorting operations to a 'tokenList' based on
the provided dependencies, such as 'searchText', 'sortObj', 'filterObj', and 'isChecked'.
The hook executes its effect function after the initial render and whenever any of the specified dependencies
change, allowing for dynamic updates to the 'filterData' state.
*/
  useUpdateEffect(() => {
    let tokenListCopy = [...tokenList];
    if (searchText.trim().length > 0) {
      tokenListCopy = tokenListCopy?.filter(function (item) {
        return (
          item?.subTitle
            ?.toLowerCase()
            .includes(searchText?.trim().toLowerCase()) ||
          item?.title.toLowerCase().includes(searchText?.trim().toLowerCase())
        );
      });
    }

    if (sortObj?.id === '1') {
      tokenListCopy = tokenListCopy.sort((a, b) => {
        if (a.isFavorite && !b.isFavorite) {
          return -1; // `a` comes before `b`
        } else if (!a.isFavorite && b.isFavorite) {
          return 1; // `b` comes before `a`
        } else {
          return 0; // No change in order
        }
      });
    } else if (sortObj?.id === '2') {
      tokenListCopy = tokenListCopy.sort((a, b) => b.amount - a.amount);
    } else if (sortObj?.id === '3') {
      tokenListCopy = tokenListCopy.sort((a, b) => a.amount - b.amount);
    }

    if (filterObj.length !== 0) {
      tokenListCopy = tokenListCopy.filter(item =>
        filterObj.some(
          networksItem => networksItem.networkId === item.networkId,
        ),
      );
    }

    if (isChecked) {
      tokenListCopy = tokenListCopy?.filter(obj => {
        let balance = (obj?.amount ?? 0) * (obj?.usdAmount ?? 0);
        // eslint-disable-next-line radix
        return parseInt(balance) >= 1;
      });
    }

    setFilterData([...tokenListCopy]);
  }, [searchText, sortObj, filterObj, isChecked, tokenList]);

  const tokenListArray = useMemo(() => {
    return filterData;
  }, [searchText, tokenList, filterData]);

  return (
    <>
      <SearchInputBox
        placeholder={t('common:Search')}
        onChangeText={text => {
          setSearchText(text);
        }}
        rightIcon={searchRightIcon}
        onPressSort={onPressSort}
      />
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
      <BottomSheetFlatList
        testID={testID}
        renderToHardwareTextureAndroid
        data={tokenListArray}
        keyExtractor={item => item.id}
        bounces={false}
        renderItem={({ item }: { item: ExistingNetworksItem }) => (
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={item?.title}
            testID={item?.title}
            onPress={() => {
              onPressRedirect(item);
            }}
          >
            <WalletTokenItem
              item={item}
              shouldShowBalance={shouldShowBalance}
            />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
    </>
  );
});

TokensListView.defaultProps = {
  searchRightIcon: undefined,
  shouldShowBalance: false,
};

export default TokensListView;
