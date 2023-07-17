import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Appbar } from 'react-native-paper';

const Header = ({
  options,
  route,
  back,
  navigation,
}: NativeStackHeaderProps) => {
  return (
    <Appbar.Header elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={options.title ?? route.name} />
    </Appbar.Header>
  );
};

export default Header;
