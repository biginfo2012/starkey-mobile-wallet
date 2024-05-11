import React from 'react';
import { View, Text, Image } from 'react-native';

import useTheme from 'hooks/useTheme';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import HighlightedText from './HighlightedText';
import { style } from './style';

type Props = {
  item: Object;
  onPress: () => void;
};

const NotificationRawItem = (props: Props) => {
  const { item } = props;

  const { Layout, Gutters, Colors, Fonts, Images } = useTheme();

  return (
    <View
      style={[
        style(Gutters, Layout).rowContainer,
        {
          backgroundColor:
            item?.status === 'unread'
              ? applyOpacityToHexColor(Colors?.textPurple, 0.15)
              : applyOpacityToHexColor(Colors?.inputBackground, 0),
        },
      ]}
    >
      <Image source={Images.ic_avatar} style={style(Gutters, Layout).image} />

      <View style={style(Gutters, Layout).textContainer}>
        <HighlightedText
          text={item?.title}
          pattern={'[0-9]+ [A-Z]+|@[a-z0-9]+'}
        />
        <View style={[Layout.rowHCenter, style(Gutters, Layout).time]}>
          <Text style={[Fonts.textSmallTinyGrayOpacityRegular]}>
            {item?.timeAgo}
          </Text>
          {item?.isExpired && (
            <>
              <Text
                style={[
                  Fonts.textSmallTinyGrayOpacityRegular,
                  Gutters.extraTinyHMargin,
                ]}
              >
                •
              </Text>
              <Text style={Fonts.textSmallTinyGrayOpacityRegular}>
                {'Expired'}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default NotificationRawItem;
