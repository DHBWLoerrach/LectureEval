import { Route } from '@react-navigation/native'
import { FormProvider, useForm } from 'react-hook-form'
import { ScrollView, StyleSheet, View } from 'react-native'
import LoadingSpinner from '~/components/LoadingSpinner'
import { Route as RouteEnum } from '~/enums/Route'
import { LectureAssignment } from '~/queries/CourseAssignments/useAssignedLecturesForCourseQuery'
import PrivacyStep from '~/views/Forms/components/PrivacyStep'
import StepContent from '~/views/Forms/components/StepContent'
import StepFooter from '~/views/Forms/components/StepFooter'
import StepHeader from '~/views/Forms/components/StepHeader'
import { useStepLogic } from '~/views/Forms/hooks/useStepLogic'

const style = StyleSheet.create({
    flexBox: {
        flex: 1,
    },
    flexGrow: {
        flexGrow: 1,
    },
    footer: {
        bottom: 0,
        left: 0,
        right: 0,
    },
})

type RouteParams = {
    assignment: LectureAssignment
}

type Props = {
    route: Route<RouteEnum.FormsView, RouteParams>
}

const FormsView = ({ route }: Props) => {
    const { steps, maxSerial, isLoading, activeStep, department, onNext, onPrev, onSubmit } =
        useStepLogic(route.params)

    const form = useForm()
    const { handleSubmit } = form

    if (isLoading) return <LoadingSpinner />

    return (
        <View style={style.flexBox}>
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
                        <View style={style.flexBox}>
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
