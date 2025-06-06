import { 
  Text as DefaultText, 
  View as DefaultView, 
  TextInput as DefaultTextInput, 
  TouchableOpacity as DefaultTouchableOpacity,
  TextInputProps as DefaultTextInputProps,
  TouchableOpacityProps as DefaultTouchableOpacityProps
} from 'react-native';

import Colors from '@/src/constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInputProps;
export type TouchableProps = ThemeProps & DefaultTouchableOpacityProps;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function SecondaryText(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'textSecondary');

  return <DefaultText style={[{ color, fontSize: 14 }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function CardView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'cardBackground');
  const borderColor = useThemeColor({}, 'border');

  return (
    <DefaultView 
      style={[{ 
        backgroundColor, 
        borderRadius: 12,
        borderWidth: 1,
        borderColor,
        padding: 16
      }, style]} 
      {...otherProps} 
    />
  );
}

export function TextInput(props: TextInputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <DefaultTextInput
      style={[{ 
        color, 
        backgroundColor, 
        borderColor, 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 12,
        fontSize: 16
      }, style]}
      placeholderTextColor={useThemeColor({}, 'textSecondary')}
      {...otherProps}
    />
  );
}

export function PrimaryButton(props: TouchableProps) {
  const { style, lightColor, darkColor, children, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'buttonPrimary');
  const textColor = useThemeColor({}, 'buttonPrimaryText');

  return (
    <DefaultTouchableOpacity
      style={[{ 
        backgroundColor, 
        padding: 16, 
        borderRadius: 8, 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50
      }, style]}
      {...otherProps}
    >
      <DefaultText style={{ color: textColor, fontWeight: '600', fontSize: 16 }}>
        {children}
      </DefaultText>
    </DefaultTouchableOpacity>
  );
}

export function SecondaryButton(props: TouchableProps) {
  const { style, lightColor, darkColor, children, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'buttonSecondary');
  const textColor = useThemeColor({}, 'buttonSecondaryText');

  return (
    <DefaultTouchableOpacity
      style={[{ 
        backgroundColor, 
        padding: 16, 
        borderRadius: 8, 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
        borderWidth: 1,
        borderColor: useThemeColor({}, 'border')
      }, style]}
      {...otherProps}
    >
      <DefaultText style={{ color: textColor, fontWeight: '600', fontSize: 16 }}>
        {children}
      </DefaultText>
    </DefaultTouchableOpacity>
  );
}