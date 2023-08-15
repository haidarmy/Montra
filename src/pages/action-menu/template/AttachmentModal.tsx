/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useCallback, useMemo, useState} from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Camera, Gap, Icon, Text} from '@components';
import {theme} from '@themes';
import {CaptureData, IconType} from '@types';

type UploadOptions = 'CAMERA' | 'GALLERY' | 'DOCUMENT';

export interface AttachmentModalProps<T> {
  toggleModalState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  formState: [T, (formType: keyof T, formValue?: any) => void];
}

const AttachmentModal = <T extends {attachment: CaptureData}>({
  formState,
  toggleModalState,
}: AttachmentModalProps<T>) => {
  const setForm = formState[1];
  const [isVisible, setModalVisible] = toggleModalState;
  const [uploadOption, setUploadOption] = useState<JSX.Element>();

  const onBack = () => setUploadOption(undefined);

  const handleCapturedImage = useCallback(
    (image: CaptureData) => {
      setForm('attachment', image);
      setUploadOption(undefined);
      console.log('image', image.uri);
    },
    [setForm],
  );

  const handleUploadOption = useCallback(
    (type: UploadOptions) => {
      setModalVisible(false);
      let option = undefined;
      if (type === 'CAMERA') option = <Camera onBack={onBack} onCapture={handleCapturedImage} />;
      setUploadOption(option);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleCapturedImage],
  );

  const handleRenderOption = useCallback(
    (icon: IconType, label: string, onPres: () => void = () => handleUploadOption('CAMERA')) => (
      <TouchableOpacity onPress={onPres} activeOpacity={0.7} style={styles.options}>
        <Icon type={icon} fill={theme.violet_1} />
        <Text type="regular_2" color="violet_1">
          {label}
        </Text>
      </TouchableOpacity>
    ),
    [handleUploadOption],
  );

  const renderAttachmentModal = useMemo(
    () => (
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
          <View style={styles.optionsContainer}>
            {handleRenderOption('camera', 'Camera')}
            <Gap width={12} />
            {handleRenderOption('gallery', 'Image')}
            <Gap width={12} />
            {handleRenderOption('file', 'Document')}
          </View>
        </View>
      </Modal>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleRenderOption, isVisible],
  );

  return (
    <>
      {renderAttachmentModal}
      {uploadOption}
    </>
  );
};

export default AttachmentModal;

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
  },
  options: {
    borderRadius: 16,
    paddingVertical: 24,
    backgroundColor: theme.violet_5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
