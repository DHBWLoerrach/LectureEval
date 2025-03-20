import { useIntl } from 'react-intl';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { translations } from '~/translations/translations';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  subtitle: {
    fontSize: RFValue(14),
    textAlign: 'center',
  },
  title: {
    fontSize: RFValue(20),
    textAlign: 'center',
  },
});

const NoConnection = () => {
  const intl = useIntl();

  return (
    <View style={styles.container}>
      <Icon size={48} source="connection" />
      <Text style={styles.title}>
        {intl.formatMessage(translations.noConnection)}
      </Text>
      <Text style={styles.subtitle}>
        {intl.formatMessage(translations.noConnectionDesc)}
      </Text>
    </View>
  );
};

export default NoConnection;
