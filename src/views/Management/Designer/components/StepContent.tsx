import { FormProvider, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import LoadingSpinner from '~/components/LoadingSpinner'
import { globalStyles } from '~/styles/globalStyles'
import { Step } from '~/types/Step'
import AddOrEditQuestionDialog from '~/views/Management/Designer/components/AddOrEditQuestionDialog'
import Question from '~/views/Management/Designer/components/Question'
import { useQuestionLogic } from '~/views/Management/Designer/hooks/useQuestionLogic'

type Props = {
    step: Step | undefined
}

const styles = StyleSheet.create({
    buttonWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
})

const StepContent = ({ step }: Props) => {
    const form = useForm()

    const { editInfo, questions, isLoading, onAdd, onClose, onDelete, onEdit, onSave } =
        useQuestionLogic({
            step,
        })

    if (isLoading) return <LoadingSpinner />

    return (
        <ScrollView style={globalStyles.flexBox}>
            <FormProvider {...form}>
                <View>
                    {questions?.map((question) => (
                        <Question
                            key={question.id}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            question={question}
                        />
                    ))}
                </View>
            </FormProvider>
            <View style={styles.buttonWrapper}>
                <IconButton
                    icon='plus'
                    mode='contained'
                    onPress={onAdd}
                />
            </View>
            {editInfo && (
                <AddOrEditQuestionDialog
                    editInfo={editInfo}
                    onClose={onClose}
                    onSave={onSave}
                />
            )}
        </ScrollView>
    )
}

export default StepContent
