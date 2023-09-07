/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {Animated, Image, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CameraApi, Camera as CameraKit, CameraType, Orientation} from 'react-native-camera-kit';
import {Icon} from '@components';
import {theme} from '@themes';
import {CaptureData} from '@types';

interface CameraProps {
  onCapture(image: CaptureData): void;
  onBack(): void;
}

const Camera = ({onBack, onCapture}: CameraProps) => {
  const cameraRef = useRef<CameraApi>(null);
  const [captureImages, setCaptureImages] = useState<CaptureData>({} as CaptureData);
  const [torchMode, setTorchMode] = useState(false);
  const [zoom, setZoom] = useState<number | undefined>();
  const [orientationAnim] = useState(new Animated.Value(3));

  const rotateUi = true;
  const uiRotation = orientationAnim.interpolate({
    inputRange: [1, 4],
    outputRange: ['180deg', '-90deg'],
  });
  const uiRotationStyle = useMemo(
    () => (rotateUi ? {transform: [{rotate: uiRotation}]} : undefined),
    [rotateUi, uiRotation],
  );

  const isCapturing = useRef(false);

  const onSetTorch = useCallback(() => {
    setTorchMode(!torchMode);
  }, [torchMode]);

  const onShutterPressed = useCallback(async () => {
    if (!cameraRef.current || isCapturing.current) return;
    let image: CaptureData | undefined;
    try {
      isCapturing.current = true;
      image = await cameraRef.current.capture();
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      else message = String(error);
      console.log(message);
    } finally {
      isCapturing.current = false;
    }
    if (!image) return;

    setCaptureImages(image);
  }, []);

  function CaptureButton({onPress, children}: {onPress: () => void; children?: React.ReactNode}) {
    const w = 80,
      brdW = 4,
      spc = 6;
    const cInner = 'white',
      cOuter = 'white';
    return (
      <TouchableOpacity onPress={onPress} style={{width: w, height: w}}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: w,
            height: w,
            borderColor: cOuter,
            borderWidth: brdW,
            borderRadius: w / 2,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: brdW + spc,
            top: brdW + spc,
            width: w - (brdW + spc) * 2,
            height: w - (brdW + spc) * 2,
            backgroundColor: cInner,
            borderRadius: (w - (brdW + spc) * 2) / 2,
          }}
        />
        {children}
      </TouchableOpacity>
    );
  }

  const rotateUiTo = useCallback(
    (rotationValue: number) => {
      Animated.timing(orientationAnim, {
        toValue: rotationValue,
        useNativeDriver: true,
        duration: 200,
        isInteraction: false,
      }).start();
    },
    [orientationAnim],
  );

  const renderTopButton = useMemo(
    () =>
      !captureImages.uri && (
        <>
          <TouchableOpacity style={[styles.floatingButton, {left: 40, top: 40}]} onPress={onBack}>
            <Animated.View style={uiRotationStyle}>
              <Icon type="cross" fill={theme.white_5} width={24} />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.floatingButton,
              {right: 40, top: 40, backgroundColor: 'rgba(128,128,128,0.5)'},
            ]}
            onPress={onSetTorch}>
            <Animated.View style={uiRotationStyle}>
              <Icon type="flash" fill={theme.white_5} />
            </Animated.View>
          </TouchableOpacity>
        </>
      ),
    [captureImages.uri, onSetTorch, uiRotationStyle, onBack],
  );

  const renderCameraPreview = useMemo(
    () => (
      <>
        <CameraKit
          ref={cameraRef}
          style={styles.cameraPreview}
          cameraType={CameraType.Back}
          resetFocusWhenMotionDetected
          zoom={zoom}
          maxZoom={10}
          onZoom={(e: {nativeEvent: {zoom: React.SetStateAction<number | undefined>}}) => {
            setZoom(e.nativeEvent.zoom);
          }}
          torchMode={torchMode ? 'on' : 'off'}
          onOrientationChange={(e: {nativeEvent: {orientation: any}}) => {
            switch (e.nativeEvent.orientation) {
              case Orientation.PORTRAIT_UPSIDE_DOWN:
                rotateUiTo(1);
                break;
              case Orientation.LANDSCAPE_LEFT:
                rotateUiTo(2);
                break;
              case Orientation.PORTRAIT:
                rotateUiTo(3);
                break;
              case Orientation.LANDSCAPE_RIGHT:
                rotateUiTo(4);
                break;
              default:
                break;
            }
          }}
        />
        {captureImages.uri && (
          <Image
            source={{uri: captureImages.uri}}
            style={styles.cameraPreview}
            resizeMode="cover"
          />
        )}
      </>
    ),
    [rotateUiTo, torchMode, zoom, captureImages.uri],
  );

  const renderConfirmationButton = useMemo(
    () => (
      <>
        <TouchableOpacity
          style={[
            styles.floatingButton,
            {left: 100, bottom: 60, backgroundColor: 'rgba(255,255,255,0.25)'},
          ]}
          onPress={() => setCaptureImages({} as CaptureData)}>
          <Animated.View style={uiRotationStyle}>
            <Icon type="close" fill={theme.red_1} width={32} />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.floatingButton,
            {right: 100, bottom: 60, backgroundColor: 'rgba(255,255,255,0.25)'},
          ]}
          onPress={() => onCapture(captureImages)}>
          <Animated.View style={uiRotationStyle}>
            <Icon type="check" fill={theme.blue_1} width={28} />
          </Animated.View>
        </TouchableOpacity>
      </>
    ),
    [captureImages, onCapture, uiRotationStyle],
  );
  const renderBottomButton = useMemo(
    () =>
      !captureImages.uri ? (
        <View style={styles.bottomButton}>
          <CaptureButton onPress={onShutterPressed} />
        </View>
      ) : (
        renderConfirmationButton
      ),
    [onShutterPressed, renderConfirmationButton, captureImages.uri],
  );

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <StatusBar translucent backgroundColor="transparent" />
      {renderTopButton}
      {renderCameraPreview}
      {renderBottomButton}
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    zIndex: 99,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    height: '100%',
    width: '100%',
  },
  bottomButton: {
    position: 'absolute',
    width: '100%',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
