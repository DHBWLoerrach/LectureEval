import { PropsWithChildren, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Snackbar } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { SnackbarContext, SnackbarInfo } from '~/context/SnackbarContext';
import { colors } from '~/styles/colors';

type Props = PropsWithChildren;

const styles = StyleSheet.create({
  label: {
    fontFamily: 'monospace',
    fontSize: RFValue(18),
    lineHeight: RFValue(18),
    textAlign: 'center',
  },
});

/**
 * Manages a snackbar notification system using context, allowing child components to display and dismiss snackbars with a centralized state.
 */
const SnackbarProvider = ({ children }: Props) => {
  const [snackbarInfo, setSnackbarInfo] = useState<SnackbarInfo>();

  const onDismiss = useCallback(() => {
    setSnackbarInfo(undefined);
  }, [setSnackbarInfo]);

  return (
    <SnackbarContext.Provider value={{ setSnackbarInfo }}>
      {children}
      <Portal>
        {snackbarInfo && (
          <Snackbar
            visible
            duration={4000}
            onDismiss={onDismiss}
            action={{
              label: 'x',
              onPress: onDismiss,
              textColor: colors.white,
              labelStyle: styles.label,
            }}
          >
            {snackbarInfo.text}
          </Snackbar>
        )}
      </Portal>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
