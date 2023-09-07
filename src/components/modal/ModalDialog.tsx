import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {Button} from '@components/button';
import {Text} from '@components/text';
import {theme} from '@themes';

type ModalDialogProps = {
  toggleModalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  leftAction(): void;
  rightAction(): void;
};

const ModalDialog = ({toggleModalState, leftAction, rightAction}: ModalDialogProps) => {
  const [isVisible, setModalVisible] = toggleModalState;
  return (
    <Modal
      statusBarTranslucent
      backdropOpacity={0.25}
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={() => setModalVisible(false)}
      onSwipeComplete={() => setModalVisible(false)}
      onBackButtonPress={() => setModalVisible(false)}
      swipeDirection="down"
      deviceHeight={Dimensions.get('screen').height}>
      <View style={styles.container}>
        <View style={styles.line} />
        <Text type="title_3" style={{marginVertical: 16}}>
          Remove this transaction?
        </Text>
        <Text type="regular_2" textAlign="center" color="white_6" style={{marginBottom: 24}}>
          Are you sure do you wanna remove this transaction?
        </Text>
        <View style={styles.buttonWrapper}>
          <Button
            type="solid"
            tittle="No"
            tittleColor="violet_1"
            color="violet_5"
            style={{width: '42.5%'}}
            onPress={leftAction}
          />
          <Button
            type="solid"
            tittle="Yes"
            tittleColor="white_1"
            color="violet_1"
            style={{width: '42.5%'}}
            onPress={rightAction}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ModalDialog;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  line: {
    backgroundColor: theme.violet_4,
    borderRadius: 2,
    width: 36,
    height: 4,
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
  },
  container: {
    backgroundColor: theme.white_1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: Dimensions.get('screen').width,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
