import { useState } from 'react';
import { View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import Header from '~/components/Header';
import LoadingSpinner from '~/components/LoadingSpinner';
import { globalStyles } from '~/styles/globalStyles';
import { theme } from '~/styles/theme';
import PendingRatings from '~/views/Student/components/PendingRatings';
import RatedLectures from '~/views/Student/components/RatedLectures';
import { useStudentViewLogic } from '~/views/Student/hooks/useStudentViewLogic';
import { StudentViewType } from '~/views/Student/types/StudentViewType';

const StudentView = () => {
  const [currentView, setCurrentView] = useState(
    StudentViewType.PendingRatings
  );

  const { isLoading, semesters, viewButtons, pendingLectures, ratedLectures } =
    useStudentViewLogic();

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={globalStyles.flexBox}>
      <View>
        <Header />
        <SegmentedButtons
          theme={theme}
          value={currentView}
          buttons={viewButtons}
          style={globalStyles.segmentedButtons}
          onValueChange={(value) => setCurrentView(value as StudentViewType)}
        />
      </View>
      {currentView === StudentViewType.PendingRatings ? (
        <PendingRatings lectures={pendingLectures} semesters={semesters} />
      ) : (
        <RatedLectures lectures={ratedLectures} semesters={semesters} />
      )}
    </View>
  );
};

export default StudentView;
