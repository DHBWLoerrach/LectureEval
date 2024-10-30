import { useController, UseControllerProps } from 'react-hook-form'
import { View } from 'react-native'
// eslint-disable-next-line no-restricted-imports
import { TextInput as BaseInput, HelperText } from 'react-native-paper'

type Props = {
    name: string
    label: string
    helperText?: string
    rules?: UseControllerProps['rules']
    /**
     * Whether or not the value of this field should be obscured.
     *
     * @default false
     */
    secureTextEntry?: boolean
}

const TextInput = ({ label, helperText, name, rules, secureTextEntry = false }: Props) => {
    const {
        field: { value, onChange },
        fieldState: { error },
    } = useController({ name, rules })

    return (
        <View>
            <BaseInput
                value={value}
                label={label}
                mode='outlined'
                error={!!error}
                onChangeText={onChange}
                secureTextEntry={secureTextEntry}
            />
            {(helperText || error) && (
                <HelperText
                    visible
                    type={error ? 'error' : 'info'}
                    padding='none'
                >
                    {error?.message ?? helperText}
                </HelperText>
            )}
        </View>
    )
}
export default TextInput
