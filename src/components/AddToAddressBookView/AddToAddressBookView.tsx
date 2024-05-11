import React, { Dispatch, SetStateAction } from 'react';
import { Text, View } from 'react-native';

import { t } from 'i18next';
import Variables from 'theme/Variables';

import { CheckBoxView, HorizontalSeparatorView, InputBox } from '..';
import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  setAddressBookUsername: Dispatch<SetStateAction<string>>;
};

const AddToAddressBookView = ({
  isChecked,
  setIsChecked,
  setAddressBookUsername,
}: Props) => {
  const { Layout, Gutters, Colors } = useTheme();

  return (
    <View style={style(Gutters, Layout, Colors).container}>
      <CheckBoxView
        isChecked={isChecked}
        setIsChecked={setIsChecked}
        text={<Text>{t('wallet:add_to_address_book')}</Text>}
      />

      {isChecked && (
        <>
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
          <InputBox
            onChangeValue={prop => {
              setAddressBookUsername(prop.nativeEvent.text);
            }}
            placeholder={t('wallet:label')}
          />
        </>
      )}
    </View>
  );
};

export default AddToAddressBookView;
