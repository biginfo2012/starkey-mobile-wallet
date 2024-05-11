import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  BorderButton,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  PhraseView,
  SafeAreaWrapper,
  SelectedPhraseView,
  WarningView,
} from 'components/index';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import { updateCreateUser, updateCurrentUser } from 'store/userInfo';
import { containsObject, shuffleArray } from 'theme/Helper/ArrayUtils';
import {
  colorPalette,
  filterObjectsWithBlankValue,
  getRandomIndex,
} from 'theme/Helper/common/Function';
import Variables from 'theme/Variables';
import { mockData } from 'theme/mockData';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

const VerifyRecoveryPhrase: React.FC<any> = () => {
  const { Common, Images, Gutters, Layout, Colors, Fonts } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();

  const { randomPhrase } = useRoute().params as any;

  const [seedPhraseArray, setSeedPhaArray] = useState<string[]>([]);

  const [shuffleSeedPhraseArray, setShuffleSeedPhraseArray] = useState<
    string[]
  >([]);

  const [isShowIncorrectPhrase, setIsShowIncorrectPhrase] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const [selectedPhrase, setSelectedPhrase] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const seedPhrase = useSelector((state: RootState) => {
    return state.wallet.data.seedPhrase;
  });

  const userData = useSelector((state: RootState) => {
    return state.userInfo.data;
  });

  useEffect(() => {
    if (seedPhrase) {
      setSeedPhaArray(seedPhrase.split(' '));
    }
  }, [seedPhrase]);

  useUpdateEffect(() => {
    const randomData = randomPhrase.map((item: any) => ({ ...item }));
    setSelectedPhrase(randomData);
    setShuffleSeedPhraseArray(shuffleArray(seedPhraseArray));
  }, [seedPhraseArray]);

  /*
Checks if the selected phrase is a match by comparing each character against the corresponding position
in the 'seedPhraseArray'.
*/
  const checkIsPhraseIsMatch = () => {
    const matchArray = selectedPhrase.map((_, index) => {
      return (
        seedPhraseArray[selectedPhrase[index].position] ===
        selectedPhrase[index].value
      );
    });
    setIsNextDisabled(matchArray.includes(false));
    setIsShowIncorrectPhrase(matchArray.includes(false));
  };

  /*
Checks object isExists or not and store data
*/
  const onSelectPhrasePress = (item: string) => {
    let isExists = false;
    selectedPhrase.forEach(itemTemp => {
      if (itemTemp.value === item) {
        isExists = true;
      }
    });
    if (!isExists) {
      for (let i = 0; i < selectedPhrase.length; i++) {
        if (selectedPhrase[i].value === '') {
          selectedPhrase[i].value = item;
          break;
        }
      }
      setSelectedPhrase([...selectedPhrase]);

      let filteredArray = filterObjectsWithBlankValue(selectedPhrase, 'value');

      if (filteredArray.length === 0) {
        checkIsPhraseIsMatch();
      }
    }
  };

  /*
Render seed phrase item
*/
  const renderPhraseItem = ({ item }) => (
    <PhraseView
      text={item}
      isDisabled={containsObject(item, selectedPhrase, 'value')}
      onPress={() => {
        setSelectedIndex(selectedIndex + 1);
        onSelectPhrasePress(item);
      }}
    />
  );

  /*
Render selected seed phrase item
*/
  const renderSelectedPhraseItem = ({ item, index }) => (
    <SelectedPhraseView
      text={item.value}
      borderColor={
        isShowIncorrectPhrase
          ? Colors.textError
          : selectedIndex === index
          ? Colors.primary
          : Colors.inputBackground
      }
      index={index + 1}
      position={item.position + 1}
    />
  );

  /*
Redirect To congratulations Screen and pass dynamic params and method for next screen
*/
  const updateUserInfo = () => {
    const user = {
      userName: userData.userName,
      userId: userData.currentUserId,
      isWalletFromSeedPhase: true,
      profileIcon: colorPalette[getRandomIndex(colorPalette.length)],
      isPrimary: true,
    };

    dispatch(updateCreateUser({ data: [user] }));
    dispatch(updateCurrentUser({ data: user }));
    navigation.push(ScreenNames.ActionComplete, {
      title: t('onBoarding:congratulations_title'),
      subTitle: t('onBoarding:congratulations_subTitle'),
      redirectToNextScreen: () => {},
      shouldShowAnimation: true,
    });
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          title={t('onBoarding:verifyRecoveryPhrase_title')}
          subTitle={t('onBoarding:verifyRecoveryPhrase_subTitle')}
          onPressNext={() => {
            updateUserInfo();
          }}
          isNextDisabled={isNextDisabled}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <View>
          <FlatList
            numColumns={3}
            bounces={false}
            data={selectedPhrase}
            renderItem={renderSelectedPhraseItem}
            columnWrapperStyle={[Layout.justifyContentBetween]}
            keyExtractor={item => item.value.toString()}
          />
        </View>
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
        {isShowIncorrectPhrase && (
          <>
            <View style={[Layout.row, Layout.alignItemsCenter]}>
              <Text style={[Fonts.textErrorTinyBold, Layout.fill]}>
                {t('onBoarding:incorrect_secret_recovery_phrase')}
              </Text>
              <BorderButton
                text={t('onBoarding:clear_all')}
                onPress={() => {
                  const randomData = randomPhrase.map(item => ({ ...item }));
                  setSelectedPhrase(randomData);
                  setIsShowIncorrectPhrase(false);
                  setSelectedIndex(0);
                }}
                btnStyle={style(Gutters).borderButton}
              />
            </View>
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
          </>
        )}
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
        <View>
          <FlatList
            columnWrapperStyle={[Layout.justifyContentBetween]}
            numColumns={4}
            bounces={false}
            data={shuffleSeedPhraseArray}
            renderItem={renderPhraseItem}
            keyExtractor={item => item.toString()}
          />
        </View>
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <WarningView warningArray={mockData.verifyRecoveryPhraseWarningArray} />
      </View>
    </SafeAreaWrapper>
  );
};

export default VerifyRecoveryPhrase;
