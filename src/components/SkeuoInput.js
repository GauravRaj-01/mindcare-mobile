import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

/**
 * Recessed neumorphic input field with focus highlight, icon slot,
 * optional password visibility toggle, and accessible error display.
 */
export function SkeuoInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  helperText,
  multiline = false,
  style,
}) {
  const { colors, shadows, radii, spacing, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(secureTextEntry);

  const borderColor = error
    ? colors.statusImportant
    : isFocused
    ? colors.primary
    : colors.surfaceBorderSubtle;

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <Text
          style={[
            typography.caption,
            styles.label,
            { color: colors.textSecondary, marginBottom: spacing.xs },
          ]}
        >
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.inputWell,
          shadows.recessed,
          {
            backgroundColor: colors.surfaceRecessed,
            borderRadius: radii.md,
            borderColor,
            borderWidth: isFocused || error ? 1.5 : 1,
            minHeight: multiline ? 96 : 50,
            alignItems: multiline ? 'flex-start' : 'center',
          },
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={isFocused ? colors.primary : colors.textMuted}
            style={[styles.leftIcon, multiline && styles.leftIconMultiline]}
          />
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidePassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label || placeholder}
          style={[
            typography.body,
            styles.input,
            {
              color: colors.textPrimary,
              textAlignVertical: multiline ? 'top' : 'center',
            },
          ]}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidePassword((prev) => !prev)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={hidePassword ? 'Show password' : 'Hide password'}
            style={styles.eyeButton}
          >
            <Ionicons
              name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <Text
          style={[
            typography.caption,
            { color: colors.statusImportant, marginTop: spacing.xxs },
          ]}
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          style={[
            typography.caption,
            { color: colors.textMuted, marginTop: spacing.xxs },
          ]}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
  },
  inputWell: {
    flexDirection: 'row',
    paddingHorizontal: 14,
  },
  leftIcon: {
    marginRight: 10,
  },
  leftIconMultiline: {
    marginTop: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
});
