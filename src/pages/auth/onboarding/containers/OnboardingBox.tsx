import React from 'react';
import OnboardingAnimate from 'react-native-onboarding-animate';
import {theme} from '@themes';
import OnboardingScene from './OnboardingScene';

const OnboardingBox = () => {
  const handleRenderFirstScene = () => (
    <OnboardingScene
      illustration="money"
      title={'Gain total control\nof your money'}
      subTitle={'Become your own money manager\nand make every cent count'}
    />
  );
  const handleRenderSecondScene = () => (
    <OnboardingScene
      illustration="receipt"
      title={'Know where your\nmoney goes'}
      subTitle={'Track your transaction easily,\nwith categories and financial report '}
    />
  );
  const handleRenderThirdScene = () => (
    <OnboardingScene
      illustration="plan"
      title={'Planning ahead'}
      subTitle={'Setup your budget for each category\nso you in control'}
    />
  );
  const scenes = [
    {
      component: handleRenderFirstScene,
      backgroundColor: theme.white_1,
    },
    {
      component: handleRenderSecondScene,
      backgroundColor: theme.white_1,
    },
    {
      component: handleRenderThirdScene,
      backgroundColor: theme.white_1,
    },
  ];
  return (
    <OnboardingAnimate
      activeColor={theme.violet_1}
      inactiveColor={theme.white_5}
      scenes={scenes}
      enableBackgroundColorTransition={true}
    />
  );
};

export default OnboardingBox;
