import { ComponentProps, useMemo } from 'react'
// eslint-disable-next-line no-restricted-imports
import { Button as BaseButton } from 'react-native-paper'
import { v4 } from 'react-native-uuid/dist/v4'

type Props = ComponentProps<typeof BaseButton>

/**
 * Custom Button Wrapper
 *
 * This component serves as a temporary workaround for an issue with the `Button` component
 * from `react-native-paper` when using React Native's new architecture.
 *
 * ### Problem:
 * The `disabled` prop does not update the button's styles correctly in the new architecture.
 * This is a known issue with `react-native-paper` and is being tracked here:
 * https://github.com/callstack/react-native-paper/issues/4520
 *
 * ### Solution:
 * - This wrapper uses a hack where the `key` attribute is updated based on the `disabled` prop.
 * - This forces the button to rerender and correctly apply the styles associated with `disabled`.
 * - Note: This is a temporary fix and should be removed once the upstream issue is resolved.
 *
 * ### Key Generation:
 * - A UUID is generated using the `uuid` library for each instance of the button.
 * - The `key` is derived by combining the `disabled` state (`'disabled'` or `'enabled'`) with the UUID.
 * - Memoization is used to ensure the `key` updates only when the `disabled` prop changes.
 * - This ensures a unique and consistent `key` per button instance while allowing rerenders
 *   when the `disabled` prop changes.
 *
 * ### Usage:
 * This component can be used exactly like the `Button` component from `react-native-paper`:
 * ```tsx
 * <Button disabled={isDisabled} onPress={handlePress}>
 *   Click Me
 * </Button>
 * ```
 */
// TODO: Remove this component once the issue is resolved.
const Button = ({ children, disabled, ...props }: Props) => {
    const uuid = useMemo(() => v4(), [])

    const key = useMemo(() => {
        return `${disabled ? 'disabled' : 'enabled'}_${uuid}`
    }, [disabled, uuid])

    return (
        <BaseButton
            /**
             * Temporary workaround for react-native-paper issue.
             * Applying a dynamic key forces a rerender when the `disabled` prop changes.
             */
            key={key}
            disabled={disabled}
            {...props}
        >
            {children}
        </BaseButton>
    )
}

export default Button
