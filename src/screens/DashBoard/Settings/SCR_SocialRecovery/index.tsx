import React from 'react';
import { Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  DashBoardHeader,
  NodataActivityView,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import { style } from './style';

const SocialRecovery: React.FC<any> = () => {
  const { Common, Gutters, Layout, Fonts, Images, Colors } = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <View style={Common.containerFillWithSmallHPadding}>
        <DashBoardHeader
          leftImage={Images.ic_back}
          rightImage={Images.ic_round_info}
          rightImageStyle={style(Gutters, Layout).headerRightImage}
          onPressLeftImage={() => {
            navigation.goBack();
          }}
          onPressRightImage={() => {}}
        />

        <Text style={[Fonts.titleLarge, Gutters.smallTMargin]}>
          {t('setting:scr_title_social_recovery')}
        </Text>

        <View style={Gutters.mediumVMargin}>
          <Text style={[Fonts.textOpacityRegularBold, Gutters.smallBMargin]}>
            {t('setting:guarding_accounts')}
          </Text>
          <Text style={Fonts.textOpacityRegular}>
            {t('setting:social_recovery_description')}
          </Text>
        </View>

        <View style={style(Gutters, Layout, Colors).noDataContainer}>
          <NodataActivityView
            text={t('setting:no_accounts_yet')}
            iconPath={Images.ic_empty_activity}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default SocialRecovery;
