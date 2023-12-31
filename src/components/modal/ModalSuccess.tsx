import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {Icon} from '@components/icon';
import {Gap} from '@components/layout';
import {Text} from '@components/text';
import {theme} from '@themes';

type ModalSuccessProps = {
  toggleModalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  message: string;
  onSuccess(): void;
};

const ModalSuccess = ({toggleModalState, message, onSuccess}: ModalSuccessProps) => {
  const isVisible = toggleModalState[0];

  useEffect(() => {
    isVisible &&
      setTimeout(() => {
        onSuccess();
      }, 2000);
  }, [isVisible]);

  return (
    <Modal
      statusBarTranslucent
      backdropOpacity={0.25}
      style={styles.modal}
      isVisible={isVisible}
      animationIn={'pulse'}
      animationOut={'fadeOut'}
      deviceHeight={Dimensions.get('screen').height}>
      <View style={styles.content}>
        <Icon type="success" fill={theme.blue_1} width={64} height={64} />
        <Gap height={10} />
        <Text type="regular_1" textAlign="center">
          {message}
        </Text>
      </View>
    </Modal>
  );
};

export default ModalSuccess;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: theme.white_1,
    width: '100%',
    height: '20%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
