import { Route } from '@react-navigation/native'
import { FormProvider, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, View } from 'react-native'
import LoadingSpinner from '~/components/LoadingSpinner'
import { Route as RouteEnum } from '~/enums/Route'
import { useQueryOnFocus } from '~/hooks/useQueryOnFocus'
import { LectureAssignment } from '~/queries/CourseAssignments/useAssignedLecturesForCourseQuery'
import { globalStyles } from '~/styles/globalStyles'
import PrivacyStep from '~/views/Forms/components/PrivacyStep'
import StepContent from '~/views/Forms/components/StepContent'
import StepFooter from '~/views/Forms/components/StepFooter'
import StepHeader from '~/views/Forms/components/StepHeader'
import { useStepLogic } from '~/views/Forms/hooks/useStepLogic'

const style = StyleSheet.create({
    flexGrow: {
        flexGrow: 1,
    },
    footer: {
        bottom: 0,
        left: 0,
        right: 0,
    },
})

export type FormsRouteParams = {
    assignment: LectureAssignment
}

type Props = {
    route: Route<RouteEnum.FormsView, FormsRouteParams>
}

/**
 * This component handles a multi-step form view with dynamic steps, navigation, and form submission logic using react-hook-form and custom hooks.
 */
const FormsView = ({ route }: Props) => {
    useQueryOnFocus()

    const { steps, maxSerial, isLoading, activeStep, department, onNext, onPrev, onSubmit } =
        useStepLogic(route.params)

    const form = useForm()
    const { handleSubmit } = form

    if (isLoading) return <LoadingSpinner />

    return (
        <View style={globalStyles.flexBox}>
            <ScrollView contentContainerStyle={style.flexGrow}>
                <StepHeader
                    maxSerial={maxSerial}
                    step={activeStep}
                />
                {steps?.length === 0 || !activeStep ? (
                    <PrivacyStep
                        department={department}
                        onNext={onNext}
                    />
                ) : (
                    <FormProvider {...form}>
                        <View style={globalStyles.flexBox}>
                            <StepContent step={activeStep} />
                        </View>
                        <View style={style.footer}>
                            <StepFooter
                                isFirst={(activeStep?.serial ?? 0) === 0}
                                isLast={(activeStep?.serial ?? 0) === maxSerial}
                                onNext={onNext}
                                onPrev={onPrev}
                                onSubmit={handleSubmit(onSubmit)}
                            />
                        </View>
                    </FormProvider>
                )}
            </ScrollView>
        </View>
    )
}

export default FormsView
