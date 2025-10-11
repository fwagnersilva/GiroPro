import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

type Props = {
  initialProgress?: number;
  className?: string;
};

export type ProgressBarRef = {
  setProgress: (value: number) => void;
};

export const ProgressBar = forwardRef<ProgressBarRef, Props>(
  ({ initialProgress = 0, className = '' }, ref) => {
    const [progress, setProgressState] = useState<number>(initialProgress);

    useImperativeHandle(ref, () => {
      return {
        setProgress: (value: number) => {
          setProgressState(value);
        },
      };
    }, []);

    return (
      <View className={twMerge(` bg-[#EAEAEA]`, className)}>
        <View style={{ width: `${progress}%`, backgroundColor: '#000', height: 2 }} />
      </View>
    );
  }
);

