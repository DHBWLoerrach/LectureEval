import { Route } from '@react-navigation/native'
import { StyleSheet, View } from 'react-native'
import LoadingSpinner from '~/components/LoadingSpinner'
import { Route as RouteEnum } from '~/enums/Route'
import AddOrEditStepDialog from '~/views/Management/Designer/components/AddOrEditStepDialog'
import PrivacyStep from '~/views/Management/Designer/components/PrivacyStep'
import StepContent from '~/views/Management/Designer/components/StepContent'
import StepFooter from '~/views/Management/Designer/components/StepFooter'
import StepHeader from '~/views/Management/Designer/components/StepHeader'
import { useStepLogic } from '~/views/Management/Designer/hooks/useStepLogic'

export type DesignerRouteParams = {
    formId: number
    departmentId: number
}

type Props = {
    route: Route<RouteEnum.FormDesigner, DesignerRouteParams>
}

const style = StyleSheet.create({
    flexBox: {
        flex: 1,
    },
})

const Designer = ({ route }: Props) => {
    const {
        steps,
        editInfo,
        maxSerial,
        isLoading,
        activeStep,
        department,
        onAdd,
        onEdit,
        onNext,
        onPrev,
        onSave,
        onClose,
        onDelete,
    } = useStepLogic(route.params)

    if (isLoading) return <LoadingSpinner />

    return (
        <View style={style.flexBox}>
            <StepHeader
                onEdit={onEdit}
                onDelete={onDelete}
                maxSerial={maxSerial}
                step={activeStep}
            />
            {steps?.length === 0 || !activeStep ? (
                <PrivacyStep
                    isDesigner
                    department={department}
                    onAddStep={onAdd}
                />
            ) : (
                <StepContent step={activeStep} />
            )}
            <StepFooter
                editable
                isFirst={(activeStep?.serial ?? 0) === 0}
                isLast={(activeStep?.serial ?? 0) === maxSerial}
                onNext={steps?.length === 0 || activeStep?.serial === maxSerial ? onAdd : onNext}
                onPrev={onPrev}
            />
            {editInfo && (
                <AddOrEditStepDialog
                    editInfo={editInfo}
                    onClose={onClose}
                    onSave={onSave}
                />
            )}
        </View>
    )
}

export default Designer
